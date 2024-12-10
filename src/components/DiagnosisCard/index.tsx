import { FC } from 'react'

import { FrameAnalysis } from '@/commons/measurements.types'
import Image from 'next/image'
import Link from 'next/link'

import styles from './DiagnosisCard.module.scss'

interface DiagnosisCardProps {
  frameAnalysis: FrameAnalysis
  bodyId: string
}

const DiagnosisCard: FC<DiagnosisCardProps> = ({ frameAnalysis, bodyId }) => {
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
                  objectFit='contain'
                  width={142}
                  height={108}
                />
              </div>
              <Link
                href={`/member/bodies/${bodyId}/diagnosis`}
                className='btn btn-primary flex-shrink-0'
              >
                詳細
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
