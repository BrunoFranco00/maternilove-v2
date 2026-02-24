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
                className="text-xl font-semibold text-text-primary mt-10 mb-4 first:mt-0"
              >
                {part.text}
              </h2>
            );
          }
          if (part.type === 'box') {
            return (
              <div
                key={i}
                className="my-6 p-6 rounded-ml-2xl bg-ml-rosa-50 border-l-4 border-ml-rosa-400"
              >
                <p className="text-sm font-medium text-ml-rosa-700 mb-2">Dica</p>
                <p className="text-text-primary text-sm leading-relaxed">
                  {part.text}
                </p>
              </div>
            );
          }
          return (
            <p key={i} className="text-text-secondary leading-relaxed mb-4">
              {part.text}
            </p>
          );
        })}
      </div>
      <footer className="mt-12 pt-6 border-t border-ml-rosa-200/50">
        <p className="text-xs text-text-secondary">
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
        <h1 className="text-2xl font-semibold text-text-primary mb-4">
          Artigo não encontrado
        </h1>
        <Link
          href="/app/inicio"
          className="text-ml-rosa-600 hover:text-ml-rosa-700 font-medium"
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
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <Link
        href="/app/inicio"
        className="inline-flex items-center gap-2 text-sm text-ml-rosa-600 hover:text-ml-rosa-700 font-medium"
      >
        ← Voltar
      </Link>

      {/* Hero */}
      <header className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-ml-rosa-100 text-ml-rosa-600 text-xs font-medium">
          {categoryLabels[article.category] || article.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold text-text-primary leading-tight">
          {article.title}
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          {article.excerpt}
        </p>
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
