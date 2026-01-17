export default function CheckInPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-600">
            Como você está hoje?
          </h1>
          <p className="text-gray-600">
            Compartilhe seus sentimentos e emoções
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Selecione suas emoções
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['😊', '😢', '😴', '😰', '😌', '😔', '😄', '😟'].map((emoji, index) => (
                <button
                  key={index}
                  className="p-4 text-3xl border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Como você está se sentindo?
            </label>
            <textarea
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none resize-none"
              rows={4}
              placeholder="Descreva seus sentimentos..."
            />
          </div>

          <button className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
