# Defining Policies

Policies are functions that organize authentication and authorization logic and
control how users can access a page or component. For example, if your
application is a blog, you may have a `createPostPolicy` to authorize if the
user can create a post.

```ts
import { Policy } from 'react-guardian'

const createPostPolicy: Policy = () => ({
  authorize: user.role === 'writer',
})
```

The `createPostPolicy` only allows users with the `writer` role to create a new
post.

## Organizing Policies

Since the underlying data and logic for authorizing actions on a specific
resource are usually the same, we can group related policies in a `PolicyGroup`
object. For example, imagine that our blogging application has three types of
authenticated users: regular users with no role, `writer`, and `editor`, with
the following permissions:

- Guests (unauthenticated users) can not view posts.
- Regular users can only view posts.
- Writers can create and update their posts but are not allowed to publish them.
- Editors can create, update, and publish all posts.

We can define a `PostPolicy` like this:

```ts
const PostPolicy = {
  view(): PolicyResult {
    return {
      authorized: !!user,
    }
  },

  create(): PolicyResult {
    return {
      authorized: user.role === 'writer' || user.role === 'editor',
    }
  },

  update(): PolicyResult {
    return {
      authorized:
        (user.role === 'writer' && post.author.id === user.id) ||
        user.role === 'editor',
    }
  },

  publish(): PolicyResult {
    return {
      authorized: user.role === 'editor',
    }
  },
}
```

## Policy Hooks

Hooks are the primary tool in React for organizing application logic and are
only allowed to use within components or other hooks. We highly recommend
organizing policies and policy groups as custom react hooks to define stateful
policies. Using this approach, we can empower policies with states and
hook-based third-party modules, like `react-query` or `useFetch`.

```ts
function usePostPolicy(postId: string) {
  const user = useCurrentlyAuthenticatedUser()
  const post = useGetPostById(postId)

  return {
    view(): PolicyResult {
      return {
        authorized: !!user,
      }
    },

    create(): PolicyResult {
      return {
        authorized: user.role === 'writer' || user.role === 'editor',
      }
    },

    update(): PolicyResult {
      return {
        authorized:
          (user.role === 'writer' && post.author.id === user.id) ||
          user.role === 'editor',
      }
    },

    publish(): PolicyResult {
      return {
        authorized: user.role === 'editor',
      }
    },
  }
}
```
