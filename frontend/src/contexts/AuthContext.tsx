import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token salvo
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Validar token e buscar usuário
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando fazer login...', { email });
      const data = await apiClient.post<{
        user: User;
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      }>('/auth/login', { email, password });
      
      console.log('📥 Resposta do login:', data);
      
      const { user, tokens } = data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      console.log('✅ Login realizado com sucesso!', { user: user.email });
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('📝 Tentando criar conta...', { name, email });
      const data = await apiClient.post<{
        user: User;
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      }>('/auth/register', { name, email, password });
      
      console.log('📥 Resposta do registro:', data);
      
      const { user, tokens } = data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      console.log('✅ Conta criada com sucesso!', { user: user.email });
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
