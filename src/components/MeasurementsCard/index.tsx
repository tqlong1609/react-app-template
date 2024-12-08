import React, { useState } from 'react'

import { Measurements, Sex } from '@/commons/measurements.types'
import measurementsExceptValueTypeKeys from '@/configs/data/measurementsExceptValueKeys.json'
import measurementsJPNameMapping from '@/configs/data/measurementsJPNameMapping.json'
import { getMeasurementValue } from '@/utils/measurements'
import Link from 'next/link'

import styles from './MeasurementsCard.module.scss'

type bodyImages = {
  front: string | undefined
  side: string | undefined
  bodyLeanLR: string | undefined
  bodyLeanFB: string | undefined
  iliacCrestHeight: string | undefined
  shoulderHeight: string | undefined
}

interface Props {
  measurements: Measurements
  images: bodyImages
  sex: Sex
  pending: boolean
  imagesError: boolean
  onToggleMeasurement: (isActive: boolean) => void
  bodyId: string
}

const MeasurementsCard: React.FC<Props> = ({
  measurements,
  images,
  sex,
  pending,
  imagesError,
  onToggleMeasurement,
  bodyId
}) => {
  const [isMeasurementActive, setIsMeasurementActive] = useState(false)

  const toggleMeasurement = (isActive: boolean) => {
    setIsMeasurementActive(isActive)
    onToggleMeasurement(isActive)
  }

  const measurementsExceptValue = measurementsExceptValueTypeKeys[sex].map((key: string) => ({
    name: measurementsJPNameMapping[key as keyof Measurements],
    value: measurements[key as keyof Measurements]
  }))

  return (
    <div className={`card ${styles.card}`}>
      <div className='card-body'>
        <h2 className='card-title mb-2'>スキャンデータ</h2>
        <div className='card-text'>
          <div className='row'>
            <div
              className={`col-6 d-flex flex-column align-items-center justify-content-center ${styles.imageWrap}`}
            >
              {isMeasurementActive ? (
                <>
                  {!pending && images?.front && images?.side && !imagesError ? (
                    <div className='d-flex'>
                      <div>
                        <img
                          src={`data:image/png;base64,${images.front}`}
                          className={`mw-100 ${styles.image}`}
                          alt='Front view'
                        />
                      </div>
                      <div>
                        <img
                          src={`data:image/png;base64,${images.side}`}
                          className={`mw-100 ${styles.image}`}
                          alt='Side view'
                        />
                      </div>
                    </div>
                  ) : imagesError ? (
                    <div className='mt-5 text-center'>診断エラー</div>
                  ) : (
                    <div className='mt-5 text-center'>
                      <div className='spinner-border' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <div className={styles.bodyText}>ボディ非表示中</div>
                </div>
              )}
            </div>
            <div className='col-6'>
              <p className='mb-1'>▼ 採寸値(抜粋)</p>
              <ul>
                {measurementsExceptValue.map((value, i) => (
                  <li key={i} className='d-flex justify-content-between mb-1'>
                    <span>{value.name}</span>
                    <span>{value.value ? getMeasurementValue(value.value) : '-- '} cm</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`row ${styles.footer}`}>
            <div className='col-6'>
              <div className='text-center mb-2'>
                <span
                  className={!isMeasurementActive ? 'text-primary' : ''}
                  onClick={() => toggleMeasurement(true)}
                >
                  表示
                </span>
                <span> / </span>
                <span
                  className={isMeasurementActive ? 'text-primary' : ''}
                  onClick={() => toggleMeasurement(false)}
                >
                  非表示
                </span>
              </div>
            </div>
            <div className='col-6'>
              <div className='text-right mb-2'>
                {bodyId && (
                  <Link href={`/member/bodies/${bodyId}/measurements`} className='btn btn-primary'>
                    詳細
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeasurementsCard
