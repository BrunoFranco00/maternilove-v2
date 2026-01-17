export default function ReliefPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-600">
            Encontre Alívio
          </h1>
          <p className="text-gray-600">
            Recursos para ajudar você a se sentir melhor
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'Meditação', icon: '🧘', description: 'Exercícios de respiração e relaxamento' },
            { title: 'Música Relaxante', icon: '🎵', description: 'Playlists para acalmar e tranquilizar' },
            { title: 'Exercícios Físicos', icon: '💪', description: 'Atividades suaves para gestantes' },
            { title: 'Comunidade', icon: '👥', description: 'Conecte-se com outras mães' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
