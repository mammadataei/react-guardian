# Getting Started

## Install React Guardian

First, we should install the `react-guardian` package:

```sh
npm install react-guardian
```

```sh
yarn add react-guardian
```

```sh
pnpm add react-guardian
```

## Define A Policy

Policies are function that determines how users can access pages or components.
To create a new policy, define a function which returns a `PolicyResult` object.

```ts
const adminsOnly: PolicyResult = () => ({
  // Does the user has access to the page/component?
  authorized: false,
})
```

You can learn more about policies in [Defining Policies](/defining-policies).

## Protect Components

Now we can wrap our components in a `Guard` and use the `adminsOnly` policy to
protect them.

```tsx
import { Gaurd } from 'react-guardian'

function VeryImportantComponent() {
  return <div>Only admins are allowed to see this.</div>
}

function App() {
  return (
    <Gaurd policies={[adminsOnly]}>
      <VeryImportantComponent />
    </Gaurd>
  )
}
```
