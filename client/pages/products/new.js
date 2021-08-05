import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/dist/next-server/server/router'

const NewProduct = () => {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  // const { doRequest, errors } = useRequest({
  //   url: '/api/products',
  //   method: 'post',
  //   body: {
  //     title,
  //     price,
  //     desc,
  //     image,
  //   },
  //   onSuccess: () => Router.push('/'),
  // })

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(image)
    // doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }

  return (
    <div>
      <h1>Create a ticket</h1>
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
            type='file'
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        {/* {errors} */}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default NewProduct