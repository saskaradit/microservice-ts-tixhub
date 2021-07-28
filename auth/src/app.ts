import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signUpRouter } from './routes/signup'
import { signOutRouter } from './routes/signout'
import { RouteError, errorHandler } from '@rad-sas/common'
import { updateUserRouter } from './routes/update'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(updateUserRouter)

app.all('*', async (req, res) => {
  throw new RouteError()
})

app.use(errorHandler)

export { app }
