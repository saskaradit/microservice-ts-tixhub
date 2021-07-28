import Link from 'next/dist/client/link'

const ProfilePage = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser.username}</h1>
      <h4>{currentUser.email}</h4>
    </div>
  )
}

export default ProfilePage
