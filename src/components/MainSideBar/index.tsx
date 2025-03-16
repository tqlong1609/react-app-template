import { FC } from 'react'

import logoHeader from '@/assets/img/header/logo-large.svg'
import logoSmall from '@/assets/img/header/logo-small.png'
import { ROUTE_PATHS } from '@/configs/router'
import usePartnerAttributes from '@/hooks/usePartnerAttributes'
import { useAuthContext } from '@/providers/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './MainSideBar.module.scss'

interface MainSideBarProps {}

const MainSideBar: FC<MainSideBarProps> = () => {
  const router = useRouter()

  const { user, signOut } = useAuthContext()
  const token = user?.token

  const { data: partnerAttributes } = usePartnerAttributes(token)

  const onSignOut = async () => {
    try {
      await signOut()
      router.replace({
        pathname: ROUTE_PATHS.SIGNIN
      })
    } catch (error: any) {
      if (error.code === 'NetworkError') {
        window.alert('ネットワークエラーです。ネットワークの接続をご確認ください')
      } else {
        console.error(error)
        window.alert('サインアウトに失敗しました')
      }
    }
  }

  return (
    <aside
      className='main-sidebar sidebar-dark-primary elevation-4 sidebar-no-expand'
      style={{ height: '100%' }}
    >
      <Link href='/member/dashboard' className={`brand-link ${styles.brand}`}>
        <span className='brand-link logo-switch'>
          <Image
            src={logoSmall}
            alt='Small Logo'
            className='brand-image-xl logo-xs'
            width={160}
            height={40}
          />
          <Image
            src={logoHeader}
            alt='Large Logo'
            className='brand-image-xs logo-xl'
            width={160}
            height={33}
            style={{ height: '100%' }}
          />
        </span>
      </Link>

      <div className='sidebar'>
        {partnerAttributes && (
          <div className='user-panel mt-3 pb-3 mb-3 d-flex'>
            <div className='image'>
              <Image
                src={partnerAttributes.logoUrl}
                className='elevation-2'
                alt='パートナーイメージ'
                width={160}
                height={33}
              />
            </div>
            <div className='info'>
              <span className={`sidebar-jp-text ${styles.username}`}>{partnerAttributes.name}</span>
            </div>
          </div>
        )}

        <nav className='mt-2'>
          <ul
            className='nav nav-pills nav-sidebar flex-column'
            data-widget='treeview'
            role='menu'
            data-accordion='false'
          >
            <li className='nav-item'>
              <Link href='/member/dashboard' className='nav-link'>
                <i className='nav-icon fas fa-table' />
                <p>
                  <span className='sidebar-jp-text'>ダッシュボード</span>
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.sidebarBottom}>
        <nav className='mt-2' onClick={onSignOut}>
          <ul className='nav nav-pills nav-sidebar' role='menu'>
            <li
              className='nav-item'
              style={{
                width: '100%',
                cursor: 'pointer'
              }}
            >
              <div className='nav-link'>
                <i className={`nav-icon fas fa-sign-out-alt ${styles.icon}`} />
                <p className={`sidebar-jp-text ${styles.text}`}>ログアウト</p>
              </div>
            </li>
          </ul>
        </nav>

        <nav className='mt-2'>
          <ul className='nav nav-pills nav-sidebar' role='menu'>
            <li
              className='nav-item'
              style={{
                width: '100%'
              }}
            >
              <div className={styles.open}>
                <a className='nav-link' data-widget='pushmenu' href='#' role='button'>
                  <i className={`nav-icon fas fa-angle-right ${styles.icon}`} />
                </a>
              </div>
              <div className={styles.close}>
                <a className='nav-link' data-widget='pushmenu' href='#' role='button'>
                  <i className={`nav-icon fas fa-angle-left ${styles.icon}`} />
                  <p className={`sidebar-jp-text ${styles.text}`}>閉じる</p>
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default MainSideBar
