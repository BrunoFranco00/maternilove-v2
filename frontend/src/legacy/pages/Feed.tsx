import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

interface Post {
  id: string
  content: string
  images: string[]
  createdAt: string
  isLiked: boolean
  likesCount: number
  commentsCount: number
  user: {
    id: string
    name: string
    avatar: string | null
  }
  comments: Array<{
    id: string
    text: string
    createdAt: string
    user: {
      id: string
      name: string
      avatar: string | null
    }
  }>
}

export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [creatingPost, setCreatingPost] = useState(false)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({})

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<{ posts: Post[] }>('/social/feed')
      if (data?.posts) {
        setPosts(data.posts)
      }
    } catch (error: any) {
      toast.error('Erro ao carregar feed')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async () => {
    if (!newPostContent.trim() || !user) return

    try {
      setCreatingPost(true)
      const post = await apiClient.post<Post>('/social/posts', {
        content: newPostContent,
        images: [],
      })

      if (post) {
        setPosts([post, ...posts])
        setNewPostContent('')
        toast.success('Post criado com sucesso!')
      }
    } catch (error: any) {
      toast.error('Erro ao criar post')
      console.error(error)
    } finally {
      setCreatingPost(false)
    }
  }

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error('Faça login para curtir posts')
      return
    }

    try {
      const data = await apiClient.post<{ liked: boolean }>(`/social/posts/${postId}/like`)

      if (data) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: data.liked,
              likesCount: data.liked
                ? post.likesCount + 1
                : post.likesCount - 1,
            }
          }
          return post
        }))
      }
    } catch (error: any) {
      toast.error('Erro ao curtir post')
      console.error(error)
    }
  }

  const createComment = async (postId: string) => {
    if (!user || !commentText[postId]?.trim()) return

    try {
      const comment = await apiClient.post<Post['comments'][0]>(`/social/posts/${postId}/comments`, {
        text: commentText[postId],
      })

      if (comment) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [comment, ...post.comments],
              commentsCount: post.commentsCount + 1,
            }
          }
          return post
        }))
        setCommentText({ ...commentText, [postId]: '' })
      }
    } catch (error: any) {
      toast.error('Erro ao comentar')
      console.error(error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed Social</h1>

        {/* Criar Post */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Compartilhe algo com a comunidade..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={createPost}
                disabled={creatingPost || !newPostContent.trim()}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creatingPost ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header do Post */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-semibold">
                    {post.user.avatar ? (
                      <img src={post.user.avatar} alt={post.user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      post.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Post */}
              <div className="p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                
                {post.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {post.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Imagem ${idx + 1}`} className="rounded-lg w-full h-48 object-cover" />
                    ))}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-2 ${
                      post.isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-pink-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.commentsCount}</span>
                  </button>
                </div>
              </div>

              {/* Comentários */}
              {expandedPost === post.id && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  {/* Lista de Comentários */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 text-sm font-semibold flex-shrink-0">
                            {comment.user.avatar ? (
                              <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              comment.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <h4 className="font-semibold text-sm text-gray-900">{comment.user.name}</h4>
                              <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário de Comentário */}
                  {user && (
                    <div className="mt-4 flex space-x-2">
                      <input
                        type="text"
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                        placeholder="Escreva um comentário..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            createComment(post.id)
                          }
                        }}
                      />
                      <button
                        onClick={() => createComment(post.id)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                      >
                        Enviar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

