/**
 * Base i18n-ready mínima (sem framework)
 * Função t() para evitar hardcode de strings
 */

type Dictionary = Record<string, string>;

const ptBR: Dictionary = {
  // Comum
  'common.loading': 'Carregando...',
  'common.error': 'Erro',
  'common.retry': 'Tentar novamente',
  'common.empty': 'Nenhum item encontrado',
  'common.empty.description': 'Não há dados para exibir no momento.',
  
  // Erros
  'error.generic': 'Algo deu errado',
  'error.generic.description': 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  'error.network': 'Erro de conexão',
  'error.network.description': 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  
  // Páginas
  'page.home.title': 'Bem-vindo ao MaterniLove',
  'page.home.description': 'Sua jornada de maternidade começa aqui.',
  'page.login.title': 'Entrar',
  'page.login.description': 'Acesse sua conta',
  'page.register.title': 'Criar conta',
  'page.register.description': 'Comece sua jornada',
  'page.dashboard.title': 'Dashboard',
  'page.dashboard.description': 'Bem-vindo ao seu painel',
  
  // Navegação
  'nav.login': 'Entrar',
  'nav.register': 'Criar conta',
  'nav.dashboard': 'Dashboard',
};

/**
 * Função de tradução mínima
 * @param key - Chave de tradução
 * @returns String traduzida ou a própria chave se não encontrada
 */
export function t(key: string): string {
  return ptBR[key] || key;
}

export { ptBR };
export type { Dictionary };
