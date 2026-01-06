import { Link } from 'react-router-dom';

export default function Lives() {
  const lives = [
    { id: 1, title: "Tudo sobre Amamentação", date: "Quinta, 19:00", expert: "Dra. Ana (Pediatra)", status: "upcoming" },
    { id: 2, title: "Sono do Bebê: Mitos e Verdades", date: "Gravado em 10/05", expert: "Consultora Maria", status: "recorded" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="text-gray-500 mr-4 font-medium">← Voltar</Link>
          <h1 className="text-xl font-bold text-gray-800">Lives com Especialistas</h1>
        </div>

        <div className="space-y-4">
          {lives.map(live => (
            <div key={live.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-32 bg-gray-200 flex items-center justify-center relative">
                <span className="text-4xl">🎥</span>
                {live.status === 'upcoming' && (
                  <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider animate-pulse">
                    Em breve
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{live.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{live.expert}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📅</span>
                  {live.date}
                </div>
                <button className="w-full mt-4 border border-pink-500 text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-50 transition">
                  {live.status === 'upcoming' ? 'Definir Lembrete' : 'Assistir Gravação'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-lg text-center text-sm text-blue-800 border border-blue-100">
            <p className="font-semibold mb-1">💡 Você sabia?</p>
            As lives são pautadas nas dúvidas mais comuns enviadas por vocês para a nossa IA! ❤️
        </div>
      </div>
    </div>
  );
}
