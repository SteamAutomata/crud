import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/users";
import { Form } from "react-router";
import { api } from "~/utils";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";

type CreateForm = { name: string; email: string; role: "ADMIN" | "USER" };
type UpdateForm = {
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  signature: string;
};

function UserList({
  handleEditClick,
}: {
  handleEditClick: (userId: number) => void;
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as any);

  function fetchUsers() {
    fetch(api("/user"))
      .then((response) => {
        if (!response.ok) {
          setError(response.status);
          setLoading(false);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }

  function handleClick(e: any, name: string) {
    e.preventDefault();
    fetch(api("/user/" + name), { method: "DELETE" })
      .then((r) => r.text())
      .then((r) => {
        fetchUsers();
      });
  }

  useEffect(fetchUsers, []);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <ul className="p-8">
      {users.map((user: any) => (
        <li key={user.id}>
          {/* <img src={user.avatar} alt={user.name} /> */}
          <p>
            {user.name}
            <span> {user.role}</span>
            <span>
              <button onClick={(e) => handleClick(e, user.id)}>x</button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditClick(user.id);
                }}
              >
                edit
              </button>
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function UserCreateForm() {
  const { register, handleSubmit } = useForm<CreateForm>();
  const onSubmit: SubmitHandler<CreateForm> = (data) =>
    axios
      .post(api("/user"), data)
      .catch((e) => alert(e))
      .then(() => window.location.reload());

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} className="p-8">
      <label htmlFor="name">Name:</label>
      <input type="text" {...register("name")} />
      <br />

      <label htmlFor="email">Email:</label>
      <input type="text" {...register("email")} />
      <br />

      <label htmlFor="role">Role:</label>
      <select {...register("role")}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <br />

      <button type="submit">Create</button>
    </form>
  );
}

export function UserUpdateForm({ userId }: { userId: number }) {
  const { register, handleSubmit, setValue, formState } = useForm<UpdateForm>();
  const onSubmit: SubmitHandler<UpdateForm> = (data) =>
    axios
      .put(api("/user/" + userId), data)
      .catch((e) => alert(e))
      .then(() => window.location.reload());

  useEffect(() => {
    if (!userId) return;

    axios
      .get(api("/user/" + userId))
      .then((r) => {
        if (r.status !== 200) throw new Error(r.statusText);
        return r.data;
      })
      .then((d) => {
        console.log(d);
        Object.keys(d).forEach((k) => {
          if (["name", "email", "role", "signature"].includes(k)) {
            setValue(k as never, d[k] as never);
          }
        });
      })
      .catch((e) => alert(e));
  }, [userId]);

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} className="p-8">
      <label htmlFor="name">Name:</label>
      <input type="text" {...register("name")} />
      <br />

      <label htmlFor="email">Email:</label>
      <input type="text" {...register("email")} />
      <br />

      <label htmlFor="signature">Signature:</label>
      <input type="text" {...register("signature")} />
      <br />

      <label htmlFor="role">Role:</label>
      <select {...register("role")}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <br />

      <button type="submit">Update</button>
    </form>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Users" },
    { name: "description", content: "User list of my app" },
  ];
}

export default function Home() {
  const [userBeingEdited, setUserBeingEdited] = useState(null as any);

  function handleEditClicked(userId: number) {
    setUserBeingEdited(userId);
  }

  return (
    <div>
      <div className="p-8">
        <h1>User list:</h1>

        <UserList handleEditClick={handleEditClicked} />
      </div>

      <div id="create-user" className="p-8">
        <h1>Create User:</h1>
        <UserCreateForm />
      </div>

      <div id="edit-user" className="p-8">
        <h1>Edit User:</h1>
        <UserUpdateForm userId={userBeingEdited} />
      </div>
    </div>
  );
}
