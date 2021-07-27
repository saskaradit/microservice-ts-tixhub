import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, { ...body, ...props })

      if (onSuccess) {
        onSuccess(response.data)
      }
      return response.data
    } catch (error) {
      setErrors(
        <div className='alert alert-danger'>
          <p className='my-0'>{error.response.data.errors[0].message}</p>
        </div>
      )
    }
  }

  return { doRequest, errors }
}
