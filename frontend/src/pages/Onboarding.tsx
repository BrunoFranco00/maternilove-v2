import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'pregnant', // pregnant or mother
    date: '',
    acceptedTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) return;
    
    // Salvar no localStorage para persistencia simples no MVP
    localStorage.setItem('maternilove_user', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">Bem-vinda ao MaterniLove</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Como gostaria de ser chamada?</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded focus:border-pink-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Qual seu momento atual?</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:border-pink-500 outline-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="pregnant">Estou grávida</option>
              <option value="mother">Já sou mãe (criança até 5 anos)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              {formData.type === 'pregnant' ? 'Data prevista do parto' : 'Data de nascimento da criança'}
            </label>
            <input
              type="date"
              required
              className="w-full p-2 border border-gray-300 rounded focus:border-pink-500 outline-none"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="flex items-start gap-2 pt-4 bg-yellow-50 p-4 rounded border border-yellow-100">
            <input
              type="checkbox"
              required
              id="terms"
              className="mt-1"
              checked={formData.acceptedTerms}
              onChange={e => setFormData({...formData, acceptedTerms: e.target.checked})}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Declaro estar ciente de que o MaterniLove é uma ferramenta de apoio e <strong>NÃO substitui consultas médicas, diagnósticos ou prescrições</strong>. Em caso de dúvidas de saúde ou sintomas, procurarei um profissional.
            </label>
          </div>

          <button
            type="submit"
            disabled={!formData.acceptedTerms}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Concordar e Começar
          </button>
        </form>
      </div>
    </div>
  );
}
