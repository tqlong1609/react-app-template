import React from 'react'

import userImage from '@/assets/img/detail/user.svg'
import Image from 'next/image'

import styles from './ProfileCard.module.scss'

interface ProfileCardProps {
  birthday?: string
  sex: 'male' | 'female' | 'unknown'
  height: number
  nickname: string
  userId: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({ sex, height, nickname, userId }) => {
  const sexJa = sex === 'male' ? '男性' : sex === 'female' ? '女性' : '未選択'

  return (
    <div className='card'>
      <div className='card-body'>
        <div className='d-flex align-items-center'>
          <div className={styles.imgWrap}>
            <Image width={70} height={70} src={userImage} alt='User' />
          </div>
          <div>
            <p className={styles.nickname}>{nickname}</p>
            <div className={styles.info}>
              <p className={styles.text}>**********{userId.slice(-8)}</p>
              <p className={styles.text}>性別: {sexJa}</p>
              <p className={styles.text}>身長: {height} cm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
