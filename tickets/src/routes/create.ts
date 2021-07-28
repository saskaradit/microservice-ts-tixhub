import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models/tickets'
import { requireAuth, validateRequest } from '@rad-sas/common'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('desc').not().isEmpty().withMessage('Please input a description '),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('image').not().isEmpty().withMessage('Please input an image link'),
    body('schedule')
      .not()
      .isEmpty()
      .withMessage('A ticket needs to have a date'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, image, desc, schedule } = req.body

    const ticket = Ticket.build({
      title,
      price,
      image,
      desc,
      schedule,
      userId: req.currentUser!.id,
    })
    await ticket.save()
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      schedule: ticket.schedule,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
