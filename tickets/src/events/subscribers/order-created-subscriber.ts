import { Listener, OrderCreatedEvent, Subjects } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/tickets'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // if no ticket, throw err
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // mark ticket as reserved, by setting its orderId
    ticket.set({ orderId: data.id })

    // save ticket
    await ticket.save()

    // ack
    msg.ack()
  }
}
