import logoBlack from '@/assets/img/header/logo-black.svg'
import Image from 'next/image'

import styles from './styles.module.scss'

export default function GuestHeader() {
  return (
    <div className={styles.header}>
      <Image src={logoBlack} className={styles.logo} alt='MyBodyDashBoard' />
    </div>
  )
}
