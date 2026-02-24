'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { getArticleBySlug } from '@/data/articles';

function parseContent(content: string) {
  const parts: { type: 'h2' | 'p' | 'box'; text: string }[] = [];
  let inBox = false;
  let boxContent = '';

  const lines = content.split('\n');

  for (const line of lines) {
    if (line.startsWith('[BOX]')) {
      inBox = true;
      boxContent = '';
      continue;
    }
    if (line.startsWith('[/BOX]')) {
      inBox = false;
      parts.push({ type: 'box', text: boxContent.trim() });
      continue;
    }
    if (inBox) {
      boxContent += (boxContent ? '\n' : '') + line;
      continue;
    }
    if (line.startsWith('## ')) {
      parts.push({ type: 'h2', text: line.slice(3).trim() });
      continue;
    }
    if (line.trim()) {
      parts.push({ type: 'p', text: line.trim() });
    }
  }

  return parts;
}

function ArticleContent({ article }: { article: NonNullable<ReturnType<typeof getArticleBySlug>> }) {
  const parts = parseContent(article.content);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="prose prose-lg max-w-none">
        {parts.map((part, i) => {
          if (part.type === 'h2') {
            return (
              <h2
                key={i}
                className="font-title text-2xl font-semibold text-premium-text-primary mt-12 mb-4 first:mt-0"
              >
                {part.text}
              </h2>
            );
          }
          if (part.type === 'box') {
            return (
              <div
                key={i}
                className="my-8 p-6 md:p-8 rounded-[20px] bg-premium-soft-bg/60 border-l-4 border-premium-primary"
              >
                <p className="font-title text-sm font-semibold text-premium-primary mb-2 uppercase tracking-wide">
                  Destaque
                </p>
                <p className="font-body text-premium-text-primary text-base leading-relaxed">
                  {part.text}
                </p>
              </div>
            );
          }
          return (
            <p
              key={i}
              className="font-body text-premium-text-secondary leading-relaxed mb-6 text-[1.05rem]"
            >
              {part.text}
            </p>
          );
        })}
      </div>
      <footer className="mt-16 pt-8 border-t border-premium-soft-bg">
        <p className="font-body text-xs text-premium-text-secondary">
          <strong>Referências:</strong> {article.reference}
        </p>
      </footer>
    </article>
  );
}

function ConteudoPageContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="font-title text-2xl font-semibold text-premium-text-primary mb-4">
          Artigo não encontrado
        </h1>
        <Link
          href="/app/inicio"
          className="text-premium-primary hover:text-premium-primary-dark font-medium"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    gravidez: 'Gravidez',
    'recem-nascido': 'Recém-nascido',
    '1-2 anos': '1 a 2 anos',
    '3-5 anos': '3 a 5 anos',
    emocional: 'Emocional',
  };

  return (
    <div className="p-8 space-y-10 max-w-5xl mx-auto">
      <Link
        href="/app/inicio"
        className="inline-flex items-center gap-2 text-sm text-premium-primary hover:text-premium-primary-dark font-medium"
      >
        ← Voltar
      </Link>

      {/* Hero editorial grande */}
      <header className="space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-premium-soft-bg text-premium-primary text-xs font-medium uppercase tracking-widest">
          {categoryLabels[article.category] || article.category}
        </span>
        <h1 className="font-title text-3xl md:text-5xl font-semibold text-premium-text-primary leading-tight">
          {article.title}
        </h1>
        <p className="font-body text-xl text-premium-text-secondary max-w-2xl leading-relaxed">
          {article.excerpt}
        </p>
        {/* Imagem ilustrativa placeholder */}
        <div className="aspect-[21/9] rounded-[20px] bg-gradient-to-br from-premium-primary/15 via-premium-soft-bg to-premium-primary/5 flex items-center justify-center mt-8">
          <span className="text-7xl opacity-20">♥</span>
        </div>
      </header>

      {/* Conteúdo */}
      <ArticleContent article={article} />
    </div>
  );
}

export default function ConteudoPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <ConteudoPageContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
