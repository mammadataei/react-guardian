import type { ReactNode } from 'react'

type WithRequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export interface PolicyResult {
  name?: string
  authorized: boolean
  message?: string
  redirect?: string
}

export type Policy = () => PolicyResult
export type RoutePolicy = () => WithRequiredProperty<PolicyResult, 'redirect'>
export type PolicyGroup = { [key: string]: Policy | RoutePolicy }

export type GuardFallback =
  | ReactNode
  | ((failedPolicy: PolicyResult) => ReactNode)
