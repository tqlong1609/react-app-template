'use client'

import { AuthProvider } from './AuthProvider'
import { MenuProvider } from './MenuProvider'
import ReactQueryProvider from './ReactQueryProvider'

export default function Providers(props: any) {
  return (
    <Compose components={[ReactQueryProvider, MenuProvider, AuthProvider]}>
      {props.children}
    </Compose>
  )
}

function Compose({ components, children }: any) {
  return components.reduceRight((prev: any, curr: any) => {
    if (Array.isArray(curr)) {
      const [Component, props] = curr
      return <Component {...props}>{prev}</Component>
    }

    const Component = curr
    return <Component>{prev}</Component>
  }, children)
}
