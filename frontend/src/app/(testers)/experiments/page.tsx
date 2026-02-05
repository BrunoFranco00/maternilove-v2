export const dynamic = "force-dynamic";

export default function ExperimentsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Experimentos
          </h1>
          <p className="text-gray-600">
            Área exclusiva para testadores
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Experimentos Ativos</h3>
          <div className="space-y-3">
            <div className="p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Experimento A</h4>
                  <p className="text-sm text-gray-600">Descrição do experimento</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
