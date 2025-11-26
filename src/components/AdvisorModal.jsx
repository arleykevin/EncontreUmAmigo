import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { callGemini } from '../services/gemini';

const AdvisorModal = ({ onClose }) => {
    const [messages, setMessages] = useState([{ role: 'assistant', text: 'Olá! Sou a IA do EncontreUmAmigo. 🐾 Me conte como é sua rotina e onde você mora, e eu ajudarei a encontrar o pet ideal para você!' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        const systemPrompt = "Você é um consultor de adoção de animais experiente e amigável. Recomende animais com base no estilo de vida do usuário. Seja conciso.";
        const chatHistory = messages.map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.text}`).join('\n');
        const fullPrompt = `${chatHistory}\nUsuário: ${input}\nAssistente:`;
        const responseText = await callGemini(fullPrompt, systemPrompt);
        setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in flex flex-col h-[600px]">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2"><Icons.Sparkles className="w-5 h-5 text-yellow-300" /><h3 className="font-bold">Conselheiro Virtual</h3></div>
            <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-full"><Icons.X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4" ref={scrollRef}>
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>{msg.text}</div>
                </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2"><Icons.Loader className="w-4 h-4 animate-spin text-indigo-600" /><span className="text-xs text-gray-500">Digitando...</span></div></div>}
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
                <input type="text" className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Ex: Moro em apê pequeno..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full disabled:opacity-50 transition-colors"><Icons.Send className="w-5 h-5" /></button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default AdvisorModal;