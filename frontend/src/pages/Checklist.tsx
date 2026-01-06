import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Checklist() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('maternilove_checklist');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, text: "Beber 2L de água", done: false },
      { id: 2, text: "Tomar vitamina pré-natal", done: false }, // Mudei para false para user interagir
      { id: 3, text: "Caminhada leve de 15min", done: false },
      { id: 4, text: "Ler 5 páginas de um livro", done: false },
      { id: 5, text: "Fazer exercícios de respiração", done: false },
    ];
  });

  const toggleTask = (id: number) => {
    const newTasks = tasks.map((t: any) => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    localStorage.setItem('maternilove_checklist', JSON.stringify(newTasks));
  };

  const progress = Math.round((tasks.filter((t: any) => t.done).length / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="text-gray-500 mr-4 font-medium">← Voltar</Link>
          <h1 className="text-xl font-bold text-gray-800">Checklist do Dia</h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-600 font-medium">Progresso</span>
            <span className="text-pink-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task: any) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 cursor-pointer transition border ${task.done ? 'border-green-200 bg-green-50/30' : 'border-transparent hover:border-pink-200'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                {task.done && '✓'}
              </div>
              <span className={`text-lg ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="mt-8 text-center animate-fade-in-up">
            <span className="text-4xl">🎉</span>
            <p className="text-pink-600 font-bold mt-2">Parabéns mamãe! Tudo feito por hoje!</p>
          </div>
        )}
      </div>
    </div>
  );
}
