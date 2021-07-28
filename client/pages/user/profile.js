import Link from 'next/link'

const ProfilePage = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser.username}</h1>
      <h4>{currentUser.email}</h4>
      <Link href='/profile/update'>
        <button className='btn btn-primary'>Edit</button>
      </Link>
    </div>
  )
}

export default ProfilePage
