import { createElement, Fragment, PropsWithChildren } from 'react'
import { GuardFallback, Policy, PolicyGroup } from '../types'
import { usePolicies } from './PolicyProvider'
import { error, warn } from '../helpers'

interface GuardProps {
  policies: Array<Policy | string>
  fallback?: GuardFallback
}

export function Guard(props: PropsWithChildren<GuardProps>) {
  const { children, fallback, policies: policyList } = props
  const policyGroup = usePolicies()

  if (policyList.length === 0) {
    warn(
      'No policies are provided to the Guard component. \n' +
        'At least provide one policy, or descendants will render without protection.',
    )
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

function resolveNamedPoliciesFromPolicyGroup(
  policyGroup: PolicyGroup | undefined,
  policies: Array<Policy | string>,
) {
  return policies.reduce<Array<Policy>>((result, policy) => {
    if (typeof policy === 'string') {
      if (!policyGroup) {
        error(
          'PolicyGroup not found. To use named policies, ' +
            'you should provide a PolicyGroup using `PolicyProvider` component.',
        )
      }

      return [
        ...result,
        policyGroup[policy] ??
          error(`Policy "${policy}" not found in provided PolicyGroup.`),
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
