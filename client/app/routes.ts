import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/posts.tsx'),
  route('users', 'routes/users.tsx'),
  route('login', 'routes/login.tsx'),
] satisfies RouteConfig
