import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { RouteError, errorHandler, currentUser } from '@rad-sas/common'
// import { createTicketRouter } from './routes/create'
// import { showTicketRouter } from './routes/show'
// import { indexTicketRouter } from './routes'
// import { updateTicketRouter } from './routes/update'

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

// app.use(indexTicketRouter)
// app.use(createTicketRouter)
// app.use(showTicketRouter)
// app.use(updateTicketRouter)

app.all('*', async (req, res) => {
  throw new RouteError()
})

app.use(errorHandler)

export { app }
