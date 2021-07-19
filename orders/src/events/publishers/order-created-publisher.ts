import { Publisher, OrderCreatedEvent, Subjects } from '@rad-sas/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
