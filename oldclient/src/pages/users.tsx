import React from "react";
import useRequest from "../useRequest.js";

export default function () {
  const [users, failed, loading] = useRequest<any>("/api/users");

  if (loading) return undefined;
  if (failed) return <div>Failed to load users</div>;

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>
                <img src={user.avatar} alt="icon" />
              </td>
              <th>
                {user.name}
                {user.role === "ADMIN" ? " 🌟" : ""}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
