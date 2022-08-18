import { createElement, Fragment, PropsWithChildren, ReactNode } from 'react'
import { Policy } from '../types'

interface GuardProps {
  policies: Array<Policy>
  fallback?: ReactNode
}

export function Guard(props: PropsWithChildren<GuardProps>) {
  const { children, fallback, policies } = props

  if (policies.length === 0) {
    console.warn(
      '[React Guardian]: No policies are provided to the Guard component. \n' +
        'At least provide one policy, or descendants will render without protection.',
    )
  }

  const allowed = policies.every((policy) => policy().allowed)

  if (!allowed) {
    if (fallback) {
      return createElement(Fragment, null, fallback)
    }

    return null
  }

  return createElement(Fragment, null, children)
}
