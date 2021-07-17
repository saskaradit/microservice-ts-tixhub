import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { RouteError, errorHandler, currentUser } from '@rad-sas/common'
import { createOrderRouter } from './routes/create'
import { deleteOrderRouter } from './routes/delete'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes'

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

app.use(indexOrderRouter)
app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async (req, res) => {
  throw new RouteError()
})

app.use(errorHandler)

export { app }
