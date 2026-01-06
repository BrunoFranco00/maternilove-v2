import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('maternilove_user');
    if (!storedUser) {
      navigate('/onboarding');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  // Mock de dados baseados no dia (para MVP)
  const iaMessage = user.type === 'pregnant' 
    ? "Bom dia, mamãe! Hoje eu estou do tamanho de um figo. Meus dedinhos estão começando a se separar."
    : "Oi mamãe! Hoje vamos brincar de esconde-esconde? Isso ajuda no meu desenvolvimento cognitivo!";
    
  const checklistPreview = [
    { id: 1, text: "Beber 2L de água", done: false },
    { id: 2, text: user.type === 'pregnant' ? "Tomar vitamina pré-natal" : "Hora da soneca da tarde", done: true },
    { id: 3, text: "Caminhada leve de 15min", done: false },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      {/* Header do Dia */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg text-center relative overflow-hidden">
        <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl border-2 border-white/30">
            👶
            </div>
            <h2 className="text-xl font-bold mb-2">Painel do Dia</h2>
            <p className="italic text-lg font-medium">"{iaMessage}"</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/chat" className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 flex flex-col items-center text-center hover:shadow-md transition active:scale-95">
          <span className="text-3xl mb-2">💬</span>
          <span className="font-semibold text-pink-600">Falar com o bebê</span>
        </Link>
        <Link to="/checklist" className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 flex flex-col items-center text-center hover:shadow-md transition active:scale-95">
          <span className="text-3xl mb-2">✅</span>
          <span className="font-semibold text-pink-600">Checklist do Dia</span>
        </Link>
      </div>

      {/* Resumo Checklist */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
          Sua Rotina Hoje
          <Link to="/checklist" className="text-sm text-pink-500 font-semibold">Ver tudo</Link>
        </h3>
        <ul className="space-y-3">
          {checklistPreview.map(item => (
            <li key={item.id} className="flex items-center gap-3 text-gray-600">
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-100 border-green-500 text-green-600' : 'border-gray-300'}`}>
                {item.done && '✓'}
              </span>
              <span className={item.done ? 'line-through opacity-50' : ''}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Conteúdo do Dia */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
                <h3 className="font-bold text-blue-800 mb-1">Dica do Dia</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                A hidratação é fundamental para o aumento do volume sanguíneo. Mantenha sua garrafinha sempre perto!
                </p>
            </div>
        </div>
      </div>
      
      <div className="text-center pt-4">
        <Link to="/daily-log" className="text-pink-600 font-semibold text-sm hover:underline">
            Como você está se sentindo hoje? Registrar ›
        </Link>
      </div>
    </div>
  );
}
