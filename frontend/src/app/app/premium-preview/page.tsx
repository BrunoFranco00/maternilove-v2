'use client';

import '@/premium/premium.css';
import { useMemo } from 'react';
import { PremiumLayout } from '@/premium/PremiumLayout';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { TypingMessage } from '@/premium/TypingMessage';
import {
  generateDeepEmotionalMessage,
  type DiaryEntry,
} from '@/premium/generateDeepEmotionalMessage';

const ARTIGOS = [
  {
    id: '1',
    slug: 'movimentos-fetus',
    categoria: 'Gravidez',
    titulo: 'Quando os primeiros movimentos do bebê aparecem',
    excerpt:
      'A sensação dos chutes é única. Entenda o que esperar e quando procurar o médico.',
    hero: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80',
    body: `Os primeiros movimentos do seu bebê são um marco emocionante na gestação. A maioria das gestantes sente algo entre a 18ª e a 22ª semana, mas pode variar — especialmente em gestações anteriores, quando a mãe costuma perceber mais cedo.

O bebê já se mexe bastante desde as primeiras semanas; o que muda é a capacidade de você sentir esses movimentos. No início, parecem borbolas ou pequenos "estalos" na barriga. Com o tempo, os chutes ficam mais claros e frequentes.

Conte os movimentos a partir da 28ª semana. Uma forma simples: escolha um horário do dia, deite ou sente confortavelmente e registre quanto tempo leva para sentir 10 movimentos distintos. Se notar redução importante, vale conversar com seu obstetra.`,
    voceSabia: 'O bebê pode responder a sons externos a partir da 23ª semana. Falar com a barriga e ouvir música são formas de estabelecer vínculo desde já.',
  },
  {
    id: '2',
    slug: 'alimentacao-saudavel',
    categoria: 'Nutrição',
    titulo: 'Alimentação saudável no segundo trimestre',
    excerpt:
      'Dicas práticas para manter energia e nutrição sem exageros.',
    hero: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=1200&q=80',
    body: `O segundo trimestre costuma trazer mais disposição e menos enjoos. É um bom momento para reforçar hábitos alimentares que fazem bem a você e ao bebê. Foco em variedade: vegetais, frutas, grãos integrais, proteínas magras e gordura de qualidade.

Evite comer "por dois" em quantidade; o que importa é a qualidade. Aumento calórico recomendado gira em torno de 300 a 350 kcal por dia — o equivalente a um lanche bem equilibrado. Hidratação é essencial: água, chás sem cafeína e sopas leves ajudam a evitar desconfortos como inchaço e prisão de ventre.

Suplementos como ácido fólico e ferro costumam ser indicados. Siga sempre a orientação do seu obstetra ou nutricionista.`,
    voceSabia: 'O paladar do bebê começa a se formar ainda na gestação. Variedade na alimentação da mãe pode influenciar a aceitação de alimentos no futuro.',
  },
  {
    id: '3',
    slug: 'preparacao-parto',
    categoria: 'Parto',
    titulo: 'Preparando corpo e mente para o parto',
    excerpt:
      'Exercícios, respiração e planejamento para um parto mais tranquilo.',
    hero: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    body: `A preparação para o parto envolve corpo e mente. Exercícios específicos como alongamentos, caminhadas leves e atividades na água ajudam a manter a mobilidade e a força. O assoalho pélvico merece atenção especial — converse com seu médico ou fisioterapeuta sobre exercícios seguros.

Técnicas de respiração reduzem ansiedade e podem ser úteis durante as contrações. Praticar antes do grande dia facilita na hora H. Também vale definir seu plano de parto: preferências sobre ambiente, acompanhante, posições e procedimentos. Discuta tudo com a equipe que fará seu pré-natal e parto.

O parto é imprevisível, mas estar informada e preparada diminui medos e aumenta a sensação de controle.`,
    voceSabia: 'O hormônio ocitocina, responsável pelas contrações, também favorece o vínculo mãe-bebê após o nascimento.',
  },
];

function ArtigoEditorial({
  artigo,
}: {
  artigo: (typeof ARTIGOS)[0];
}) {
  const paragraphs = artigo.body.split(/\n\n+/);
  const firstParagraph = paragraphs[0] ?? '';
  const restParagraphs = paragraphs.slice(1);

  return (
    <article className="space-y-8 py-12">
      <div className="relative overflow-hidden rounded-[20px] aspect-[21/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artigo.hero}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-6">
        <span className="text-xs font-medium text-[#B3124F] uppercase tracking-[0.1em]">
          {artigo.categoria}
        </span>
        <h2
          className="text-3xl md:text-4xl font-semibold text-[#1C1C1C] leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {artigo.titulo}
        </h2>

        <hr className="border-t border-[#B3124F]/15" />

        <div className="space-y-6 text-[#1C1C1C] leading-relaxed text-lg">
          <p className="flex">
            <span
              className="float-left font-serif text-5xl leading-none text-[#B3124F] pt-1 pr-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {firstParagraph[0]}
            </span>
            {firstParagraph.slice(1)}
          </p>
          {restParagraphs.map((p, i) => (
            <p key={i} className="mb-6">
              {p}
            </p>
          ))}
        </div>

        <hr className="border-t border-[#B3124F]/15 my-8" />

        <aside className="rounded-[16px] bg-[#FFF1F4]/50 border-l-4 border-[#B3124F] p-6">
          <p className="text-sm font-semibold text-[#B3124F] uppercase tracking-wide mb-2">
            Você sabia?
          </p>
          <p className="text-[#1C1C1C] leading-relaxed">
            {artigo.voceSabia}
          </p>
        </aside>
      </div>
    </article>
  );
}

function InicioPreview() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <GlassCardV2>
        <h1
          className="text-2xl md:text-3xl font-semibold text-[#1C1C1C] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Bem-vinda, Mãe
        </h1>
        <p className="text-[#5F5F5F] text-base">
          Hoje você está com 24 semanas.
        </p>
      </GlassCardV2>

      {/* Check-in + Progresso */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCardV2>
          <h2 className="font-semibold text-[#1C1C1C] mb-2">
            Como você está?
          </h2>
          <p className="text-[#5F5F5F] text-sm mb-6">
            Registre seu check-in emocional
          </p>
          <PremiumButtonV3>Fazer check-in</PremiumButtonV3>
        </GlassCardV2>

        <GlassCardV2>
          <h2 className="font-semibold text-[#1C1C1C] mb-2">
            Progresso
          </h2>
          <p className="text-[#5F5F5F] text-sm">
            Semana 24 da gestação
          </p>
        </GlassCardV2>
      </div>

      {/* Feed editorial real - 3 artigos */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-semibold text-[#1C1C1C]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Para você hoje
        </h2>
        <p className="text-[#5F5F5F] text-sm">
          Conteúdos selecionados para sua fase
        </p>

        {ARTIGOS.map((artigo) => (
          <GlassCardV2 key={artigo.id}>
            <ArtigoEditorial artigo={artigo} />
          </GlassCardV2>
        ))}
      </section>

      {/* Acesso rápido */}
      <GlassCardV2 className="bg-[#FFF1F4]/30 border-[#B3124F]/20">
        <h2 className="font-semibold text-[#1C1C1C] mb-4">
          Acesso rápido
        </h2>
        <div className="flex flex-wrap gap-3">
          <PremiumButtonV3 variant="ghost">Recursos</PremiumButtonV3>
          <PremiumButtonV3 variant="ghost">Comunidade</PremiumButtonV3>
          <PremiumButtonV3 variant="ghost">Marketplace</PremiumButtonV3>
        </div>
      </GlassCardV2>
    </div>
  );
}

function ProgressoPreview() {
  const diaryEntries: DiaryEntry[] = useMemo(
    () => [
      {
        text: 'Hoje me senti muito grata pela família e pelo apoio que tenho recebido.',
        sentiment: 'gratidao',
        date: new Date().toISOString(),
      },
      {
        text: 'Um pouco cansada, mas feliz com os movimentos do bebê.',
        sentiment: 'cansaco',
        date: new Date().toISOString(),
      },
    ],
    []
  );

  const mensagem = useMemo(
    () => generateDeepEmotionalMessage(24, 'calma', diaryEntries),
    [diaryEntries]
  );

  return (
    <div
      id="progresso"
      className="space-y-8 scroll-mt-24"
      style={{ animation: 'fadeInSmooth 300ms ease forwards' }}
    >
      <div>
        <h1
          className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Progresso
        </h1>
        <p className="text-[#5F5F5F] mt-1">
          Acompanhe o desenvolvimento da sua gestação
        </p>
      </div>

      <GlassCardV2>
        <h3 className="font-semibold text-[#1C1C1C] mb-2">
          Semana atual
        </h3>
        <p className="text-3xl font-bold text-[#B3124F] mb-4">
          Semana 24
        </p>
        <p className="text-sm text-[#5F5F5F] mb-6">
          Dados fictícios para demonstração
        </p>
        <div className="pt-4 border-t border-[#B3124F]/15">
          <p className="text-xs font-semibold text-[#B3124F] uppercase tracking-wide mb-2">
            Mensagem para você
          </p>
          <TypingMessage text={mensagem} speed={35} className="text-[#1C1C1C] leading-relaxed" />
        </div>
      </GlassCardV2>

      <GlassCardV2>
        <h3 className="font-medium text-[#1C1C1C] mb-4">
          Placeholder visual 3D
        </h3>
        <div className="h-40 rounded-xl bg-gradient-to-br from-[#FFF1F4] to-[#FFF8F9] flex items-center justify-center border border-[#B3124F]/10">
          <span className="text-[#5F5F5F] text-sm">
            Gráfico em breve
          </span>
        </div>
      </GlassCardV2>
    </div>
  );
}

export default function PremiumPreviewPage() {
  return (
    <PremiumLayout>
      <div className="space-y-16 max-w-4xl mx-auto">
        <section>
          <h2 className="sr-only">Início</h2>
          <InicioPreview />
        </section>
        <section>
          <ProgressoPreview />
        </section>
      </div>
    </PremiumLayout>
  );
}
