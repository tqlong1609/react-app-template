import React, { useMemo } from 'react'

import { Measurements, Sex } from '@/commons/measurements.types'
import measurementsExceptValueTypeKeys from '@/configs/data/measurementsExceptValueKeys.json'
import measurementsJPNameMapping from '@/configs/data/measurementsJPNameMapping.json'
import { getMeasurementValue } from '@/utils/measurements'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './styles.module.scss'

interface Measurement {
  name: string
  value: number | null
}

type BodyImages = {
  front: string | undefined
  side: string | undefined
  bodyLeanLR: string | undefined
  bodyLeanFB: string | undefined
  iliacCrestHeight: string | undefined
  shoulderHeight: string | undefined
}

interface Props {
  measurements: Measurements
  images: BodyImages
  sex: Sex
  pending: boolean
  imagesError: boolean
  bodyId: string
}

const MeasurementCard: React.FC<Props> = ({ measurements, sex, bodyId }) => {
  const router = useRouter()

  const measurementsExceptValue: Measurement[] = useMemo(() => {
    return measurementsExceptValueTypeKeys[sex].map((key: string) => ({
      name: measurementsJPNameMapping[key as keyof typeof measurementsJPNameMapping],
      value: measurements[key as keyof typeof measurements] || null
    }))
  }, [measurements, sex])

  const chunkedMeasurementsExceptValue = useMemo(() => {
    if (!measurementsExceptValue.length) return []
    const chunkSize = 3
    return Array.from({ length: Math.ceil(measurementsExceptValue.length / chunkSize) }, (_, i) =>
      measurementsExceptValue.slice(i * chunkSize, i * chunkSize + chunkSize)
    )
  }, [measurementsExceptValue])

  return (
    <div className={`card ${styles.card}`}>
      <div className='card-body'>
        <h2 className='card-title mb-3'>スキャンデータ</h2>
        <div className='card-text'>
          <p className='mb-3'>▼ 採寸値(抜粋)</p>
          <div className='row justify-content-between'>
            {chunkedMeasurementsExceptValue.map((group, groupIndex) => (
              <div key={groupIndex} className='col-sm-5'>
                <div className={styles.measurementsSpacing}>
                  {group.map((value, i) => (
                    <div key={i} className='d-flex justify-content-between mb-2'>
                      <span className={styles.measurementsName}>{value.name}</span>
                      <span className={styles.measurementsVal}>
                        {value.value !== null ? getMeasurementValue(value.value) : '--'} cm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={`row ${styles.footer}`}>
            <div className='col-12'>
              <div className='text-right'>
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

export default MeasurementCard
