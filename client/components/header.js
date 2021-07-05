import Link from 'next/link'

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signou' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(() => {
      return (
        <li key={href}>
          <Link href='/'>
            <a className='navbar-link'>{label}</a>
          </Link>
        </li>
      )
    })

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>TixHub</a>
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  )
}
