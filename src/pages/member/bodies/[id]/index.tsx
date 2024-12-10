import { useFetchBodyImages } from '@/api-hooks/useMutateBodyImages'
import { useFetchBodiesForUserId } from '@/api-hooks/useQueryBodiesForUserId'
import { useFetchBody } from '@/api-hooks/useQueryBody'
import { HANKYU_HANSHIN_SUB_TITLE, HANKYU_HANSHIN_TITLE } from '@/commons/constants/hankyu-hanshin'
import { NextPageWithLayout } from '@/commons/types'
import DiagnosisCard from '@/components/DiagnosisCard'
import MeasurementsCard from '@/components/MeasurementsCard'
import MyRealBody2Card from '@/components/MyRealBody2Card'
import PosturalCard from '@/components/PosturalCard'
import ProfileCard from '@/components/ProfileCard'
import customOnwardItemsJson from '@/configs/data/customOnwardItems.json'
import { MainLayout } from '@/layouts/mainLayout'
import { useAuthContext } from '@/providers/auth'
import { formatDatetime } from '@/utils/dayjs-format'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './styles.module.scss'

const MemberBodiesPage: NextPageWithLayout = () => {
  const { user } = useAuthContext()

  const router = useRouter()

  const isOnwardUser = user?.isOnwardUser
  const isOnwardPersonalStyleUser = user?.isOnwardPersonalStyleUser
  const isProfileGroupUser = user?.isProfileGroupUser
  const isHankyuHanshinUser = user?.isHankyuHanshinUser
  const isScanDataGroupUser = user?.isScanDataGroupUser
  const isMrb1User = user?.isMrb1User
  const isMrb2User = user?.isMrb2User
  const token = user?.token as string

  const routeBodyId = router.query.id as string

  const { data: body } = useFetchBody(routeBodyId, token)

  const { data: bodiesData } = useFetchBodiesForUserId(token, body?.userId as string)

  const fetchAndProcessBodyImages = useFetchBodyImages(routeBodyId, token)

  const bodyImages = fetchAndProcessBodyImages.data
  const pendingImages = fetchAndProcessBodyImages.isPending
  const imagesError = fetchAndProcessBodyImages.isError

  const bodies = bodiesData?.bodies || []

  const handleBodyChange = (value: string) => {
    router.push(`/member/bodies/${value}`)
  }

  const handleToggleMeasurement = async (isActive: boolean) => {
    if (!isActive || fetchAndProcessBodyImages.isPending) {
      return
    }
    fetchAndProcessBodyImages.mutate()
  }

  const options =
    bodies?.map((body) => ({
      id: body.id,
      date: body.createdAt
    })) || []

  return (
    <div className='wrapper'>
      <div className='content-wrapper'>
        <section className='content'>
          <div className='content-header d-flex align-items-center'>
            <Link href='/member/dashboard'>
              <i className='history-back fas fa-angle-left'></i>
            </Link>
            <h1>ユーザーデータ詳細</h1>
          </div>

          {body && bodies.length > 0 ? (
            <div className='container-fluid'>
              {options && (
                <div className='row mb-3'>
                  <div className='col-6'>
                    <select
                      value={routeBodyId}
                      className='form-control'
                      onChange={(evt) => handleBodyChange(evt.target.value)}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option.id}>
                          {formatDatetime(option.date)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {isProfileGroupUser && (
                <div className='row'>
                  <div className='col-12'>
                    <ProfileCard
                      sex={body?.sex}
                      height={body?.height}
                      nickname={body?.nickname}
                      userId={body?.userId}
                    />
                  </div>
                </div>
              )}

              <div className='row'>
                <div className='col-lg-8'>
                  {isHankyuHanshinUser && (
                    <div className='card'>
                      <div className={`d-flex justify-content-between ${styles.cardBodyWrap}`}>
                        <div>
                          <h2 className='card-title flex-grow-1'>
                            {HANKYU_HANSHIN_SUB_TITLE}
                            <br />
                            {HANKYU_HANSHIN_TITLE}
                          </h2>
                        </div>
                        <div className='flex-shrink-1'>
                          {body?.frameAnalysis ? (
                            body.sex === 'unknown' ? (
                              <div
                                className={`d-flex align-items-center flex-column ${styles.groupButtonGender}`}
                              >
                                <Link
                                  href={`/member/bodies/${router.query.bodyId}/hankyu-hanshin/female`}
                                  className={`btn btn-primary flex-shrink-0 ${styles.buttonFemale}`}
                                >
                                  婦人服向け
                                </Link>
                                <Link
                                  href={`/member/bodies/${router.query.bodyId}/hankyu-hanshin/male`}
                                  className='btn btn-primary flex-shrink-0'
                                >
                                  紳士服向け
                                </Link>
                              </div>
                            ) : (
                              <Link
                                href={`/member/bodies/${router.query.bodyId}/hankyu-hanshin/${body.sex}`}
                                className='btn btn-primary flex-shrink-0'
                              >
                                詳細
                              </Link>
                            )
                          ) : (
                            <p>診断エラー</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {isScanDataGroupUser && (
                    <div className={styles.measurementCardWrap}>
                      <MeasurementsCard
                        measurements={body.measurements}
                        images={bodyImages}
                        pending={pendingImages}
                        sex={body.sex}
                        imagesError={!!imagesError}
                        onToggleMeasurement={handleToggleMeasurement}
                        bodyId={routeBodyId}
                      />
                    </div>
                  )}

                  {isOnwardUser && (
                    <div className='card'>
                      <div className='card-body d-flex justify-content-between'>
                        <h2 className='card-title mb-2 flex-grow-1'>
                          {customOnwardItemsJson.title}
                        </h2>
                        {body?.frameAnalysis ? (
                          <Link
                            href={`/member/bodies/${router.query.bodyId}/custom`}
                            className='btn btn-primary flex-shrink-0'
                          >
                            詳細
                          </Link>
                        ) : (
                          <p>診断エラー</p>
                        )}
                      </div>
                    </div>
                  )}

                  {isOnwardPersonalStyleUser && (
                    <div className='card'>
                      <div className='card-body d-flex justify-content-between'>
                        <h2 className='card-title mb-2 flex-grow-1'>KASHIYAMA 3D骨格診断</h2>
                        {body?.frameAnalysis ? (
                          <Link
                            href={`/member/bodies/${routeBodyId}/onward-personal-style`}
                            className='btn btn-primary flex-shrink-0'
                          >
                            始める
                          </Link>
                        ) : (
                          <p>診断エラー</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {(isMrb1User || isMrb2User) && (
                  <div className='col-lg-4'>
                    {isMrb2User && <MyRealBody2Card bodyId={routeBodyId} />}
                    {isMrb1User && (
                      <>
                        <PosturalCard posturalScores={body?.scores} bodyId={routeBodyId} />
                        <DiagnosisCard frameAnalysis={body?.frameAnalysis} bodyId={routeBodyId} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='card-body table-responsive text-center'>
              <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

MemberBodiesPage.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default MemberBodiesPage
