import { Ticket } from '../tickets'

it('implements optimistic concurrency control', async (done) => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'hehe',
    price: 20,
    userId: '20',
    desc: 'heje',
    schedule: new Date(),
    image:
      'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
  })

  // save the ticket to the database
  await ticket.save()

  // fetch the ticket twice
  const firstTicket = await Ticket.findById(ticket.id)
  const secondTicket = await Ticket.findById(ticket.id)

  // make two separate changes to the tickets we fetched
  firstTicket!.set({ price: 10 })
  secondTicket!.set({ price: 20 })

  // save the first
  await firstTicket!.save()

  // save the second and expect an error
  try {
    await secondTicket!.save()
  } catch (error) {
    return done()
  }

  throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'hehe',
    price: 20,
    userId: '2020',
    desc: 'heje',
    schedule: new Date(),
    image:
      'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
