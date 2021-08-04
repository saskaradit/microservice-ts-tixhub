import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ProductCreatedEvent } from '@rad-sas/common'
import { Item } from '../../../models/item'
import { queueGroupName } from '../queue-group-name'

export class ProductCreatedSubscriber extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated
  queueGroupName = queueGroupName

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
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
