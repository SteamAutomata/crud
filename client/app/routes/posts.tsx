import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/utils";

type WriteForm = {
  content: string;
  userId: number;
  respondingToId: number;
};

function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as any);

  function fetchPosts() {
    fetch(api("/posts"))
      .then((response) => {
        if (!response.ok) {
          setError(response.status);
          setLoading(false);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }

  return { posts, loading, error, fetchPosts };
}

export function WriteANewPost({ respondingToId }: { respondingToId?: number }) {
  const { register, handleSubmit } = useForm<WriteForm>();
  const onSubmit: SubmitHandler<WriteForm> = (data) =>
    axios
      .post(api("/post"), data)
      .catch((e) => alert(JSON.stringify(e.toJSON())));

  const [users, setUsers] = useState([]);

  function fetchUsers() {
    fetch(api("/user"))
      .then((response) => {
        if (!response.ok) {
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      });
  }

  useEffect(fetchUsers, []);

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register("content")} />
      <br />

      <label htmlFor="role">Post as:</label>
      <select {...register("userId")}>
        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <br />

      <input
        type="hidden"
        value={respondingToId}
        {...register("respondingToId")}
      />
      <button type="submit">Create</button>
    </form>
  );
}

function Post({ post, handleCommentClick }: any) {
  const replies: Array<unknown> = post.replies;

  return (
    <div className="m-5 p-4">
      <div>
        {post.author.avatar !== "" ? <img src={post.author.avatar} /> : <></>}
        <span>{post.author.name}</span>
      </div>
      <p>{post.content}</p>
      <p className="float-right">{post.author.signature}</p>
      <button onClick={(e) => handleCommentClick(e, post.id)}>Comment</button>
      {replies.length > 0 ? (
        <div className="m-2">
          {replies.map((r, i) => (
            <Post post={r} handleCommentClick={handleCommentClick} key={i} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function Home() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [respondingToId, setRespondingToId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  function handleCommentClick(e: any, postId: number) {
    e.preventDefault();
    setRespondingToId(postId);
  }

  return (
    <div>
      {respondingToId ? <></> : <WriteANewPost />}

      {posts.map((post: any, k) => (
        <>
          <Post post={post} handleCommentClick={handleCommentClick} key={k} />
          {respondingToId === post.id ? (
            <WriteANewPost respondingToId={post.id} />
          ) : (
            <></>
          )}
        </>
      ))}
    </div>
  );
}
