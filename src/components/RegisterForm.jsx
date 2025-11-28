import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { callGemini } from '../services/gemini';

const RegisterForm = ({ onCancel, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ 
        name: '', type: 'dog', breed: '', age: '', location: '', description: '', 
        file: null, vaccinated: false, castrated: false,
        ownerName: '', contact: '', email: '', gender: 'Macho'
    });
    const [preview, setPreview] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, file: null });
            setPreview(initialData.image);
        }
    }, [initialData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.breed) { alert("Preencha Nome e Raça."); return; }
        setIsGenerating(true);
        const prompt = `Bio curta (max 3 linhas) para adoção de ${formData.type} (${formData.gender}) chamado ${formData.name}, raça ${formData.breed}. Tom amoroso.`;
        const generatedText = await callGemini(prompt);
        setFormData(prev => ({ ...prev, description: generatedText }));
        setIsGenerating(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);
    };

    return (
        // MUDANÇA 1: p-4 no mobile, p-8 no PC. w-full para garantir largura.
        <div className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    {initialData ? 'Editar Pet' : 'Cadastrar um Amigo'}
                </h2>
                <p className="text-sm md:text-base text-gray-600">Ajude um animalzinho a encontrar um lar.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* MUDANÇA 2: gap menor no mobile (gap-4) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* CÂMERA */}
                    <div className="col-span-1 md:col-span-2 flex justify-center mb-2">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <div onClick={() => fileInputRef.current.click()} className="w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all cursor-pointer overflow-hidden relative">
                            {preview ? <img src={preview} alt="Prévia" className="w-full h-full object-cover" /> : <div className="text-center"><Icons.Camera className="w-8 h-8 mx-auto mb-1" /><span className="text-xs">Foto</span></div>}
                        </div>
                    </div>

                    {/* CAMPOS COM FUNDO FORÇADO PARA BRANCO/CINZA CLARO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pet</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                        <select className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                            <option value="dog">Cão</option>
                            <option value="cat">Gato</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none" placeholder="Cidade, UF" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                    </div>
                    
                    {/* CHECKBOXES AJUSTADOS PARA NÃO QUEBRAR LINHA */}
                    <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 bg-gray-50 rounded-lg w-full">
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={formData.vaccinated} onChange={(e) => setFormData({...formData, vaccinated: e.target.checked})} />
                            <span className="text-gray-700 font-medium">Vacinado? 💉</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 bg-gray-50 rounded-lg w-full">
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={formData.castrated} onChange={(e) => setFormData({...formData, castrated: e.target.checked})} />
                            <span className="text-gray-700 font-medium">Castrado? ✂️</span>
                        </label>
                    </div>

                    {/* SEÇÃO DE CONTATO RESPONSIVO */}
                    <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-600 mb-3 uppercase">Seus Dados</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div><input required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="Seu Nome" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} /></div>
                            <div><input required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="WhatsApp (00) 00000-0000" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} /></div>
                            <div><input type="email" className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="Email (Opcional)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                
                        </div>
                        <textarea required rows="3" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                </div>
                
                <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
                    <button type="button" onClick={onCancel} className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md">
                        {initialData ? 'Salvar Alterações' : 'Cadastrar Pet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;