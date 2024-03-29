import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      name,
      username,
      password,
    },
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label> Full Name</label>
        <input
          type='text'
          className='form-control'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label> Email Address</label>
        <input
          type='text'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label> Username</label>
        <input
          type='text'
          className='form-control'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label> Password</label>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  )
}
