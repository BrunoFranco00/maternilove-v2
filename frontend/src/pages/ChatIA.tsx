import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ChatIA() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Oi mamãe! Eu sou o seu bebê (ou quase!). Como posso te ajudar hoje?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Lógica simples de IA com Guardrails
    setTimeout(() => {
      let aiResponseText = "";
      const lowerInput = userMsg.text.toLowerCase();

      // Guardrails de Segurança (Prioridade Máxima)
      if (lowerInput.includes('dor') || lowerInput.includes('sangue') || lowerInput.includes('febre') || lowerInput.includes('remédio') || lowerInput.includes('tomar') || lowerInput.includes('enjoo') || lowerInput.includes('vômito')) {
        aiResponseText = "Mamãe, eu sinto muito que você não esteja bem, mas eu sou apenas um bebê digital e não posso cuidar da sua saúde. Por favor, procure um médico agora mesmo para ver se está tudo bem com a gente! ❤️";
      } 
      // Perguntas comuns
      else if (lowerInput.includes('tamanho') || lowerInput.includes('grande')) {
        aiResponseText = "Hoje eu estou do tamanho de um figo! Estou crescendo rápido, né?";
      }
      else if (lowerInput.includes('comida') || lowerInput.includes('fome') || lowerInput.includes('comer')) {
        aiResponseText = "Lembre-se de comer coisas saudáveis para eu crescer forte! Mas não precisa comer por dois, tá?";
      }
      else if (lowerInput.includes('nome')) {
        aiResponseText = "Ainda não sei meu nome, mas adoro quando você fala comigo!";
      }
      // Resposta Padrão Afetiva
      else {
        aiResponseText = "Adoro ouvir sua voz (mesmo que escrita)! Estou aqui crescendo e ouvindo seu coração.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponseText, sender: 'ai' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 sticky top-0">
        <Link to="/dashboard" className="text-gray-500 font-medium">← Voltar</Link>
        <h1 className="font-bold text-pink-600">Conversa com o Bebê</h1>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm md:text-base ${
              msg.sender === 'user' 
                ? 'bg-pink-500 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2 max-w-2xl mx-auto">
            <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 outline-none focus:border-pink-500 transition shadow-sm"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={e => setInput(e.target.value)}
            />
            <button 
            type="submit" 
            className="bg-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-pink-600 transition shadow-sm"
            disabled={!input.trim()}
            >
            ➤
            </button>
        </form>
        
        <div className="bg-yellow-50 p-2 text-center text-[10px] md:text-xs text-yellow-800 border-t border-yellow-100">
            Esta IA não substitui um médico. Em emergências, procure o hospital.
        </div>
      </div>
    </div>
  );
}
