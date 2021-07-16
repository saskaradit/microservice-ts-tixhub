import { Publisher, Subjects, TicketUpdatedEvent } from '@rad-sas/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
