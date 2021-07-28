import { Listener, OrderCreatedEvent, Subjects } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/tickets'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedSubscriber extends Listener<OrderCreatedEvent> {
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
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      schedule: ticket.schedule,
      userId: ticket.userId,
      orderId: ticket.orderId,
    })

    // ack
    msg.ack()
  }
}
