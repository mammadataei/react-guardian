import { render } from '@testing-library/react'
import { Policy } from '../types'
import { Guard } from './Guard'
import { expect } from 'vitest'
import { useState } from 'react'

it('should render its children if all policies grant access', () => {
  const authPolicy: Policy = () => ({ allowed: true })
  const adminPolicy: Policy = () => ({ allowed: true })

  const { getByText } = render(
    <Guard policies={[authPolicy, adminPolicy]}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(getByText('Only admins can access this.')).toBeInTheDocument()
})

it("shouldn't render children if any of policies denies", () => {
  const authPolicy: Policy = () => ({ allowed: true })
  const adminPolicy: Policy = () => ({ allowed: false })

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
  const adminPolicy: Policy = () => ({ allowed: false })
  const fallback = <div>Access denied</div>

  const { queryByText } = render(
    <Guard policies={[adminPolicy]} fallback={fallback}>
      <div>Only admins can access this.</div>
    </Guard>,
  )

  expect(queryByText('Only admins can access this.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should work with policy hooks', () => {
  function useAdminPolicy(): Policy {
    const [isAdmin] = useState(false)

    return function adminPolicy() {
      return { allowed: isAdmin }
    }
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
