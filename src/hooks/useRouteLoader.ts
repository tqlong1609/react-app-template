import React from 'react'

import Router from 'next/router'

const useRouteLoader = () => {
  const [isLoading, setLoading] = React.useState(false)

  React.useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setLoading(true)
    })

    Router.events.on('routeChangeComplete', () => {
      setLoading(false)
    })

    Router.events.on('routeChangeError', () => {
      setLoading(false)
    })
  }, [Router])

  return isLoading
}

export default useRouteLoader
