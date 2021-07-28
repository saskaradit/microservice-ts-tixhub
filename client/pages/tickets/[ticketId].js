import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  return (
    <div>
      <img src={ticket.image} alt='' className='card-img-top' />
      <h1>{ticket.title}</h1>
      <h6>{ticket.schedule}</h6>
      <p>{ticket.desc}</p>
      <p>Price: {ticket.price}</p>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow
