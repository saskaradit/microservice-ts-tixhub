import { Publisher, Subjects, ProductCreatedEvent } from '@rad-sas/common'

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated
}
