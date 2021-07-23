import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { RouteError, errorHandler, currentUser } from '@rad-sas/common'
import { createCharge } from './routes/create'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)
app.use(createCharge)

app.all('*', async (req, res) => {
  throw new RouteError()
})

app.use(errorHandler)

export { app }

// CREATE STRIPE KEY WITH SECRETS
// kubectl create secret generic stripe-secret --from-literal STRIP_KEY=hehe
