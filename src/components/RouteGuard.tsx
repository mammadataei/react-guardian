import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Policy, PolicyResult } from '../types'
import { Guard } from './Guard'

interface RouteGuardProps {
  policies: Array<Policy | string>
}

export function RouteGuard(props: PropsWithChildren<RouteGuardProps>) {
  const { children, policies } = props

  return (
    <Guard policies={policies} fallback={fallback}>
      {children ? children : <Outlet />}
    </Guard>
  )
}

function fallback({ redirect, name }: PolicyResult) {
  if (!redirect) {
    throwPolicyShouldContainRedirectError(name)
  }

  return <Navigate to={redirect} />
}

function throwPolicyShouldContainRedirectError(policyName: string): never {
  throw new Error(
    `[React Guardian]: "${policyName}" policy doesn't contain a redirect property, ` +
      'but it is required for using a policy as "RoutePolicy"',
  )
}
