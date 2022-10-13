# Protecting Routes

## The `RouteGuard` component

The `RouteGuard` component is just a wrapper for the `Guard` component. It will
make it easy to use the `Guard` component to protect application routes. But to
use the `RouteGuard`, we first need to define a `RoutePolicy`.

## Define a `RoutePolicy`

To protect routes, we must redirect the user to the correct page once
authorization or authentication fails. We can add a `redirect` property to
`PolicyResult` objects to determine the destination.

```ts
import { Policy } from 'react-guardian'

const authPolicy: Policy = () => ({
  authorize: !!user,
  redirect: '/login',
})
```

The redirect property is optional in the `PolicyResult`, but it's necessary for
the `RouteGuard` component's functionality. To ensure you don't forget to define
it, you can use the `RoutePolicy` type to annotate the policy functions.

```ts
import { RoutePolicy } from 'react-guardian'

const authPolicy: RoutePolicy = () => ({
  authorize: !!user,
  redirect: '/login',
})
```

## Using `RouteGuard`

When a policy denies accessing a page, the `RouteGuard` will use the redirect
property defined by the `RoutePolicy` to route the user to the correct page.

With [ React Router ](https://reactrouter.com/), we can use the `RouteGuard`
component either as a
[ pathless layout route ](https://reactrouter.com/en/main/start/tutorial#pathless-routes)
or a wrapper for the route element.

### Use `RouteGuard` As Pathless Layout Route

Using `RouteGuard` as a pathless layout route, it will render an
[`<Outlet/>`](https://reactrouter.com/en/main/components/outlet) as its children
element to protect any sub-route.

```tsx
<Routes>
  <Route element={<RouteGuard policies={[authPolicy]} />}>
    <Route path="profile" element={<UserProfilePage />} />
  </Route>

  <Route path="login" element={<LoginPage />} />
</Routes>
```

```tsx
const routes = [
  {
    element: <RouteGuard policies={[authPolicy]} />,
    children: [
      {
        path: 'profile',
        element: <UserProfilePage />,
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
]
```

### Use `RouteGuard` As Route Element Wrapper

If we wrap the route element in the `RouteGuard` component, it will render its
children instead of `<Outlet/>`. This method is helpful if you use some
automation like file-system routing to generate the route tree.

```tsx
<Routes>
  <Route
    path="profile"
    element={
      <RouteGuard policies={[authPolicy]}>
        <UserProfilePage />
      </RouteGuard>
    }
  />

  <Route path="login" element={<LoginPage />} />
</Routes>
```

```tsx
const routes = [
  {
    path: 'profile',
    element: (
      <RouteGuard policies={[authPolicy]}>
        <UserProfilePage />
      </RouteGuard>
    ),
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
]
```
