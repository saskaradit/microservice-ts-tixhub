import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent } from '@rad-sas/common'
import { Item } from '../../../models/item'
import { queueGroupName } from '../queue-group-name'

export class TicketUpdatedSubscriber extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const item = await Item.findByPrevVersion(data)
    if (!item) {
      throw new Error('Item not found')
    }

    const { title, price } = data
    item.set({ title, price })
    await item.save()

    msg.ack()
  }
}
