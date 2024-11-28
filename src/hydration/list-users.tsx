'use client'

import React from 'react'

import Image from 'next/image'

import { useQuery } from '@tanstack/react-query'

export default function ListUsers() {
  const [count, setCount] = React.useState(0)

  // const { data } = useQuery({
  //   queryKey: ['hydrate-users'],
  //   queryFn: () => getUsers({ token }),
  //   staleTime: 10 * 1000,
  //   enabled: isAuth,
  // })

  return (
    <main style={{ maxWidth: 1200, marginInline: 'auto', padding: 20 }}>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h4 style={{ marginBottom: 16 }}>{count}</h4>
        <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
        <button onClick={() => setCount((prev) => prev - 1)} style={{ marginInline: 16 }}>
          decrement
        </button>
        <button onClick={() => setCount(0)}>reset</button>
      </div>

      {
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 20,
          }}
        >
          {/* {data?.map((user) => (
            <div key={user.id} style={{ border: '1px solid #ccc', textAlign: 'center' }}>
              <Image
                src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
                alt={user.name}
                width={180}
                height={180}
              />
              <h3>{user.name}</h3>
            </div>
          ))} */}
        </div>
      }
    </main>
  )
}
