import logoHeader from '@/assets/img/header/logo-large.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function DashboardHeader() {
  return (
    <nav className='main-header navbar navbar-expand navbar-dark d-lg-none d-flex justify-content-center'>
      <ul className='navbar-nav'>
        <li className='nav-item'>
          <a className='nav-link' data-widget='pushmenu' href='#' role='button'>
            <i className='fas fa-bars' />
          </a>
        </li>
      </ul>
      <div className='logo'>
        <Link href='/member/dashboard'>
          <Image
            src={logoHeader}
            alt='Large Logo'
            width={100}
            height={33}
            style={{ height: '100%' }}
          />
        </Link>
      </div>
    </nav>
  )
}
