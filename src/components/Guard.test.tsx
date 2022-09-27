import { render } from '@testing-library/react'
import { Policy, PolicyResult } from '../types'
import { Guard } from './Guard'

const authenticated: Policy = () => ({
  authorized: true,
})

const post = {
  view: (): PolicyResult => ({
    authorized: true,
  }),

  create: (): PolicyResult => ({
    authorized: false,
    message: "You don't have permission to create a new Post.",
  }),
}

it('should render its children if all policies grant access', () => {
  const { getByText } = render(
    <Guard policies={[authenticated, post.view]}>
      <div>You can view this Post.</div>
    </Guard>,
  )

  expect(getByText('You can view this Post.')).toBeInTheDocument()
})

it("shouldn't render children if any of policies denies", () => {
  const { queryByText } = render(
    <Guard policies={[authenticated, post.create]}>
      <div>You can create a new Post.</div>
    </Guard>,
  )

  expect(queryByText('You can create a new Post.')).not.toBeInTheDocument()
})

it('should throw warning if no policies provided', () => {
  const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => null)

  const { getByText } = render(
    <Guard policies={[]}>
      <div>Everybody can see this.</div>
    </Guard>,
  )

  expect(getByText('Everybody can see this.')).toBeInTheDocument()
  expect(consoleWarn).toHaveBeenCalledWith(
    expect.stringContaining('No policies are provided to the Guard component'),
  )
})

it('should render fallback if provided and any of policies denies', () => {
  const fallback = <div>Access denied</div>

  const { queryByText } = render(
    <Guard policies={[authenticated, post.create]} fallback={fallback}>
      <div>You can create a new Post.</div>
    </Guard>,
  )

  expect(queryByText('You can create a new Post.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should accept component as fallback', () => {
  function Fallback() {
    return <div>Access denied</div>
  }

  const { queryByText } = render(
    <Guard policies={[authenticated, post.create]} fallback={<Fallback />}>
      <div>You can create a new Post.</div>
    </Guard>,
  )

  expect(queryByText('You can create a new Post.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should accept a function as callback', () => {
  const { queryByText } = render(
    <Guard
      policies={[authenticated, post.create]}
      fallback={() => <div>Access denied</div>}
    >
      <div>You can create a new Post.</div>
    </Guard>,
  )

  expect(queryByText('You can create a new Post.')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should pass the result of failed policy to fallback function', () => {
  const { queryByText } = render(
    <Guard
      policies={[authenticated, post.create]}
      fallback={({ message }) => <div>{message}</div>}
    >
      <div>You can create a new Post.</div>
    </Guard>,
  )

  expect(queryByText('You can create a new Post.')).not.toBeInTheDocument()
  expect(
    queryByText("You don't have permission to create a new Post."),
  ).toBeInTheDocument()
})
