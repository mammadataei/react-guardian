import { createElement, Fragment, PropsWithChildren } from 'react'
import { GuardFallback, Policy } from '../types'

interface GuardProps {
  policies: Array<Policy>
  fallback?: GuardFallback
}

export function Guard(props: PropsWithChildren<GuardProps>) {
  const { children, fallback, policies } = props

  if (policies.length === 0) {
    console.warn(
      '[React Guardian]: No policies are provided to the Guard component. \n' +
        'At least provide one policy, or descendants will render without protection.',
    )
  }

  const deniedPolicy = policies.find((policy) => !policy().authorized)

  if (deniedPolicy) {
    if (fallback) {
      return renderFallback(fallback, deniedPolicy)
    }

    return null
  }

  return createElement(Fragment, null, children)
}

function renderFallback(fallback: GuardFallback, deniedPolicy: Policy) {
  return createElement(
    Fragment,
    null,
    typeof fallback === 'function' ? fallback(deniedPolicy()) : fallback,
  )
}
