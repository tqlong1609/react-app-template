import { FC } from 'react'

import { FrameAnalysis } from '@/commons/measurements.types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './DiagnosisCard.module.scss'

interface DiagnosisCardProps {
  frameAnalysis: FrameAnalysis
}

const DiagnosisCard: FC<DiagnosisCardProps> = ({ frameAnalysis }) => {
  const router = useRouter()
  const { bodyId } = router.query

  return (
    <div className={`card ${styles.card}`}>
      <div className='card-body'>
        <h2 className='card-title mb-3'>3D骨格診断</h2>
        <div className='card-text'>
          {frameAnalysis ? (
            <div className='d-flex justify-content-between align-items-end'>
              <div className={styles.imageWrap}>
                <Image
                  className={styles.image}
                  src={`/img/detail/diagnostic/${frameAnalysis.frame}.svg`}
                  alt='Frame Analysis'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
              <Link href={`/member/bodies/${bodyId}/diagnosis`}>
                <a className='btn btn-primary flex-shrink-0'>詳細</a>
              </Link>
            </div>
          ) : (
            <div className='d-flex justify-content-between align-items-end'>診断エラー</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiagnosisCard
