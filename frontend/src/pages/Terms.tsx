import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        <Link to="/dashboard" className="text-gray-500 mb-6 block font-medium">← Voltar</Link>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Termos e Limites de Uso</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h2 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                ⚠️ 1. ISENÇÃO MÉDICA
            </h2>
            <p>O MaterniLove é uma ferramenta de apoio informativo e emocional. <strong>NENHUMA</strong> informação fornecida pela IA ou pelos conteúdos substitui uma consulta médica presencial.</p>
          </section>
          
          <section>
            <h2 className="font-bold text-pink-600 mb-2">2. Sem Diagnósticos</h2>
            <p>Nossa IA não tem capacidade técnica nem legal para diagnosticar doenças, interpretar exames ou receitar medicamentos.</p>
          </section>

          <section>
            <h2 className="font-bold text-pink-600 mb-2">3. Uso da IA</h2>
            <p>A Inteligência Artificial simula uma persona afetiva ("bebê") apenas para fins de acolhimento. Ela não é um ser senciente e suas respostas são geradas baseadas em padrões.</p>
          </section>

          <section>
            <h2 className="font-bold text-pink-600 mb-2">4. Emergências</h2>
            <p>Em caso de dor, sangramento, febre, queda de movimentação fetal ou qualquer sintoma preocupante, dirija-se imediatamente a um pronto-socorro ou contate seu médico.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
