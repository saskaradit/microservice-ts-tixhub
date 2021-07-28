import express from 'express'
import { currentUser } from '@rad-sas/common'
import { User } from '../models/user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  const user = await User.findById(req.currentUser!.id)
  res.send({ currentUser: user || null })
})

export { router as currentUserRouter }
