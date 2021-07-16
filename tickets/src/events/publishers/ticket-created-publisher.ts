import { Publisher, Subjects, TicketCreatedEvent } from '@rad-sas/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
