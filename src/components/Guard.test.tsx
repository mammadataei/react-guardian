import { render } from '@testing-library/react'
import { Policy } from '../types'
import { Guard, GuardFallback } from './Guard'
import { expect } from 'vitest'
import { useState } from 'react'

function createPolicy(name: string, allowed: boolean): Policy {
  return () => ({ name, allowed })
}

it('should render its children if all policies grant access', () => {
  const authPolicy = createPolicy('auth', true)
  const adminPolicy = createPolicy('admin', true)

  const { getByText } = render(
    <Guard policies={[authPolicy, adminPolicy]}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(getByText('Only admins can access this.')).toBeInTheDocument()
})

it("shouldn't render children if any of policies denies", () => {
  const authPolicy = createPolicy('auth', true)
  const adminPolicy = createPolicy('admin', false)

  const { queryByText } = render(
    <Guard policies={[authPolicy, adminPolicy]}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
})

it('should throw warning if no policies provided', () => {
  const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => null)

  const { getByText } = render(
    <Guard policies={[]}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(getByText('Only admins can access this.')).toBeInTheDocument()
  expect(consoleWarn).toHaveBeenCalledWith(
    expect.stringContaining('No policies are provided to the Guard component'),
  )
})

it('should render fallback if provided any of policies denies', () => {
  const adminPolicy = createPolicy('admin', false)
  const fallback = <div>Access denied</div>

  const { queryByText } = render(
    <Guard policies={[adminPolicy]} fallback={fallback}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should accept component as fallback', () => {
  const adminPolicy = createPolicy('admin', false)

  function Fallback() {
    return <div>Access denied</div>
  }

  const { queryByText } = render(
    <Guard policies={[adminPolicy]} fallback={<Fallback />}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should accept a function as callback', () => {
  const adminPolicy = createPolicy('admin', false)
  const fallback = () => <div>Access denied</div>

  const { queryByText } = render(
    <Guard policies={[adminPolicy]} fallback={fallback}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should pass the failed policy to fallback function', () => {
  const adminPolicy = createPolicy('admin', false)

  const fallback: GuardFallback = ({ name }) => (
    <div>Access denied by `{name}` Policy</div>
  )

  const { queryByText } = render(
    <Guard policies={[adminPolicy]} fallback={fallback}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
  expect(queryByText('Access denied by `admin` Policy')).toBeInTheDocument()
})

it('should work with policy hooks', () => {
  function useAdminPolicy(): Policy {
    const [isAdmin] = useState(false)

    return createPolicy('admin', isAdmin)
  }

  function Container() {
    const adminPolicy = useAdminPolicy()

    return (
      <Guard policies={[adminPolicy]} fallback={<div>Access denied</div>}>
        <div>Only admins can access this.</div>
      </Guard>
    )
  }

  const { queryByText } = render(<Container />)

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})
