import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { callGemini } from '../services/gemini';

const RegisterForm = ({ onCancel, onSubmit }) => {
    const [formData, setFormData] = useState({ 
        name: '', type: 'dog', breed: '', age: '', location: '', description: '', 
        file: null, vaccinated: false, castrated: false,
        ownerName: '', contact: '', email: '', gender: 'Macho' // <--- NOVOS CAMPOS
    });
    const [preview, setPreview] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

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
        onSubmit(formData);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Cadastrar um Amigo</h2>
                <p className="text-gray-600">Preencha os dados abaixo para divulgar a adoção.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* DADOS DO DOADOR */}
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                    <h3 className="text-sm font-bold text-indigo-800 uppercase mb-3 flex items-center gap-2">
                        <Icons.CheckCircle className="w-4 h-4" /> Seus Dados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Ex: Maria Silva"
                                value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Ex: 11999998888"
                                value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
                            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Ex: maria@email.com"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                {/* DADOS DO PET */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 flex justify-center mb-4">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <div onClick={() => fileInputRef.current.click()} className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all cursor-pointer overflow-hidden relative">
                            {preview ? <img src={preview} alt="Prévia" className="w-full h-full object-cover" /> : <div className="text-center"><Icons.Camera className="w-8 h-8 mx-auto mb-1" /><span className="text-xs">Foto do Pet</span></div>}
                        </div>
                    </div>

                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pet</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    
                    {/* CAMPO GÊNERO NOVO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </select>
                    </div>

                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}><option value="dog">Cão</option><option value="cat">Gato</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Raça</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Idade</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} /></div>
                    <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Localização</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
                    
                    <div className="col-span-2 flex gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50 flex-1">
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" checked={formData.vaccinated} onChange={(e) => setFormData({...formData, vaccinated: e.target.checked})} />
                            <span className="text-gray-700 font-medium">Vacinado? 💉</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50 flex-1">
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" checked={formData.castrated} onChange={(e) => setFormData({...formData, castrated: e.target.checked})} />
                            <span className="text-gray-700 font-medium">Castrado? ✂️</span>
                        </label>
                    </div>

                    <div className="col-span-2"><div className="flex justify-between items-center mb-1"><label className="block text-sm font-medium text-gray-700">Descrição</label><button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-xs flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-50 transition-colors">{isGenerating ? <Icons.Loader className="w-3 h-3 animate-spin" /> : <Icons.Sparkles className="w-3 h-3" />} Gerar com IA</button></div><textarea required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea></div>
                </div>
                <div className="flex gap-4 pt-4"><button type="button" onClick={onCancel} className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancelar</button><button type="submit" className="flex-1 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md">Cadastrar Pet</button></div>
            </form>
        </div>
    );
};

export default RegisterForm;