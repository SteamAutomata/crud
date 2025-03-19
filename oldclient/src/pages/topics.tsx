import React from "react";
import useRequest from "../useRequest.js";

export default function () {
  const [users, failed, loading] = useRequest<any>("/api/topics");

  if (loading) return undefined;
  if (failed) return <div>Failed to load users</div>;

  return (
    <div>
      <h1>Topics</h1>
    </div>
  );
}
