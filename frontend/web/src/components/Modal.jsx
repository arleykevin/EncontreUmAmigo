import React, { useState } from 'react';
import { Icons } from './Icons';
import Badge from './Badge';

const Modal = ({ pet, onClose, onAdopt }) => {
    const [showForm, setShowForm] = useState(false);
    const [adopterData, setAdopterData] = useState({ name: '', contact: '' });

    if (!pet) return null;

    const handleSubmitAdoption = (e) => {
        e.preventDefault();
        onAdopt(pet, adopterData);
    };

    const openWhatsApp = () => {
        if (!pet.contact) { alert("Sem número cadastrado."); return; }
        const cleanNumber = pet.contact.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanNumber}?text=Olá, vi o ${pet.name} no EncontreUmAmigo!`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in relative">
                <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white z-10"><Icons.X className="w-6 h-6 text-gray-700" /></button>
                
                <div className="flex flex-col md:flex-row h-full">
                    {/* FOTO (Esquerda) */}
                    <div className="md:w-1/2 h-64 md:h-auto relative">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover"/>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h2 className="text-3xl font-bold text-white">{pet.name}</h2>
                            <p className="text-white/90 flex items-center gap-1"><Icons.MapPin className="w-4 h-4" /> {pet.location}</p>
                        </div>
                    </div>
                    
                    {/* CONTEÚDO (Direita) */}
                    <div className="md:w-1/2 p-6 flex flex-col">
                        {!showForm ? (
                            // --- VISUALIZAÇÃO NORMAL ---
                            <>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge color="purple">{pet.breed}</Badge>
                                    <Badge color="blue">{pet.age}</Badge>
                                    <Badge color="orange">{pet.gender}</Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre</h3>
                                <p className="text-gray-600 mb-6 text-sm">{pet.description}</p>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-700"><Icons.CheckCircle className={`w-4 h-4 ${pet.vaccinated ? 'text-green-500' : 'text-gray-300'}`} /> Vacinado</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700"><Icons.CheckCircle className={`w-4 h-4 ${pet.castrated ? 'text-green-500' : 'text-gray-300'}`} /> Castrado</div>
                                </div>
                                
                                <div className="mt-auto space-y-3">
                                    <button 
                                        onClick={() => setShowForm(true)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2"
                                    >
                                        <Icons.Heart className="w-5 h-5" /> QUERO ADOTAR
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={openWhatsApp} className="flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg font-medium text-sm transition-colors"><Icons.Phone className="w-4 h-4" /> WhatsApp</button>
                                        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-lg font-medium text-sm transition-colors"><Icons.Mail className="w-4 h-4" /> Email</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // --- FORMULÁRIO DE ADOÇÃO ---
                            <div className="animate-fade-in h-full flex flex-col">
                                <h3 className="text-xl font-bold text-indigo-600 mb-1">Oba! 🎉</h3>
                                <p className="text-sm text-gray-500 mb-6">Deixe seus dados para o dono entrar em contato.</p>
                                <form onSubmit={handleSubmitAdoption} className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                                        <input required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={adopterData.name} onChange={e => setAdopterData({...adopterData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Seu WhatsApp</label>
                                        <input required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="(XX) XXXXX-XXXX" value={adopterData.contact} onChange={e => setAdopterData({...adopterData, contact: e.target.value})} />
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-indigo-700">ENVIAR SOLICITAÇÃO</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="w-full mt-2 text-gray-500 text-sm hover:underline">Voltar</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;