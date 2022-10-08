# Using Guard

After [defining policies](/defining-policies), we can use the `Guard` component
to restrict access to its descendants. Imagine there is a "Create new post"
button on the `Posts` page that should only be accessible to `writers` and
`editors`.

```tsx
export default function Posts() {
  const postPolicy = usePostPolicy()

  return (
    <div>
      <h1>Posts</h1>

      <Guard policies={[postPolicy.create]}>
        <CreateNewPostButton />
      </Guard>

      {/* ... */}
    </div>
  )
}
```

## Guard Fallback

By default, the `Guard` component renders as a `Fragment` when one of the
policies denies access. We can customize this behavior by providing a `fallback`
prop. The fallback can be either a `DOM element`, a component, or a callback
function that returns a `ReactNode`.

Here is the Guard's fallback signature:

```tsx
type GuardFallback =
  | ReactNode
  | ((failedPolicy: PolicyResult) => ReactNode);

<Guard policies={[]} fallback={<div>...</div>}/>
<Guard policies={[]} fallback={<FallbackComponent/>}/>
<Guard policies={[]} fallback={() => <div>...</div>}/>
```

The Guard component will render the fallback element if the authorization fails.

```ts
const policy = (): PolicyResult => ({
  authorized: false,
  message: 'Access denied.',
})
```

```tsx
<Guard policies={[policy]} fallback={<div>Fallback will render!</div>}>
  <div>This won't render!</div>
</Guard>
```

We can also access the failed policy as the first argument within the callback
function.

```tsx
<Guard
  policies={[policy]}
  fallback={(failedPolicy) => <div>{failedPolicy.message}</div>}
>
  {/* ... */}
</Guard>
```
