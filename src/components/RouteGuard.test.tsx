import { render } from '@testing-library/react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ExpectRenderErrors } from '../../testing'
import { RouteGuard } from './RouteGuard'
import { Policy } from '../types'
import { PolicyProvider } from './PolicyProvider'

function createPolicy(name: string, allowed: boolean): Policy {
  return () => ({ name, allowed, redirect: '/403' })
}

afterEach(() => {
  window.location.hash = ''
})

it('should work as pathless route', () => {
  const adminPolicy = createPolicy('admin', true)

  const { getByText } = render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/settings" />} />

        <Route element={<RouteGuard policies={[adminPolicy]} />}>
          <Route path="/settings" element={<div>Settings</div>} />
        </Route>

        <Route path="/403" element={<div>Access denied</div>} />
      </Routes>
    </HashRouter>,
  )

  expect(getByText('Settings')).toBeInTheDocument()
})

it('should redirect to specified route when a policy denies', () => {
  const adminPolicy = createPolicy('admin', false)

  const { queryByText } = render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/settings" />} />

        <Route element={<RouteGuard policies={[adminPolicy]} />}>
          <Route path="/settings" element={<div>Settings</div>} />
        </Route>

        <Route path="/403" element={<div>Access denied</div>} />
      </Routes>
    </HashRouter>,
  )

  expect(queryByText('Settings')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it("should throw error if policy doesn't have redirect property", () => {
  const policy = () => ({ name: 'admin', allowed: false })

  expect(
    ExpectRenderErrors(() =>
      render(
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/settings" />} />

            <Route element={<RouteGuard policies={[policy]} />}>
              <Route path="/settings" element={<div>Settings</div>} />
            </Route>

            <Route path="/403" element={<div>Access denied</div>} />
          </Routes>
        </HashRouter>,
      ),
    ),
  ).toThrowError(`"admin" policy doesn't contain a redirect property`)
})

it('should work as wrapper', () => {
  const adminPolicy = createPolicy('admin', true)

  const { getByText } = render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/settings" />} />

        <Route
          path="/settings"
          element={
            <RouteGuard policies={[adminPolicy]}>
              <div>Settings</div>
            </RouteGuard>
          }
        />

        <Route path="/403" element={<div>Access denied</div>} />
      </Routes>
    </HashRouter>,
  )

  expect(getByText('Settings')).toBeInTheDocument()
})

it('should redirect on policy denial when rendering as wrapper', () => {
  const adminPolicy = createPolicy('admin', false)

  const { queryByText } = render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/settings" />} />

        <Route
          path="/settings"
          element={
            <RouteGuard policies={[adminPolicy]}>
              <div>Settings</div>
            </RouteGuard>
          }
        />

        <Route path="/403" element={<div>Access denied</div>} />
      </Routes>
    </HashRouter>,
  )

  expect(queryByText('Settings')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})

it('should integrate with PolicyContext', () => {
  const policies = {
    admin: createPolicy('admin', false),
  }

  const { queryByText } = render(
    <HashRouter>
      <PolicyProvider policies={policies}>
        <Routes>
          <Route path="/" element={<Navigate to="/settings" />} />

          <Route element={<RouteGuard policies={['admin']} />}>
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>

          <Route path="/403" element={<div>Access denied</div>} />
        </Routes>
      </PolicyProvider>
    </HashRouter>,
  )

  expect(queryByText('Settings')).not.toBeInTheDocument()
  expect(queryByText('Access denied')).toBeInTheDocument()
})
