import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  postsCount: number
}

interface CommunityPost {
  id: string
  title: string
  content: string
  views: number
  createdAt: string
  commentsCount: number
  user: {
    id: string
    name: string
    avatar: string | null
  }
  category: {
    id: string
    name: string
    icon: string | null
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

export default function Community() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({ categoryId: '', title: '', content: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const data = await apiClient.get<Category[]>('/community/categories')
      if (data) {
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (error: any) {
      toast.error('Erro ao carregar categorias')
      console.error(error)
    }
  }

  const loadPosts = async () => {
    try {
      setLoading(true)
      const query = selectedCategory ? `?categoryId=${selectedCategory}` : ''
      const data = await apiClient.get<{ posts: CommunityPost[] }>(`/community/posts${query}`)
      if (data?.posts) {
        setPosts(data.posts)
      }
    } catch (error: any) {
      toast.error('Erro ao carregar posts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async () => {
    if (!newPost.categoryId || !newPost.title.trim() || !newPost.content.trim() || !user) {
      toast.error('Preencha todos os campos')
      return
    }

    try {
      const post = await apiClient.post<CommunityPost>('/community/posts', newPost)

      if (post) {
        setPosts([post, ...posts])
        setNewPost({ categoryId: '', title: '', content: '' })
        setShowCreatePost(false)
        toast.success('Post criado com sucesso!')
      }
    } catch (error: any) {
      toast.error('Erro ao criar post')
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Comunidade</h1>
          {user && (
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              + Novo Post
            </button>
          )}
        </div>

        {/* Criar Post */}
        {showCreatePost && user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Criar Novo Post</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={newPost.categoryId}
                  onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Título do post"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Conteúdo do post..."
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreatePost(false)
                    setNewPost({ categoryId: '', title: '', content: '' })
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={createPost}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categorias */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name} ({category.postsCount})
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
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
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    {post.category.name}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{post.views} visualizações</span>
                  <span>{post.commentsCount} comentários</span>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">Nenhum post encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

