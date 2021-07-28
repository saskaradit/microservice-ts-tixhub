import express from 'express'
import { currentUser } from '@rad-sas/common'
import { User } from '../models/user'

const router = express.Router()

router.put('/api/users/edit', currentUser, async (req, res) => {
  const user = await User.findById(req.currentUser!.id)

  user!.set({
    email: req.body.email,
  })
  await user!.save()
  res.send({ currentUser: user || null })
})

export { router as updateUserRouter }
