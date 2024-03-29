import Link from 'next/link'

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'Sell Product', href: '/products/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Profile', href: '/user/profile' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link href={href} className='nav-link'>
            <a className='nav-link text-dark'>{label}</a>
          </Link>
        </li>
      )
    })

  return (
    <nav className='navbar navbar-light bg-light mb-5'>
      <div className='container'>
        <Link href='/'>
          <a className='navbar-brand'>TixHub</a>
        </Link>

        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>{links}</ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
