import { render } from '@testing-library/react'

it('should work', () => {
  const { getByRole } = render(<h1>hello world</h1>)
  expect(getByRole('heading')).toHaveTextContent('hello world')
})
