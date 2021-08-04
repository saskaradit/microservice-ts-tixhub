import { Publisher, Subjects, ProductUpdatedEvent } from '@rad-sas/common'

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated
}
