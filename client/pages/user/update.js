import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const UpdateProfile = ({ currentUser }) => {
  const [email, setEmail] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/edit',
    method: 'put',
    body: {
      email,
    },
    onSuccess: () => Router.push('/user/profile'),
  })

  const onSubmit = (event) => {
    event.preventDefault()

    doRequest()
  }

  return (
    <div>
      <h1>Update a profile</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Username: {currentUser.username}</label>
        </div>
        <div className='form-group'>
          <label>Email</label>
          <input
            className='form-control'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Edit</button>
      </form>
    </div>
  )
}

export default UpdateProfile
