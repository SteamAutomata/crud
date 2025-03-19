import React, { ReactNode } from "react";
import { Link, NavLink } from "react-router";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/topics">Topics</NavLink>
        <NavLink to="/search">Search</NavLink>
      </nav>

      <div>{children}</div>

      <footer>Super cool forum</footer>
    </div>
  );
}
