import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { api } from '~/utils'

type WriteForm = {
  content: string
  userId: number
  respondingToId: number
}

function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null as any)

  function fetchPosts() {
    fetch(api('/post'))
      .then(response => {
        if (!response.ok) {
          setError(response.status)
          setLoading(false)
        }
        return response.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
  }

  return { posts, loading, error, fetchPosts }
}

export function WriteANewPost({
  respondingToId,
  updateFeed,
}: {
  respondingToId?: number
  updateFeed: any
}) {
  const { register, handleSubmit } = useForm<WriteForm>()
  const onSubmit: SubmitHandler<WriteForm> = data =>
    axios
      .post(api('/post'), data)
      .catch(e => alert(e))
      .then(() => updateFeed())

  const [users, setUsers] = useState([])

  function fetchUsers() {
    fetch(api('/user'))
      .then(response => {
        if (!response.ok) {
        }
        return response.json()
      })
      .then(data => {
        setUsers(data)
      })
  }

  useEffect(fetchUsers, [])

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register('content')} />
      <br />

      <label htmlFor="role">Post as:</label>
      <select {...register('userId')}>
        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <br />

      <input type="hidden" value={respondingToId} {...register('respondingToId')} />
      <button type="submit">Create</button>
    </form>
  )
}

function Post({
  postId,
  handleCommentClick,
  respondingToId,
  updateFeed,
  handleRemoveClick,
}: {
  postId: number
  handleCommentClick: Function
  respondingToId?: number
  updateFeed: Function
  handleRemoveClick: Function
}) {
  const [post, setPost] = useState(null as any)

  function fetchThis() {
    axios
      .get(api('/post/' + postId))
      .then(v => setPost(v.data))
      .catch(e => alert(JSON.stringify(e.toJSON())))
  }

  useEffect(fetchThis, [postId])

  if (!post) {
    return <div className="m-5 p-4">Loading...</div>
  }

  const replies: Array<any> = post.replies!
  const author = post.author!

  return (
    <div className="m-5 p-4">
      <div>
        {author && author.avatar !== '' ? <img src={author.avatar} /> : <></>}
        <span>{author.name}</span>
      </div>
      <p>{post.content}</p>
      <p className="float-right">{author.signature}</p>
      <button onClick={e => handleCommentClick(e, postId)}>Comment</button>
      <button onClick={e => handleRemoveClick(e, postId)}>Remove</button>

      {respondingToId === postId ? (
        <WriteANewPost respondingToId={respondingToId} updateFeed={updateFeed} />
      ) : (
        <></>
      )}

      {replies.length > 0 ? (
        <div className="m-2">
          {replies.map((r, i) => (
            <Post
              updateFeed={updateFeed}
              postId={r.id}
              handleCommentClick={handleCommentClick}
              handleRemoveClick={handleRemoveClick}
              key={r.id}
              respondingToId={respondingToId} // I love prop drilling
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default function Home() {
  const { posts, loading, error, fetchPosts } = usePosts()
  const [respondingToId, setRespondingToId] = useState<number | undefined>(undefined)

  const updateFeed = () => {
    fetchPosts()
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  function handleCommentClick(e: any, postId: number) {
    e.preventDefault()
    setRespondingToId(postId === respondingToId ? undefined : postId)
  }

  function handleRemoveClick(e: any, postId: number) {
    e.preventDefault()
    axios.delete(api('/post/' + postId)).then(_ => fetchPosts())
  }

  return (
    <div>
      {respondingToId ? <></> : <WriteANewPost updateFeed={updateFeed} />}

      {posts.map((post: any, k) => (
        <Post
          updateFeed={updateFeed}
          postId={post.id}
          handleCommentClick={handleCommentClick}
          handleRemoveClick={handleRemoveClick}
          key={post.id}
          respondingToId={respondingToId}
        />
      ))}
    </div>
  )
}
