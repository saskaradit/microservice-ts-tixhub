import express, { Request, Response } from 'express'
import { Ticket } from '../models/tickets'
import {
  RouteError,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
} from '@rad-sas/common'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new RouteError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    res.send(ticket)
  }
)

export { router as updateTicketRouter }
