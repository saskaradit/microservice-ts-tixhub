import { Listener, OrderCreatedEvent, Subjects } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queues'

export class OrderCreatedSubscriber extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    })

    msg.ack()
  }
}
