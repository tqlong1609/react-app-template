import React from 'react'

import Link from 'next/link'

import styles from './MyRealBody2Card.module.scss'

interface MyRealBody2CardProps {
  bodyId: string | string[]
}

const MyRealBody2Card: React.FC<MyRealBody2CardProps> = ({ bodyId }) => {
  const isValid = true

  return (
    <div className={`card ${styles.card}`}>
      {isValid ? (
        <div className='card-body d-flex justify-content-between flex-column'>
          <h5 className={`card-title ${styles.title}`}>MyRealBodyIIコンテンツ</h5>
          <Link
            href={`/member/bodies/${bodyId}/mrb2/`}
            className={`btn btn-primary flex-shrink-0 ${styles.button}`}
          >
            詳細
          </Link>
        </div>
      ) : (
        <div className='card-body d-flex justify-content-between flex-column'>
          <div className='d-flex justify-content-between align-items-end'>診断エラー</div>
        </div>
      )}
    </div>
  )
}

export default MyRealBody2Card
