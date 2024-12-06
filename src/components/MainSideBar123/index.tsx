import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

const MainSidebar123: React.FC = () => {
  return (
    <aside className='main-sidebar sidebar-dark-primary elevation-4'>
      {/* Brand Logo */}
      <Link href='/' className='brand-link'>
        <Image
          src='/img/AdminLTELogo.png'
          alt='AdminLTE Logo'
          className='brand-image img-circle elevation-3'
          width={33}
          height={33}
          style={{ opacity: 0.8 }}
        />
        <span className='brand-text font-weight-light'>AdminLTE 3</span>
      </Link>

      {/* Sidebar */}
      <div className='sidebar'>
        {/* Sidebar user panel */}
        <div className='user-panel mt-3 pb-3 mb-3 d-flex'>
          <div className='image'>
            <Image
              src='/img/user2-160x160.jpg'
              className='img-circle elevation-2'
              alt='User Image'
              width={160}
              height={160}
            />
          </div>
          <div className='info'>
            <Link href='#' className='d-block'>
              Alexander Pierce
            </Link>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className='mt-2'>
          <ul className='nav nav-pills nav-sidebar flex-column' data-widget='treeview' role='menu'>
            <li className='nav-item menu-open'>
              <Link href='#' className='nav-link active'>
                <i className='nav-icon fas fa-tachometer-alt'></i>
                <p>
                  Starter Pages
                  <i className='right fas fa-angle-left'></i>
                </p>
              </Link>
              <ul className='nav nav-treeview'>
                <li className='nav-item'>
                  <Link href='#' className='nav-link active'>
                    <i className='far fa-circle nav-icon'></i>
                    <p>Active Page</p>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='#' className='nav-link'>
                    <i className='far fa-circle nav-icon'></i>
                    <p>Inactive Page</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className='nav-item'>
              <Link href='#' className='nav-link'>
                <i className='nav-icon fas fa-th'></i>
                <p>
                  Simple Link
                  <span className='right badge badge-danger'>New</span>
                </p>
              </Link>
            </li>
          </ul>
        </nav>
        <div className='brand-link d-flex justify-content-between align-items-center'>
          <a className='brand-link' href='index3.html'>
            <img
              src='dist/img/AdminLTELogo.png'
              alt='AdminLTE Logo'
              className='brand-image img-circle elevation-3'
            />
            <span className='brand-text font-weight-light'>AdminLTE 3</span>
          </a>
          <a className='pushmenu' data-widget='pushmenu' href='#' role='button'>
            <i className='fas fa-bars'></i>
          </a>
        </div>
      </div>
    </aside>
  )
}

export default MainSidebar123
