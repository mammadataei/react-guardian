import { Navigate, Outlet } from 'react-router-dom'
import { Policy, PolicyResult } from '../types'
import { Guard } from './Guard'

interface RouteGuardProps {
  policies: Array<Policy>
}

function fallback({ redirect, name }: PolicyResult) {
  if (!redirect) {
    throw new Error(
      `[React Guardian]: "${name}" policy doesn't contain a redirect property, but it is required for using a policy as "RoutePolicy"`,
    )
  }

  return <Navigate to={redirect} />
}

export function RouteGuard({ policies }: RouteGuardProps) {
  return (
    <Guard policies={policies} fallback={fallback}>
      <Outlet />
    </Guard>
  )
}
