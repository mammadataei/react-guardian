import { createElement, Fragment, PropsWithChildren, ReactNode } from 'react'
import { Policy, PolicyGroup, PolicyResult } from '../types'
import { usePolicies } from './PolicyProvider'

export type GuardFallback =
  | ReactNode
  | ((failedPolicy: PolicyResult) => ReactNode)

interface GuardProps {
  policies: Array<Policy | string>
  fallback?: GuardFallback
}

export function Guard(props: PropsWithChildren<GuardProps>) {
  const { children, fallback, policies: policyList } = props
  const policyGroup = usePolicies()

  if (policyList.length === 0) {
    throwNoPoliciesAreProvidedWarning()
  }

  const policies = resolveNamedPoliciesFromPolicyGroup(policyGroup, policyList)
  const deniedPolicy = policies.find((policy) => !policy().allowed)

  if (deniedPolicy !== undefined) {
    if (fallback) {
      return renderFallback(fallback, deniedPolicy)
    }

    return null
  }

  return createElement(Fragment, null, children)
}

function throwNoPoliciesAreProvidedWarning() {
  console.warn(
    '[React Guardian]: No policies are provided to the Guard component. \n' +
      'At least provide one policy, or descendants will render without protection.',
  )
}

function resolveNamedPoliciesFromPolicyGroup(
  policyGroup: PolicyGroup | undefined,
  policies: Array<Policy | string>,
) {
  return policies.reduce<Array<Policy>>((result, policy) => {
    if (typeof policy === 'string') {
      if (!policyGroup) {
        throwPolicyGroupNotFoundError()
      }

      return [
        ...result,
        policyGroup[policy] ?? throwPolicyNotFoundError(policy),
      ]
    }

    return [...result, policy]
  }, [])
}

function renderFallback(fallback: GuardFallback, deniedPolicy: Policy) {
  return createElement(
    Fragment,
    null,
    typeof fallback === 'function' ? fallback(deniedPolicy()) : fallback,
  )
}

function throwPolicyGroupNotFoundError(): never {
  throw new Error(
    '[React Guardian]: PolicyGroup not found. To use named policies, ' +
      'you should provide a PolicyGroup using `PolicyProvider` component.',
  )
}

function throwPolicyNotFoundError(policy: string): never {
  throw new Error(
    `[React Guardian]: Policy "${policy}" not found in provided PolicyGroup.`,
  )
}
