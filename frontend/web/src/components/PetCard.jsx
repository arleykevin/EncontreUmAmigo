import React from 'react';
import { Icons } from './Icons';
import Badge from './Badge';

const PetCard = ({ pet, onClick }) => {
    return (
        <div 
        onClick={() => onClick(pet)}
        className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 transform hover:-translate-y-1 ${pet.isAdopted ? 'opacity-75 grayscale-[0.5]' : ''}`}
        >
        <div className="relative h-56 overflow-hidden">
            <img 
            src={pet.image} 
            alt={pet.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* --- LÓGICA DO SELO DE STATUS --- */}
            {pet.isAdopted ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <span className="text-white font-bold text-2xl border-4 border-white px-6 py-2 rounded-lg transform -rotate-12 tracking-wider">
                        ADOTADO ❤️
                    </span>
                </div>
            ) : (
                <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Disponível
                </div>
            )}

            {!pet.isAdopted && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-rose-500 z-10">
                    <Icons.Heart className="w-5 h-5" />
                </div>
            )}

            <div className="absolute bottom-3 left-3 z-10">
                <Badge color={pet.type === 'dog' ? 'blue' : 'orange'}>
                    {pet.type === 'dog' ? 'Cão' : 'Gato'}
                </Badge>
            </div>
        </div>
        
        <div className="p-5">
            <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{pet.age}</span>
            </div>
            
            <p className="text-sm text-gray-500 font-medium mb-3">{pet.breed}</p>
            
            <div className="flex items-center text-gray-500 text-sm gap-1 mt-auto">
            <Icons.MapPin className="w-4 h-4 text-indigo-500" />
            {pet.location}
            </div>
        </div>
        </div>
    );
};

export default PetCard;