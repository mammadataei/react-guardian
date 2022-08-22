import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Policy, PolicyObject } from '../types'
import { Guard } from './Guard'
import { error } from '../helpers'

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

function fallback({ redirect, name }: PolicyObject) {
  if (!redirect) {
    error(
      `"${name}" policy doesn't contain a redirect property, ` +
        'but it is required for using a policy as "RoutePolicy"',
    )
  }

  return <Navigate to={redirect} />
}
