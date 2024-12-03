'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { CognitoUser } from 'amazon-cognito-identity-js'
import { Auth } from 'aws-amplify'
import camelcaseKeys from 'camelcase-keys'
import { startOfDay, subDays } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import Link from 'next/link'

const TIME_ZONE_TOKYO = 'Asia/Tokyo'

const formatDatetime = (dateTime: string): string => {
  const FORMAT = 'YYYY/MM/DD HH:mm:ss'
  return formatToTimeZone(dateTime, FORMAT, { timeZone: TIME_ZONE_TOKYO })
}

type PartnerAttributes = {
  id: string
  logoUrl: string
  name: string
}

const getUseRuntimeConfig = () => {
  return process.env.NEXT_PUBLIC_API_URL
}

const url = getUseRuntimeConfig()

const usePartnerAttributes = (token: string | null) => {
  return useQuery<PartnerAttributes, Error>({
    queryKey: ['partnerAttributes', token],
    queryFn: async () => {
      const response = await fetch(`${url}/v2/partner/attributes`, {
        headers: {
          Authorization: token || ''
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      return camelcaseKeys(data, { deep: true })
    },
    enabled: !!token
  })
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

type BodyParams = { term: string; token: string | null }

type BodiesInfo = {
  pageInfo: {
    totalPage: number
    currentPage: number
    totalCount: number
  }
  bodies: Body[]
}

const useBodies = ({ term, token }: BodyParams) => {
  return useQuery<BodiesInfo, Error>({
    queryKey: ['bodies', { term, token }],
    queryFn: async () => {
      const toAt = new Date().toISOString()
      const fromAt =
        term === '1'
          ? startOfDay(new Date()).toISOString()
          : subDays(new Date(), Number(term)).toISOString()
      const queryParams = new URLSearchParams({
        page: '1',
        per_page: '999',
        order: 'new',
        from_at: fromAt,
        to_at: toAt
      }).toString()

      const response = await fetch(`${url}/v2/partner/bodies?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: token || ''
        }
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      return camelcaseKeys(data, { deep: true })
    },
    enabled: !!token && !!term
  })
}

const STORAGE_KEY = 'dashboard_state'

const DashboardPage = () => {
  const restoreState = () => {
    const storedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    return {
      dateValue: storedState.dateValue || '1',
      searchText: storedState.searchText || ''
    }
  }

  const [term, setTerm] = useState(restoreState().dateValue)
  const [searchText, setSearchText] = useState(restoreState().searchText)
  const [user, setUser] = useState<CognitoUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const { data: partnerAttributesData, error: partnerAttributesError } = usePartnerAttributes(token)
  const {
    data,
    error: bodyError,
    isPending: bodiesPending
  } = useBodies({
    term,
    token
  })

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await Auth.currentAuthenticatedUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const session = user.getSignInUserSession()
        if (session) {
          const token = session.getAccessToken().getJwtToken()
          setToken(token)
        }
      }
    }
    fetchData()
  }, [user, term])

  useEffect(() => {
    if (partnerAttributesError || bodyError) {
      const statusMessage = partnerAttributesError?.data?.msg || bodyError?.data?.msg
      console.error({ statusCode: 500, statusMessage })
    }
  }, [partnerAttributesError, bodyError])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ dateValue: term, searchText }))
  }, [term, searchText])

  const bodies = useMemo(() => {
    if (!data) return []
    if (data && searchText) {
      return data.bodies.filter((body) => body.nickname.includes(searchText))
    }
    return data.bodies
  }, [data, searchText])

  return (
    <div className='wrapper'>
      {/* <DashboardHeader /> */}
      <div className='content-wrapper' style={{ marginLeft: '4.6rem' }}>
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
                  {bodiesPending ? (
                    <div className='card-body table-responsive text-center'>
                      <div className='spinner-border' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className='card-body table-responsive p-0'>
                      {data && data.bodies.length > 0 ? (
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
      {/* <MainSidebar partnerAttributes={partnerAttributes} /> */}
    </div>
  )
}

export default DashboardPage
