import { useMemo, useState } from 'react'

import { useFetchBody } from '@/api-hooks/useQueryBody'
import { BodyDetail } from '@/commons/measurements.types'
import { NextPageWithLayout } from '@/commons/types'
import { MainLayout } from '@/layouts/mainLayout'
import { useAuthContext } from '@/providers/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { EffectFade } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'

import styles from './Diagnosis.module.scss'

const thumbsTexts = {
  male: ['体型・厚みタイプ', 'スタイリングタイプ', 'サイズ選び', '生地'],
  female: ['体型・厚みタイプ', 'スタイリングタイプ', 'ウエスト位置', '生地']
}

const modalTexts = {
  male: [
    '体型・厚みタイプとは？',
    'スタイリングタイプとは？',
    'サイズ選びとは？',
    'トップス・ボトムス生地とは？'
  ],
  female: [
    '体型・厚みタイプとは？',
    'スタイリングタイプとは？',
    'ウエスト位置とは？',
    'トップス・ボトムス生地とは？'
  ]
}

const modalImagePaths = {
  female: [
    ['/img/diagnosis/female/torso/modal.svg', '/img/diagnosis/female/side/modal.svg'],
    ['/img/diagnosis/female/styling1/modal.svg', '/img/diagnosis/female/styling2/modal.svg'],
    ['/img/diagnosis/female/waist/modal.svg'],
    [
      '/img/diagnosis/female/tops-texture/modal.svg',
      '/img/diagnosis/female/bottoms-texture/modal.svg'
    ]
  ],
  male: [
    ['/img/diagnosis/male/torso/modal.svg', '/img/diagnosis/male/side/modal.svg'],
    ['/img/diagnosis/male/styling1/modal.svg', '/img/diagnosis/male/styling2/modal.svg'],
    ['/img/diagnosis/male/size/modal.svg'],
    ['/img/diagnosis/male/tops-texture/modal.svg', '/img/diagnosis/male/bottoms-texture/modal.svg']
  ]
}

const DiagnosisPage: NextPageWithLayout = () => {
  const { user } = useAuthContext()

  const token = user?.token as string

  const router = useRouter()
  const bodyId = router.query.id as string
  const [firstSwiper, setFirstSwiper] = useState<SwiperClass>()
  const [indexSlide, setIndexSlide] = useState<number>(0)

  const { data: bodyDetail, error: bodyError } = useFetchBody(bodyId, token)

  const sex = bodyDetail ? getFixedGenderFromBodyType(bodyDetail.baseBodyType) : null

  const slideImagePaths = useMemo(() => {
    return bodyDetail
      ? {
          female: getImagePaths('female', bodyDetail),
          male: getImagePaths('male', bodyDetail)
        }
      : null
  }, [bodyDetail])

  return (
    <div className='wrapper'>
      <div className='content-wrapper'>
        <section className='content'>
          <div className='content-header d-flex align-items-center'>
            <Link href={`/member/bodies/${bodyId}`}>
              <i className='history-back fas fa-angle-left' />
            </Link>
            <h1>3D骨格診断詳細</h1>
          </div>
          <div className='container-fluid'>
            {slideImagePaths && sex ? (
              <div className='card'>
                <div className={styles.tabMenuWrapper}>
                  <div className={`d-flex ${styles.textWrap}`}>
                    {thumbsTexts[sex].map((text, i) => (
                      <div
                        key={i}
                        className={`${styles.menu} ${firstSwiper?.activeIndex === i ? styles.isActiveMenu : ''}`}
                        onClick={() => firstSwiper?.slideTo(i)}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Swiper
                    effect='fade'
                    modules={[EffectFade]}
                    fadeEffect={{ crossFade: true }}
                    onSwiper={setFirstSwiper}
                    onSlideChange={(value) => {
                      setIndexSlide(value.activeIndex)
                    }}
                  >
                    {slideImagePaths[sex].map((paths, index) => (
                      <SwiperSlide key={index}>
                        <p
                          className={styles.explanation}
                          data-toggle='modal'
                          data-target='#diagnosisModalCenter'
                        >
                          {modalTexts[sex][index]}
                        </p>
                        <div className='d-flex px-3'>
                          {paths.map((path, i) => (
                            <img key={i} src={path} className='w-50' alt='' />
                          ))}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div
                  id='diagnosisModalCenter'
                  className='modal fade'
                  tabIndex={-1}
                  role='dialog'
                  aria-labelledby='exampleModalCenterTitle'
                  aria-hidden='true'
                >
                  <div
                    className={`modal-dialog modal-dialog-centered ${styles.modalInner}`}
                    role='document'
                  >
                    <div className='modal-content'>
                      <div className='modal-header'>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                          aria-label='Close'
                        >
                          <span aria-hidden='true'>&times;</span>
                        </button>
                      </div>
                      <div className='modal-body'>
                        {modalImagePaths[sex][firstSwiper?.activeIndex || 0].map((path, i) => (
                          <img key={i} src={path} className='w-50' alt='' />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='card'>
                <div className='card-body table-responsive text-center'>
                  <div className='spinner-border' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

const getImagePaths = (gender: 'female' | 'male', bodyDetail: BodyDetail) => [
  [
    `/img/diagnosis/${gender}/torso/${bodyDetail.frameAnalysis.frame}.svg`,
    `/img/diagnosis/${gender}/side/${bodyDetail.frameAnalysis.upperDepth}/${bodyDetail.frameAnalysis.underDepth}.svg`
  ],
  [
    `/img/diagnosis/${gender}/styling1/${bodyDetail.frameAnalysis.frame}.svg`,
    `/img/diagnosis/${gender}/styling2/${bodyDetail.frameAnalysis.frame}.svg`
  ],
  [
    `/img/diagnosis/${gender}/${gender === 'female' ? 'waist' : 'size'}/${bodyDetail.frameAnalysis.frame}.svg`
  ],
  [
    `/img/diagnosis/${gender}/tops-texture/${bodyDetail.frameAnalysis.upperDepth}.svg`,
    `/img/diagnosis/${gender}/bottoms-texture/${bodyDetail.frameAnalysis.underDepth}.svg`
  ]
]

const getFixedGenderFromBodyType = (bodyType?: string) => {
  return bodyType?.includes('female') ? 'female' : 'male'
}

DiagnosisPage.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default DiagnosisPage
