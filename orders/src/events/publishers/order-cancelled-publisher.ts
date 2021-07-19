import { Subjects, Publisher, OrderCancelledEvent } from '@rad-sas/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
