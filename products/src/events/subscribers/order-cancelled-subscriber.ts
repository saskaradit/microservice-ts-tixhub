import { Listener, OrderCancelledEvent, Subjects } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { Product } from '../../models/products'
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher'
import { queueGroupName } from './queue-group-name'

export class OrderCancelledSubscriber extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const product = await Product.findById(data.item.id)
    if (!product) {
      throw new Error('Product not found')
    }

    product.set({ orderId: undefined })
    await product.save()
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      version: product.version,
      desc: product.id,
      userId: product.userId,
    })
    msg.ack()
  }
}
