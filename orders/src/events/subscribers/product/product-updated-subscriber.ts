import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ProductUpdatedEvent } from '@rad-sas/common'
import { queueGroupName } from '../queue-group-name'
import { Item } from '../../../models/item'

export class ProductUpdatedSubscriber extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated
  queueGroupName = queueGroupName

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
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
