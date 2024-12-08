import { HANKYU_HANSHIN_SUB_TITLE, HANKYU_HANSHIN_TITLE } from '@/commons/constants/hankyu-hanshin'
import { Body, BodyDetail } from '@/commons/measurements.types'
import { NextPageWithLayout } from '@/commons/types'
import DiagnosisCard from '@/components/DiagnosisCard'
import MeasurementsCard from '@/components/MeasurementsCard'
import MyRealBody2Card from '@/components/MyRealBody2Card'
import PosturalCard from '@/components/PosturalCard'
import ProfileCard from '@/components/ProfileCard'
import customOnwardItemsJson from '@/configs/data/customOnwardItems.json'
import { getUseRuntimeConfig } from '@/configs/env'
import { MainLayout } from '@/layouts/mainLayout'
import { useAuthContext } from '@/providers/auth'
import { formatDatetime } from '@/utils/dayjs-format'
import { useMutation, useQuery } from '@tanstack/react-query'
import camelcaseKeys from 'camelcase-keys'
import JSZip from 'jszip'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './styles.module.scss'

type BodiesInfo = {
  pageInfo: {
    totalPage: number
    currentPage: number
    totalCount: number
  }
  bodies: Body[]
}

const useFetchBody = (id: string | string[], token: string) => {
  const storageKey = `body_${id}`
  const url = `${getUseRuntimeConfig()}/v3/partner/bodies/${id}`
  const params = {
    headers: {
      Authorization: token
    }
  }

  return useQuery<BodyDetail, Error>({
    queryKey: [storageKey, url],
    queryFn: async () => {
      const response = await fetch(url, params)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const fetchedData = await response.json()
      const transformedData = camelcaseKeys(fetchedData, { deep: true })
      return transformedData as BodyDetail
    },
    retry: false,
    enabled: !!token && !!id
  })
}

const fetchBodiesForUserId = async (token: string, userId: string) => {
  const url = getUseRuntimeConfig()
  const queryParams = new URLSearchParams({
    page: '1',
    per_page: '999',
    order: 'new',
    user_id: userId
  }).toString()
  const response = await fetch(`${url}/v2/partner/bodies?${queryParams}`, {
    headers: { Authorization: token },
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch bodies')
  }
  const data = await response.json()
  return camelcaseKeys(data, { deep: true })
}

const fetchBodyImages = async (id: string | string[], token: string) => {
  const width = 600
  const url = getUseRuntimeConfig()

  const queryParams = new URLSearchParams({
    width: width.toString(),
    height: (width * 2).toString()
  }).toString()
  const response = await fetch(`${url}/v2/partner/images/body/${id}?${queryParams}`, {
    headers: {
      Authorization: token,
      Accept: 'application/zip'
    },
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch bodies')
  }
  const data = await response.json()
  return data
}

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
  const token = user?.token

  const routeBodyId = router.query.id as string

  const { data: body } = useFetchBody(routeBodyId, token as string)

  const { data: bodiesData } = useQuery<BodiesInfo, Error>({
    queryKey: ['bodies', { token, userId: body?.userId }],
    queryFn: () => fetchBodiesForUserId(token as string, body?.userId as string),
    enabled: !!token && !!body?.userId,
    retry: false
  })

  const fetchAndProcessBodyImages = useMutation({
    mutationFn: async () => await fetchBodyImages(routeBodyId, token as string),
    onSuccess: async (images) => {
      const zip = new JSZip()
      const file = await zip.loadAsync(images)
      return {
        front: await file.file('front.png')?.async('base64'),
        side: await file.file('side.png')?.async('base64'),
        bodyLeanLR: await file.file('body_lean_L_R.svg')?.async('base64'),
        bodyLeanFB: await file.file('body_lean_F_B.svg')?.async('base64'),
        iliacCrestHeight: await file.file('iliac_crest_height.svg')?.async('base64'),
        shoulderHeight: await file.file('shoulder_height.svg')?.async('base64')
      }
    },
    onError: () => {}
  })

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
                        <DiagnosisCard frameAnalysis={body?.frameAnalysis} />
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
