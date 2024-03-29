import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { RouteError, errorHandler, currentUser } from '@rad-sas/common'
import { createProductRouter } from './routes/create'
import { showProductRouter } from './routes/show'
import { indexProductRouter } from './routes'
import { updateProductRouter } from './routes/update'

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

app.use(indexProductRouter)
app.use(createProductRouter)
app.use(showProductRouter)
app.use(updateProductRouter)

app.all('*', async (req, res) => {
  throw new RouteError()
})

app.use(errorHandler)

export { app }
