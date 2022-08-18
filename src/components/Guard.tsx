import { createElement, Fragment, PropsWithChildren, ReactNode } from 'react'
import { Policy, PolicyResult } from '../types'

export type GuardFallback =
  | ReactNode
  | ((failedPolicy: PolicyResult) => ReactNode)

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

  const deniedPolicy = policies.find((policy) => !policy().allowed)

  if (deniedPolicy !== undefined) {
    if (fallback) {
      return createElement(
        Fragment,
        null,
        typeof fallback === 'function' ? fallback(deniedPolicy()) : fallback,
      )
    }

    return null
  }

  return createElement(Fragment, null, children)
}
