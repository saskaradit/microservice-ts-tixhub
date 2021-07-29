import express from 'express'
import { currentUser } from '@rad-sas/common'
import { User } from '../models/user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  if (!req.currentUser) {
    res.send({ currentUser: null })
  } else {
    const user = await User.findById(req.currentUser!.id)
    res.send({ currentUser: user })
  }
})

export { router as currentUserRouter }
