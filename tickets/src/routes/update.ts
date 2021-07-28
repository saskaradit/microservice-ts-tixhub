import express, { Request, Response } from 'express'
import { Ticket } from '../models/tickets'
import { body } from 'express-validator'
import {
  RouteError,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@rad-sas/common'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new RouteError()
    }
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
      desc: req.body.desc,
      image: req.body.image,
    })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      schedule: ticket.schedule,
      version: ticket.version,
    })

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
