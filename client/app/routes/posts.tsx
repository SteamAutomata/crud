import { useContext, useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { api } from '~/utils'

interface User {
  id: number
  name?: string
  avatar?: string
}

interface Post {
  id: number
  content: string
  createdAt: string
  author: User
  replies: Post[]
}

type WritePostForm = {
  content: string
  userId: number
  respondingToId?: number
}

const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get(api('/post'))
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des posts', error)
    return []
  }
}

const fetchPost = async (postid: number): Promise<Post | undefined> => {
  try {
    const response = await axios.get(api('/post/' + postid))
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des réponses à un post', error)
    return undefined
  }
}

const submitPost = async (data: WritePostForm) => {
  try {
    await axios.post(api('/post'), data)
  } catch (error) {
    console.error("Erreur lors de l'ajout du post", error)
  }
}

const removePost = async (postId: number) => {
  try {
    await axios.delete(api('/post/' + postId)).then(_ => fetchPosts())
  } catch (error) {
    console.error("Erreur lors de l'ajout du post", error)
  }
}

function PostForm({
  respondingToId,
  whenPosted,
}: {
  respondingToId?: number
  whenPosted: Function
}) {
  const { register, handleSubmit, reset } = useForm<WritePostForm>()
  const [users, setUsers] = useState([] as User[])

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
  useEffect(() => {
    fetchUsers()
  }, [])

  const onSubmit: SubmitHandler<WritePostForm> = async data => {
    await submitPost({ ...data, respondingToId })
    whenPosted()
    // reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex items-center">
      <input
        {...register('content', { required: true })}
        placeholder={respondingToId ? 'Répondre...' : 'Quoi de neuf ?'}
        className="w-full p-2 border rounded"
      />
      <select {...register('userId')} defaultValue={users.length > 0 ? users[0].id : 0}>
        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        {respondingToId ? 'Répondre' : 'Poster'}
      </button>
    </form>
  )
}

function PostComponent({
  post,
  depth,
  refreshParent,
}: {
  post: Post
  depth: number
  refreshParent: Function
}) {
  const [replies, setReplies] = useState<Post[]>(post.replies || [])
  const [expanded, setExpanded] = useState(false)

  const loadReplies = async () => {
    try {
      const fullPost = await fetchPost(post.id)
      setReplies((fullPost && fullPost.replies) || [])
      setExpanded(true)
    } catch {}
  }

  useEffect(() => {
    if (depth < 3) {
      loadReplies()
    }
  }, [])

  return (
    <div className="p-4 border-b border-gray-300">
      <div className="flex items-center mb-2">
        {post.author?.avatar && (
          <img
            src={post.author?.avatar}
            alt={post.author?.name || 'Utilisateur'}
            className="w-10 h-10 rounded-full mr-2"
          />
        )}
        <span className="font-bold">{post.author?.name || 'Anonyme'}</span>
      </div>
      <p className="text-gray-300">{post.content}</p>
      <span className="text-sm text-gray-500">{post.createdAt}</span>

      <div className="flex items-center">
        <button
          onClick={() => {
            removePost(post.id).then(() => refreshParent())
          }}
          className="text-blue-500 text-sm mt-2 w-100"
        >
          🗑️
        </button>
      </div>

      <PostForm respondingToId={post.id} whenPosted={() => loadReplies()} />

      {replies.length > 0 && expanded && (
        <div className="ml-6 mt-2 border-l pl-4 border-gray-300">
          {replies.map(reply => (
            <PostComponent
              key={reply.id}
              post={reply}
              depth={depth + 1}
              refreshParent={loadReplies}
            />
          ))}
        </div>
      )}
      {!expanded && (
        <button onClick={loadReplies} className="text-blue-500 text-sm mt-2">
          Voir les réponses
        </button>
      )}
    </div>
  )
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  function getPosts() {
    fetchPosts().then(data => {
      setPosts(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    getPosts()
  }, [])

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PostForm whenPosted={() => getPosts()} />
      {posts.map(post => (
        <PostComponent key={post.id} post={post} depth={0} refreshParent={getPosts} />
      ))}
    </div>
  )
}
