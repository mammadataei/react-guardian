import type { ReactNode } from 'react'

export interface PolicyObject {
  name: string
  allowed: boolean
  redirect?: string
}

export type Policy = () => PolicyObject
export type RoutePolicy = () => Required<PolicyObject>
export type PolicyGroup = { [key: string]: Policy }

export type GuardFallback =
  | ReactNode
  | ((failedPolicy: PolicyObject) => ReactNode)
