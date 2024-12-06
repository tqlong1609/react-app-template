'use client'

import React, { useEffect, useMemo, useState } from 'react'

import MainSideBar from '@/components/MainSideBar'
import { useQuery } from '@tanstack/react-query'
import { Auth } from 'aws-amplify'
import camelcaseKeys from 'camelcase-keys'
import { startOfDay, subDays } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'dashboard_state'
const TIME_ZONE_TOKYO = 'Asia/Tokyo'

const formatDatetime = (dateTime: string): string => {
  const FORMAT = 'YYYY/MM/DD HH:mm:ss'
  return formatToTimeZone(dateTime, FORMAT, { timeZone: TIME_ZONE_TOKYO })
}

type Body = {
  id: string
  createdAt: string
  updatedAt: string
  meta: {
    baseBodyType: string
    scannerId: string
    locationName: string
  }
  nickname: string
  userId: string
}

type PartnerAttributes = {
  id: string
  logoUrl: string
  name: string
}

type BodiesInfo = {
  pageInfo: {
    totalPage: number
    currentPage: number
    totalCount: number
  }
  bodies: Body[]
}

const getUseRuntimeConfig = () => {
  return process.env.NEXT_PUBLIC_API_URL
}

const fetchBodies = async (token: string, term: string) => {
  const url = getUseRuntimeConfig()
  const fromAt =
    term === '1'
      ? startOfDay(new Date()).toISOString()
      : subDays(new Date(), Number(term)).toISOString()

  const toAt = new Date().toISOString()
  const queryParams = new URLSearchParams({
    page: '1',
    per_page: '999',
    order: 'new',
    from_at: fromAt,
    to_at: toAt
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

const fetchPartnerAttributes = async (token: string) => {
  const url = getUseRuntimeConfig()
  const response = await fetch(`${url}/v2/partner/attributes`, {
    headers: { Authorization: token }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch partner attributes')
  }
  const data = await response.json()
  return camelcaseKeys(data, { deep: true })
}

const DashboardPage = () => {
  const router = useRouter()
  const [term, setTerm] = useState('1')
  const [searchText, setSearchText] = useState('')
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const restoreState = () => {
      const storedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
      setTerm(storedState.dateValue || '1')
      setSearchText(storedState.searchText || '')
    }

    restoreState()

    // Get authentication token
    Auth.currentAuthenticatedUser()
      .then((user) => setToken(user.signInUserSession.accessToken.jwtToken))
      .catch(() => router.push('/error'))
  }, [router])

  // Query for bodies data
  const { data: bodiesData, isLoading: isBodiesLoading } = useQuery<BodiesInfo, Error>({
    queryKey: ['bodies', { token, term }],
    queryFn: () => fetchBodies(token, term),
    enabled: !!token,
    retry: false
  })

  // Query for partner attributes
  const { data: partnerAttributes, isLoading: isPartnerLoading } = useQuery<
    PartnerAttributes,
    Error
  >({
    queryKey: ['partnerAttributes', token],
    queryFn: () => fetchPartnerAttributes(token),
    enabled: !!token,
    retry: false
  })

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ dateValue: term, searchText }))
  }, [term, searchText])

  const bodies = useMemo(() => {
    if (!bodiesData) return []
    if (searchText) {
      return bodiesData.bodies.filter((body) => body.nickname.includes(searchText))
    }
    return bodiesData.bodies
  }, [bodiesData, searchText])

  console.log('bodies', bodies)

  const isLoading = isBodiesLoading || isPartnerLoading

  return (
    <div className='wrapper'>
      {/* <DashboardHeader /> */}
      <div className='content-wrapper'>
        <section className='content'>
          <div className='content-header'>
            <h1>ダッシュボード</h1>
          </div>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <div className='row justify-content-between'>
                      <div className='col-3'>
                        <select
                          value={term}
                          onChange={(e) => setTerm(e.target.value)}
                          className='form-control'
                        >
                          <option value='1'>今日</option>
                          <option value='7'>過去7日間</option>
                          <option value='30'>過去30日間</option>
                          <option value='90'>過去90日間</option>
                          <option value='180'>過去180日間</option>
                          <option value='365'>過去365日間</option>
                        </select>
                      </div>
                      <div className='col-6'>
                        <div className='input-group'>
                          <div className='input-group-prepend'>
                            <span className='input-group-text'>
                              <i className='fas fa-search' />
                            </span>
                          </div>
                          <input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            type='text'
                            name='table_search'
                            className='form-control float-right'
                            placeholder='ニックネーム検索'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {isLoading ? (
                    <div className='card-body table-responsive text-center'>
                      <div className='spinner-border' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className='card-body table-responsive p-0'>
                      {bodies.length > 0 ? (
                        <table className='table text-nowrap table-striped'>
                          <thead>
                            <tr>
                              <th>ニックネーム</th>
                              <th>ユーザー ID</th>
                              <th>スキャン日時</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {bodies.map((body, i) => (
                              <tr key={i}>
                                <td>{body.nickname}</td>
                                <td>**********{body.userId.slice(-8)}</td>
                                <td>{formatDatetime(body.createdAt)}</td>
                                <td className='text-right'>
                                  <Link
                                    href={`/member/bodies/${body.id}/`}
                                    className='btn btn-primary'
                                  >
                                    詳細
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className='alert' role='alert'>
                          データが0件です
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <MainSideBar partnerAttributes={partnerAttributes} />
    </div>
  )
}

export default DashboardPage
