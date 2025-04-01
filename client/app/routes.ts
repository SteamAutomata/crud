import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('users', 'routes/users.tsx'),
  route('posts', 'routes/posts.tsx'),
  route('login', 'routes/login.tsx'),
] satisfies RouteConfig
