'use client'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'
import CookieManager from './cookiemanager'
import { useContext, useState } from 'react'
import { SessionContext } from './context'
import { jwtDecode } from 'jwt-decode'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionContext | undefined>(undefined)

  if (typeof document !== 'undefined' && !session) {
    const sessionCookie = CookieManager.getCookie('authorization')
    if (sessionCookie) {
      const sessionData = jwtDecode(sessionCookie)
      setSession(sessionData as any)
    }
  }

  function logout() {
    CookieManager.deleteCookie('authorization')
    window.location.assign('/')
  }

  console.log(session)

  return (
    <SessionContext.Provider value={session}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <nav className="flex space-x-4 p-4 bg-gray-700">
            <NavLink to="/">Posts</NavLink>
            <NavLink to="/users">Users</NavLink>

            <div className="ml-auto mr-auto" />

            {!session ? <NavLink to="/login">Login</NavLink> : <></>}

            {session ? <span>Logged in as {session.name}</span> : <></>}
            {session ? (
              <button className="unbutton" onClick={logout}>
                Log out
              </button>
            ) : (
              <></>
            )}
          </nav>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </SessionContext.Provider>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
