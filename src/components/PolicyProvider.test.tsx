import { createElement, Fragment } from 'react'
import { render } from '@testing-library/react'
import { PolicyProvider, usePolicies } from './PolicyProvider'
import { Policy } from '../types'
import { expect } from 'vitest'

function createPolicy(name: string, allowed: boolean): Policy {
  return () => ({ name, authorized: allowed })
}

const consumer = vi.fn()

function ConsumerContainer() {
  consumer(usePolicies())
  return createElement(Fragment)
}

it('should have a displayName', () => {
  expect(PolicyProvider.displayName).toBe('PolicyProvider')
})

it('should pass the policies through context', () => {
  const policies = {
    auth: createPolicy('auth', true),
    admin: createPolicy('admin', false),
  }

  render(
    <PolicyProvider policies={policies}>
      <ConsumerContainer />
    </PolicyProvider>,
  )

  expect(consumer).toHaveBeenCalledWith(policies)
})
