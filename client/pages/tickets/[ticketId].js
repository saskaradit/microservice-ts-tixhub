import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import Link from 'next/link'

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  const getActions = () => {
    if (!currentUser) {
      return (
        <Link href='/auth/signup'>
          <button className='btn btn-primary'>Sign Up</button>
        </Link>
      )
    } else if (ticket.userId == currentUser.id) {
      return (
        <Link
          href='/tickets/update/[ticketId]'
          as={`/tickets/update/${ticket.id}`}
        >
          <button className='btn btn-primary'>Edit</button>
        </Link>
      )
    } else if (currentUser) {
      return (
        <button onClick={() => doRequest()} className='btn btn-primary'>
          Purchase
        </button>
      )
    }
  }

  return (
    <div>
      <img src={ticket.image} alt='' className='card-img-top' />
      <h1>{ticket.title}</h1>
      <h6>{ticket.schedule}</h6>
      <p>{ticket.desc}</p>
      <p>Price: {ticket.price}</p>
      {errors}
      <div>{getActions()}</div>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query
  const { data } = await client.get(`api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow
