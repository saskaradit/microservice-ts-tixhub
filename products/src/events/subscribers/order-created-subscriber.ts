import { Listener, OrderCreatedEvent, Subjects } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { Product } from '../../models/products'
import { ProductCreatedPublisher } from '../publishers/product-created-publisher'
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedSubscriber extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const product = await Product.findById(data.item.id)

    if (!product) {
      throw new Error('Product not found')
    }

    // mark the product as reserved
    product.set({ orderId: data.id })

    // save the product
    await product.save()
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      version: product.version,
      title: product.title,
      price: product.price,
      desc: product.desc,
      userId: product.userId,
      orderId: product.orderId,
    })

    // ack
    msg.ack()
  }
}
