import { useState } from 'react'
import useRequest from '../../../hooks/use-request'
import Router from 'next/router'
import Link from 'next/link'

const UpdateTicket = ({ ticket }) => {
  const [title, setTitle] = useState(ticket.title)
  const [desc, setDesc] = useState(ticket.desc)
  const [price, setPrice] = useState(ticket.price)
  const [image, setImage] = useState(ticket.image)
  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: 'put',
    body: {
      title,
      price,
      desc,
      image,
    },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = (event) => {
    event.preventDefault()

    doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }

  return (
    <div className='mb-6'>
      <h1>Update a ticket</h1>
      <img src={ticket.image} alt='' className='card-img-top mb-3' />
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            className='form-control'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Description</label>
          <textarea
            className='form-control'
            type='text'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            className='form-control'
            type='text'
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Image Url</label>
          <input
            className='form-control'
            type='text'
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        {errors}
        <div>
          <button className='btn btn-primary'>Save</button>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <button className='btn btn-danger'>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  )
}

UpdateTicket.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query
  const { data } = await client.get(`api/tickets/${ticketId}`)

  console.log(data)

  return { ticket: data }
}

export default UpdateTicket
