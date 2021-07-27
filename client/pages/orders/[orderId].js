import { useEffect, useState } from 'react'
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeleft, setTimeleft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const minuteLeft = Math.round(
        (new Date(order.expiresAt) - new Date()) / 1000 / 60
      )
      setTimeleft(minuteLeft)
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 60000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeleft < 0) {
    return <div>Order has expired</div>
  }

  return (
    <div>
      <div>Time Left: {timeleft} minutes before expiring </div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51Hp4eGErCpQSuQA2EmSQWOMiJA93gAKE5Y4imksgbC4j7jcCuZ06AWgQiZ62tysR9xhHt2TDoaSjD5ruqQjN5f9500Bn8Sx1N3'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
  // put in 4242 4242 4242 4242 and any cvc and any future date to check the payment
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
