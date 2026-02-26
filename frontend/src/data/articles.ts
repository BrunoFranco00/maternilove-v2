export type ArticleCategory =
  | 'gravidez'
  | 'recem-nascido'
  | '1-2 anos'
  | '3-5 anos'
  | 'emocional';

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  content: string;
  reference: string;
}

export const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'alimentacao-gestacao',
    category: 'gravidez',
    title: 'Alimentação saudável na gestação',
    excerpt:
      'Orientações da OMS e Ministério da Saúde para uma dieta equilibrada durante a gravidez.',
    content: `## Introdução
A alimentação durante a gestação é fundamental para o desenvolvimento do bebê e a saúde da mãe. Uma dieta equilibrada fornece os nutrientes necessários para ambos.

## Nutrientes essenciais
O ácido fólico, ferro, cálcio e vitamina D são especialmente importantes. O ácido fólico previne defeitos do tubo neural. O ferro previne anemia. O cálcio fortalece ossos e dentes.

## Ganho de peso adequado
O ganho de peso recomendado varia conforme o IMC pré-gestacional. Em média, 11 a 16 kg para gestantes com peso normal. A orientação individualizada é fundamental.

## Alimentos a evitar
Evite carnes cruas, peixes com alto teor de mercúrio, queijos não pasteurizados e bebidas alcoólicas. Reduza cafeína.

## Hidratação
A ingestão de água é crucial. Recomenda-se pelo menos 2 litros por dia para manter o volume de líquido amniótico e a circulação adequada.

[BOX]
Dica: Faça refeições menores e mais frequentes para aliviar enjoos e azia. Prefira alimentos integrais e evite frituras.
[/BOX]

## Conclusão
Seguir uma alimentação balanceada, com acompanhamento profissional, contribui para uma gestação saudável e um bebê com melhor desenvolvimento.`,
    reference: 'OMS. Recomendações sobre cuidados pré-natais. 2016. Ministério da Saúde. Guia alimentar para a população brasileira. 2014.',
  },
  {
    id: '2',
    slug: 'pre-natal-essencial',
    category: 'gravidez',
    title: 'Pré-natal: consultas essenciais',
    excerpt:
      'Conheça o calendário de consultas e exames recomendados durante a gestação.',
    content: `## Introdução
O pré-natal é o acompanhamento médico da gestação, fundamental para prevenir complicações e garantir a saúde de mãe e bebê.

## Primeira consulta
Deve ocorrer assim que a gravidez for confirmada. Inclui anamnese completa, exame físico e solicitação de exames laboratoriais iniciais.

## Calendário de consultas
Recomenda-se no mínimo 6 consultas: 1 no primeiro trimestre, 2 no segundo e 3 no terceiro. Gestações de risco podem exigir acompanhamento mais frequente.

## Exames do primeiro trimestre
Ultrassom para datação, tipagem sanguínea, hemograma, glicemia, sorologias (HIV, sífilis, hepatites), urina e fezes.

## Exames do segundo e terceiro trimestres
Ultrassom morfológico, teste de tolerância à glicose, repetição de hemograma e acompanhamento da pressão arterial.

[BOX]
Importante: Nunca falte às consultas. Cada uma tem um objetivo específico para monitorar sua saúde e a do bebê.
[/BOX]

## Conclusão
O pré-natal adequado reduz significativamente a mortalidade materna e neonatal. Procure iniciar o acompanhamento o quanto antes.`,
    reference: 'Ministério da Saúde. Pré-natal e Puerpério: atenção qualificada e humanizada. 2022. ACOG. Guidelines for Perinatal Care. 9th ed.',
  },
  {
    id: '3',
    slug: 'exercicios-gravidez',
    category: 'gravidez',
    title: 'Exercícios físicos na gestação',
    excerpt:
      'Benefícios e recomendações seguras para manter-se ativa durante a gravidez.',
    content: `## Introdução
A prática de exercícios físicos durante a gestação é segura e recomendada para a maioria das mulheres, trazendo benefícios físicos e emocionais.

## Benefícios
Melhora a circulação, reduz inchaço, fortalece a musculatura para o parto, ajuda no controle de peso e melhora o humor e o sono.

## Atividades recomendadas
Caminhada, natação, hidroginástica, yoga adaptada e pilates. São atividades de baixo impacto e seguras quando bem orientadas.

## Contraindicações
Gestantes com placenta prévia, risco de parto prematuro, sangramento ou condições cardíacas devem evitar exercícios sem liberação médica.

## Intensidade
A intensidade deve ser moderada. A gestante deve conseguir manter uma conversa durante a atividade. Evite sobrecarga e calor excessivo.

[BOX]
Recomendação: 150 minutos de atividade moderada por semana, distribuídos em 3 a 5 dias. Sempre com liberação do obstetra.
[/BOX]

## Conclusão
Manter-se ativa na gestação traz benefícios comprovados. Consulte seu médico para uma orientação personalizada.`,
    reference: 'ACOG. Physical Activity and Exercise During Pregnancy. Committee Opinion 804. 2020. OMS. Diretrizes de atividade física. 2020.',
  },
  {
    id: '4',
    slug: 'sono-gestacao',
    category: 'gravidez',
    title: 'Qualidade do sono na gestação',
    excerpt:
      'Dicas para dormir melhor durante os trimestres da gravidez.',
    content: `## Introdução
As alterações hormonais e físicas da gestação podem afetar o sono. Conhecer estratégias para melhorar a qualidade do descanso é essencial.

## Primeiro trimestre
A sonolência aumenta devido à progesterona. Cochilos curtos durante o dia podem ajudar. Evite cafeína à tarde.

## Segundo trimestre
Geralmente o sono melhora. Aproveite para estabelecer uma rotina: horário fixo para dormir e acordar.

## Terceiro trimestre
O desconforto pode aumentar. Use travesseiros entre as pernas e sob a barriga. A posição lateral esquerda é a mais recomendada.

## Higiene do sono
Ambiente escuro e silencioso, temperatura agradável, evitar telas antes de dormir e refeições pesadas à noite.

[BOX]
Posição: Deitar do lado esquerdo melhora a circulação para o útero e o bebê. Evite permanecer de barriga para cima por longos períodos.
[/BOX]

## Conclusão
Priorizar o sono na gestação beneficia a saúde mental e física. Se os distúrbios persistirem, converse com seu médico.`,
    reference: 'Sociedade Brasileira de Sono. Consenso sobre o sono na gestação. 2020. Ministério da Saúde. Guia de atenção à saúde do sono.',
  },
  {
    id: '5',
    slug: 'parto-humanizado',
    category: 'gravidez',
    title: 'Parto humanizado: o que você precisa saber',
    excerpt:
      'Conheça os princípios e benefícios do parto humanizado.',
    content: `## Introdução
O parto humanizado prioriza a autonomia da mulher, o respeito ao processo fisiológico e o vínculo materno-infantil desde o nascimento.

## Princípios
Respeito às escolhas da gestante, evitação de intervenções desnecessárias, ambiente acolhedor e presença de acompanhante de livre escolha.

## Tipos de parto
O parto normal é o mais indicado quando não há contraindicações. A cesárea deve ser reservada para situações em que há indicação clínica.

## Benefícios
Menor risco de infecção, recuperação mais rápida, melhor estabelecimento da amamentação e experiência mais positiva para a família.

[BOX]
Direito: Toda gestante tem direito a plano de parto, acompanhante e informações sobre as intervenções propostas. Conhecimento é poder.
[/BOX]

## Conclusão
Informar-se sobre as opções de parto permite decisões conscientes. Converse com sua equipe de saúde sobre suas preferências.`,
    reference: 'Ministério da Saúde. Diretrizes de atenção ao parto normal. 2017. OMS. Recomendações para cuidados intraparto. 2018.',
  },
  {
    id: '6',
    slug: 'amamentacao-inicio',
    category: 'recem-nascido',
    title: 'Amamentação: início e primeiros dias',
    excerpt:
      'Orientações para o sucesso da amamentação nos primeiros dias de vida.',
    content: `## Introdução
A amamentação é a forma mais adequada de alimentar o recém-nascido. O leite materno oferece todos os nutrientes e proteção necessários.

## Primeira hora
O contato pele a pele e a primeira mamada na primeira hora de vida são fundamentais. O colostro é rico em anticorpos.

## Posicionamento
A pega correta evita fissuras e garante a transferência adequada de leite. O bebê deve abocanhar a aréola, não apenas o mamilo.

## Livre demanda
Ofereça o peito sempre que o bebê demonstrar sinais de fome. Nos primeiros dias, as mamadas podem ser frequentes e isso é normal.

## Sinais de boa mamada
O bebê suga de forma ritmada, você ouve ou sente a deglutição, e as mamas ficam mais macias após a mamada.

[BOX]
Dica: Busque apoio de doulas, consultoras e grupos de apoio à amamentação. O suporte faz toda a diferença.
[/BOX]

## Conclusão
A amamentação é um aprendizado para mãe e bebê. Persistência e apoio são essenciais nos primeiros dias.`,
    reference: 'OMS/UNICEF. Iniciativa Hospital Amigo da Criança. SBP. Departamento de Aleitamento Materno. 2021.',
  },
  {
    id: '7',
    slug: 'sono-recem-nascido',
    category: 'recem-nascido',
    title: 'Sono seguro do recém-nascido',
    excerpt:
      'Recomendações para reduzir o risco de morte súbita infantil.',
    content: `## Introdução
O sono seguro é fundamental para prevenir a Síndrome da Morte Súbita do Lactente (SMSL) e outros acidentes durante o sono.

## Posição para dormir
O bebê deve dormir sempre de barriga para cima, em superfície firme e plana. Nunca de lado ou de bruços.

## Ambiente
O berço deve ser próprio para bebê, com colchão firme, sem travesseiros, almofadas, bordas ou brinquedos soltos. O bebê deve dormir no quarto dos pais, mas não na mesma cama.

## Temperatura
Evite agasalhar o bebê em excesso. A temperatura ambiente deve ser agradável. Toque no peito ou na nuca para verificar se está frio ou quente.

## Amamentação
A amamentação está associada à redução do risco de SMSL. Após mamar, coloque o bebê de barriga para cima no berço.

[BOX]
Regra de ouro: De barriga para cima, em superfície firme, sem objetos soltos no berço. Compartilhe o quarto, não a cama.
[/BOX]

## Conclusão
Seguir as recomendações de sono seguro reduz significativamente os riscos. Converse com o pediatra sobre qualquer dúvida.`,
    reference: 'Sociedade Brasileira de Pediatria. Sono seguro. 2022. AAP. Safe Sleep Recommendations. 2022.',
  },
  {
    id: '8',
    slug: 'coto-umbilical',
    category: 'recem-nascido',
    title: 'Cuidados com o coto umbilical',
    excerpt:
      'Como higienizar e acompanhar a cicatrização do umbigo do bebê.',
    content: `## Introdução
O coto umbilical é o restante do cordão que seca e cai naturalmente entre 7 e 21 dias de vida. Os cuidados são simples e importantes.

## Higienização
Lave a região com água e sabão neutro durante o banho. Seque bem com gaze ou fralda limpa. Não use álcool ou outros produtos.

## Curativo
O coto deve ficar exposto ao ar. Evite cobrir com fralda. Dobre a fralda para baixo para não pressionar a região.

## Sinais de alerta
Procure o pediatra se houver vermelhidão ao redor, secreção com mau cheiro, sangramento ou febre. O umbigo pode ter pequena secreção transparente, o que é normal.

## Após a queda
Continue limpando a região até que cicatrize completamente. O umbigo pode levar alguns dias para cicatrizar totalmente.

[BOX]
Atualização: A OMS e a SBP não recomendam mais o uso de álcool no coto. A limpeza com água e sabão é suficiente.
[/BOX]

## Conclusão
Os cuidados com o coto são simples. A maioria dos bebês não apresenta problemas. Em caso de dúvida, consulte o pediatra.`,
    reference: 'SBP. Guia de cuidados com o recém-nascido. OMS. Cuidados do cordão umbilical. 2019.',
  },
  {
    id: '9',
    slug: 'banho-recem-nascido',
    category: 'recem-nascido',
    title: 'Banho do recém-nascido',
    excerpt:
      'Passo a passo para um banho seguro e tranquilo.',
    content: `## Introdução
O banho do recém-nascido pode ser um momento de conexão e relaxamento. Com alguns cuidados, o banho se torna seguro e prazeroso.

## Frequência
Nos primeiros dias, 2 a 3 banhos por semana são suficientes. Banhos diários podem ressecar a pele. O banho de "gato" (limpeza com pano úmido) pode ser feito nos intervalos.

## Temperatura
A água deve estar morna, em torno de 37°C. Teste com o cotovelo ou com termômetro. O ambiente deve estar aquecido e sem correntes de ar.

## Produtos
Use sabonete neutro e shampoo específico para bebês. Evite excesso de produtos. A pele do bebê é sensível.

## Segurança
Nunca deixe o bebê sozinho na banheira. Segure-o firmemente. A água deve cobrir apenas até o ombro do bebê. Banheira com apoio adequado é recomendada.

[BOX]
Momento: O banho pode ser feito a qualquer hora do dia. Alguns bebês relaxam mais com banho à noite, antes de dormir.
[/BOX]

## Conclusão
O banho é um ritual de cuidado. Com calma e organização, o momento se torna agradável para mãe e bebê.`,
    reference: 'SBP. Guia de cuidados com o recém-nascido. Ministério da Saúde. Caderneta da criança.',
  },
  {
    id: '10',
    slug: 'choro-bebe',
    category: 'recem-nascido',
    title: 'Entendendo o choro do bebê',
    excerpt:
      'Como identificar e responder às necessidades do recém-nascido.',
    content: `## Introdução
O choro é a principal forma de comunicação do bebê. Com o tempo, os pais aprendem a identificar diferentes tipos de choro e suas causas.

## Possíveis causas
Fome, fralda suja, desconforto (frio, calor), sono, necessidade de colo, cólica ou dor. Às vezes o bebê chora sem causa aparente.

## Resposta ao choro
Atender ao choro não "mima" o bebê. O recém-nascido precisa de conforto e segurança. O colo e o contato acalmam.

## Cólica
Entre 2 semanas e 3 meses, muitos bebês têm cólicas. Massagens, posição de bruços no colo e balanço suave podem ajudar. Consulte o pediatra.

[BOX]
Calma: Respire. O choro do bebê pode ser estressante. Se precisar, coloque o bebê em local seguro e afaste-se por alguns minutos para se acalmar.
[/BOX]

## Conclusão
O choro é comunicação. Com paciência e observação, você aprenderá a identificar as necessidades do seu bebê.`,
    reference: 'SBP. Orientações para pais. OMS. Cuidados com o recém-nascido.',
  },
  {
    id: '11',
    slug: 'alimentacao-1-2-anos',
    category: '1-2 anos',
    title: 'Alimentação complementar: 1 a 2 anos',
    excerpt:
      'Transição para a alimentação da família e hábitos saudáveis.',
    content: `## Introdução
Entre 1 e 2 anos, a criança continua a explorar novos sabores e texturas. A alimentação complementar deve ser variada e nutritiva.

## O que oferecer
A criança pode comer a comida da família, adaptada em textura (cortes menores, menos temperos fortes). Ofereça frutas, vegetais, proteínas e carboidratos.

## Evitar
Açúcar refinado, mel (antes de 1 ano), alimentos ultraprocessados, sal em excesso e alimentos que podem causar engasgo (uva inteira, salsicha em rodelas).

## Refeições
Estabeleça horários regulares. A criança deve comer à mesa com a família. Evite distrações como telas durante as refeições.

[BOX]
Autonomia: Deixe a criança explorar a comida com as mãos. A sujeira faz parte do aprendizado. Ofereça, não force.
[/BOX]

## Conclusão
A alimentação nessa fase é fundamental para formar hábitos saudáveis. Paciência e variedade são as chaves.`,
    reference: 'OMS. Alimentação complementar. SBP. Manual de alimentação. Ministério da Saúde. Guia alimentar para crianças menores de 2 anos.',
  },
  {
    id: '12',
    slug: 'desenvolvimento-1-2-anos',
    category: '1-2 anos',
    title: 'Marcos do desenvolvimento: 1 a 2 anos',
    excerpt:
      'O que esperar em termos de desenvolvimento motor, cognitivo e de linguagem.',
    content: `## Introdução
Entre 1 e 2 anos, a criança passa por grandes transformações físicas e cognitivas. Conhecer os marcos ajuda a acompanhar o desenvolvimento.

## Desenvolvimento motor
A criança aprende a andar sozinha, subir escadas com apoio, empilhar blocos, rabiscar e comer com colher. Cada criança tem seu ritmo.

## Linguagem
O vocabulário aumenta. A criança entende mais do que fala. Aponta para objetos, diz algumas palavras e combina duas palavras por volta de 2 anos.

## Social e emocional
Explora o ambiente, imita adultos, demonstra preferências e pode ter ansiedade de separação. O brincar é essencial para o desenvolvimento.

[BOX]
Importante: Os marcos são referências. Se houver preocupação com o desenvolvimento, converse com o pediatra. A intervenção precoce faz diferença.
[/BOX]

## Conclusão
Acompanhar o desenvolvimento com o pediatra é fundamental. Cada criança é única e se desenvolve no seu tempo.`,
    reference: 'SBP. Guia de desenvolvimento infantil. OMS. Marcos do desenvolvimento. 2020.',
  },
  {
    id: '13',
    slug: 'sono-1-2-anos',
    category: '1-2 anos',
    title: 'Sono da criança: 1 a 2 anos',
    excerpt:
      'Estabelecendo rotinas e lidando com regressões do sono.',
    content: `## Introdução
Entre 1 e 2 anos, a criança precisa de 11 a 14 horas de sono por dia, incluindo a soneca. Rotinas consistentes ajudam.

## Rotina do sono
Um ritual antes de dormir (banho, pijama, história, canção) ajuda a criança a se preparar. Faça no mesmo horário sempre que possível.

## Regressões
Saltos de desenvolvimento, dentes, doenças ou mudanças podem afetar o sono. É temporário. Mantenha a rotina e ofereça conforto.

## Sono independente
Algumas crianças dormem melhor no próprio quarto; outras precisam da presença dos pais por mais tempo. Respeite o ritmo da família.

[BOX]
Dica: Evite telas 1 hora antes de dormir. A luz azul interfere na produção de melatonina e na qualidade do sono.
[/BOX]

## Conclusão
O sono é fundamental para o desenvolvimento. Rotinas e paciência ajudam a família a atravessar as fases de transição.`,
    reference: 'SBP. Sono na infância. AAP. Sleep recommendations. 2022.',
  },
  {
    id: '14',
    slug: 'linguagem-3-5-anos',
    category: '3-5 anos',
    title: 'Desenvolvimento da linguagem: 3 a 5 anos',
    excerpt:
      'Como estimular o vocabulário e a comunicação em idade pré-escolar.',
    content: `## Introdução
Entre 3 e 5 anos, a linguagem explode. A criança passa a formar frases completas, contar histórias e fazer perguntas. A estimulação é fundamental.

## O que esperar
Aos 3 anos: frases de 3-4 palavras. Aos 4: histórias mais elaboradas. Aos 5: conversas complexas e compreensão de regras gramaticais.

## Como estimular
Leia diariamente, converse sobre o dia, responda às perguntas com paciência, cante e brinque com rimas. Evite corrigir demais; modele a forma correta.

## Sinais de alerta
Dificuldade para ser entendida, pouca fala, falta de interesse em interação. Avaliação fonoaudiológica pode ser necessária.

[BOX]
Leitura: Ler para a criança é uma das melhores formas de estimular a linguagem. Faça perguntas sobre a história e incentive a imaginação.
[/BOX]

## Conclusão
A linguagem se desenvolve em interação. Converse, leia e brinque. Em caso de dúvida, consulte o pediatra ou fonoaudiólogo.`,
    reference: 'SBP. Desenvolvimento da linguagem. ASHA. Language Development. 2021.',
  },
  {
    id: '15',
    slug: 'socializacao-pre-escolar',
    category: '3-5 anos',
    title: 'Socialização na pré-escola',
    excerpt:
      'Como apoiar a criança na interação com outros e no ambiente escolar.',
    content: `## Introdução
A pré-escola é um ambiente rico para o desenvolvimento social. A criança aprende a compartilhar, resolver conflitos e fazer amigos.

## Preparação
Converse sobre a escola, visite o espaço antes, faça a adaptação gradual. A presença dos pais nos primeiros dias pode ser necessária.

## Conflitos
Brigas por brinquedos e desentendimentos são comuns. Ensine a criança a nomear suas emoções e a expressar o que sente. Modele a resolução de conflitos.

## Amizades
Aos poucos, a criança desenvolve preferências e amizades. Respeite e apoie. Converse sobre o que acontece na escola.

[BOX]
Dica: Não compare o ritmo do seu filho com o de outros. Cada criança tem seu tempo para se adaptar e se socializar.
[/BOX]

## Conclusão
A socialização é um processo. Apoie, converse e mantenha parceria com a escola. O desenvolvimento é gradual.`,
    reference: 'SBP. Guia de saúde escolar. Ministério da Educação. BNCC.',
  },
  {
    id: '16',
    slug: 'ansiedade-gestacao',
    category: 'emocional',
    title: 'Ansiedade na gestação',
    excerpt:
      'Reconhecendo e lidando com a ansiedade durante a gravidez.',
    content: `## Introdução
A gestação é um período de muitas mudanças e expectativas. É comum sentir ansiedade. Reconhecer e buscar apoio é essencial.

## Causas comuns
Preocupação com a saúde do bebê, medo do parto, mudanças no corpo, incertezas sobre a maternidade. Hormônios também influenciam.

## Sinais de alerta
Preocupação excessiva, dificuldade para dormir, pensamentos repetitivos, irritabilidade ou tristeza persistente. Busque ajuda profissional.

## Estratégias
Respiração consciente, relaxamento, exercícios leves, conversar com outras gestantes, limitar informações excessivas. Evite pesquisas excessivas na internet.

[BOX]
Importante: A depressão e a ansiedade na gestação são tratáveis. Buscar ajuda não é sinal de fraqueza. O cuidado com a saúde mental beneficia mãe e bebê.
[/BOX]

## Conclusão
A saúde mental na gestação merece atenção. Converse com seu obstetra e busque apoio psicológico quando necessário.`,
    reference: 'OMS. Saúde mental na gestação. ACOG. Screening for Perinatal Depression. 2018.',
  },
  {
    id: '17',
    slug: 'baby-blues-pos-parto',
    category: 'emocional',
    title: 'Baby blues e depressão pós-parto',
    excerpt:
      'Diferenças, sinais e quando buscar ajuda.',
    content: `## Introdução
O pós-parto traz alterações emocionais. O baby blues é comum e passageiro. A depressão pós-parto requer tratamento.

## Baby blues
Acontece em 50-80% das mães. Aparece entre o 3º e 5º dia após o parto. Caracteriza-se por tristeza, choro fácil, irritabilidade. Dura alguns dias e melhora sozinho.

## Depressão pós-parto
Persiste por mais de 2 semanas. Sintomas: tristeza intensa, desesperança, dificuldade de vínculo com o bebê, alterações de sono e apetite. Requer tratamento.

## Fatores de risco
Histórico de depressão, depressão na gestação, falta de apoio, parto traumático, dificuldades com a amamentação.

[BOX]
Ação: Se os sintomas persistirem ou piorarem, busque ajuda. O tratamento é eficaz. Você não está sozinha.
[/BOX]

## Conclusão
Reconhecer a diferença entre baby blues e depressão pós-parto permite buscar o apoio adequado. A saúde mental materna importa.`,
    reference: 'OMS. Depressão pós-parto. SBP. Saúde mental materna. ACOG. Postpartum Depression. 2018.',
  },
  {
    id: '18',
    slug: 'autocuidado-mae',
    category: 'emocional',
    title: 'Autocuidado na maternidade',
    excerpt:
      'Por que cuidar de si mesma é essencial para cuidar do bebê.',
    content: `## Introdução
Cuidar de si mesma não é egoísmo. É condição para cuidar bem do outro. A maternidade exige energia física e emocional.

## Por que é difícil
A demanda do bebê é constante. O tempo parece escasso. A culpa pode surgir ao priorizar-se. Mas o cuidado consigo é investimento na família.

## O que fazer
Reserve momentos pequenos: um banho, uma caminhada, uma conversa com amigos. Acepte ajuda. Peça. Divida tarefas.

## Limites
Diga não quando necessário. Estabeleça limites com visitas e com o que você pode fazer. O descanso é essencial.

[BOX]
Frase: "Você não pode dar de um copo vazio." Cuide-se para ter o que oferecer. Pequenos gestos diários fazem diferença.
[/BOX]

## Conclusão
O autocuidado é um ato de amor pela família. Pequenos momentos podem transformar o dia. Você merece.`,
    reference: 'OMS. Saúde mental na maternidade. Ministério da Saúde. Guia de atenção à saúde mental.',
  },
  {
    id: '19',
    slug: 'vinculo-mae-bebe',
    category: 'emocional',
    title: 'Construindo o vínculo mãe-bebê',
    excerpt:
      'Como fortalecer a conexão desde a gestação e nos primeiros meses.',
    content: `## Introdução
O vínculo entre mãe e bebê se constrói ao longo do tempo. Não é instantâneo para todas. É um processo que envolve contato, cuidado e presença.

## Contato pele a pele
O contato pele a pele logo após o nascimento e nos primeiros dias favorece o vínculo, regula a temperatura e o estado emocional do bebê.

## Amamentação
A amamentação é um momento de conexão. O olhar, o toque e a proximidade fortalecem o vínculo. Mas mães que não amamentam também constroem vínculo forte.

## Presença
Estar presente, responder ao choro, acolher. O vínculo se constrói com a repetição de pequenos gestos de cuidado e afeto.

[BOX]
Lembrete: O vínculo pode levar tempo para crescer. Não se culpe se não sentir "amor à primeira vista". O amor se constrói no dia a dia.
[/BOX]

## Conclusão
O vínculo é um processo. Cada dupla mãe-bebê tem seu ritmo. O importante é cuidar e estar presente.`,
    reference: 'OMS. Cuidados do recém-nascido. SBP. Apego e vínculo. 2021.',
  },
  {
    id: '20',
    slug: 'rede-apoio',
    category: 'emocional',
    title: 'Rede de apoio: por que importa',
    excerpt:
      'Construindo e mantendo uma rede de apoio na maternidade.',
    content: `## Introdução
Ninguém precisa ser mãe sozinha. Uma rede de apoio é fundamental para o bem-estar da mãe e da família.

## O que é rede de apoio
São pessoas que podem ajudar: parceiro, família, amigos, vizinhos, profissionais de saúde. Ajuda prática e emocional.

## Tipos de ajuda
Cuidar do bebê para você descansar, preparar refeições, fazer compras, ouvir, acolher. Pequenos gestos fazem diferença.

## Como construir
Peça ajuda de forma específica. "Pode me trazer um almoço?" ou "Pode ficar com o bebê 1 hora?" Aceite ofertas. Não espere que adivinhem.

[BOX]
Dica: Grupos de mães, online ou presenciais, são uma forma de rede. Compartilhar experiências reduz o isolamento e a sensação de solidão.
[/BOX]

## Conclusão
A maternidade é um trabalho coletivo. Construir e manter uma rede de apoio é um investimento na saúde de toda a família.`,
    reference: 'OMS. Suporte social na maternidade. Ministério da Saúde. Rede de apoio à gestante. 2021.',
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

/** Ordem de prioridade para mix diverso de categorias no feed (imagens diferentes) */
const PHASE_CATEGORY_PRIORITY: ArticleCategory[][] = [
  ['gravidez', 'emocional', 'gravidez', 'recem-nascido', 'emocional', 'gravidez', 'recem-nascido'],
  ['recem-nascido', 'emocional', 'recem-nascido', 'emocional', '1-2 anos', 'emocional', 'recem-nascido'],
];

export function getArticlesForPhase(weeks: number, limit = 6): Article[] {
  const isPregnancy = weeks >= 1 && weeks <= 40;
  const categories = isPregnancy
    ? PHASE_CATEGORY_PRIORITY[0]
    : PHASE_CATEGORY_PRIORITY[1];
  const seen = new Set<string>();
  const result: Article[] = [];
  for (const cat of categories) {
    const pool = getArticlesByCategory(cat);
    for (const a of pool) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      result.push(a);
      if (result.length >= limit) break;
    }
    if (result.length >= limit) break;
  }
  while (result.length < limit) {
    const remaining = ARTICLES.filter((a) => !seen.has(a.id));
    if (remaining.length === 0) break;
    const pick = remaining[0];
    seen.add(pick.id);
    result.push(pick);
  }
  return result.slice(0, limit);
}
