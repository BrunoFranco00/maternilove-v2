import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DailyLog() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const moods = [
    { emoji: '😄', label: 'Feliz' },
    { emoji: '🥰', label: 'Amada' },
    { emoji: '😴', label: 'Cansada' },
    { emoji: '🤢', label: 'Enjoada' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '😡', label: 'Irritada' },
  ];

  const handleSave = () => {
    // Mock save
    // Em um app real, enviaria para o backend
    alert('Registro salvo com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="text-gray-500 mr-4 font-medium">← Voltar</Link>
          <h1 className="text-xl font-bold text-gray-800">Diário</h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Como você se sentiu hoje?</h2>
            <div className="grid grid-cols-3 gap-3 sm:flex sm:justify-between">
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex flex-col items-center p-3 rounded-xl transition border ${mood === m.label ? 'bg-pink-50 border-pink-500 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <span className="text-3xl mb-1">{m.emoji}</span>
                  <span className="text-xs text-gray-600 font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Alguma observação?</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-pink-500 h-32 resize-none"
              placeholder="Hoje eu senti um leve enjoo pela manhã, mas depois melhorei..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!mood}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Registro
          </button>
        </div>
      </div>
    </div>
  );
}
