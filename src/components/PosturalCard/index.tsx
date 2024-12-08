import React from 'react'

import { Scores } from '@/commons/measurements.types'
import scoreMapping from '@/configs/data/scoreMapping.json'
import Link from 'next/link'

import styles from './PosturalCard.module.scss'

type Mapping = {
  range: {
    max: number
    min: number
  }
  text: string
}

interface PosturalCardProps {
  posturalScores: Scores
  bodyId: string | string[]
}

const PosturalCard: React.FC<PosturalCardProps> = ({ posturalScores, bodyId }) => {
  return (
    <div className={`card ${styles.card}`}>
      <div className='card-body'>
        <h2 className='card-title mb-3'>姿勢点数</h2>
        <div className='card-text position-relative'>
          {posturalScores?.total ? (
            <div className='d-flex justify-content-between align-items-end'>
              <div className='d-flex justify-content-between align-items-center'>
                <img
                  className={styles.posturalImage}
                  src={`/img/postural/${mapScoreText(posturalScores.total)}.svg`}
                  alt='Postural Score'
                />
                <span className={styles.posturalScore}>{posturalScores.total}</span>
                <span className='mt-2'> 点</span>
              </div>
              <Link
                href={`/member/bodies/${bodyId}/postural`}
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

const mapScoreText = (score: number): string => {
  return scoreMapping.filter((s: Mapping) => {
    return s.range.min <= score && s.range.max >= score
  })[0].text
}

export default PosturalCard
