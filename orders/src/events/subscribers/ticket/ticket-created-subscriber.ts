import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@rad-sas/common'
import { Item } from '../../../models/item'
import { queueGroupName } from '../queue-group-name'

export class TicketCreatedSubscriber extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    const item = Item.build({
      id,
      title,
      price,
    })
    await item.save()

    msg.ack()
  }
}
