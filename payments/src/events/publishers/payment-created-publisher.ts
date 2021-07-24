import { Subjects, Publisher, PaymentCreatedEvent } from '@rad-sas/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
