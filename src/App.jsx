import React, { useState, useEffect } from 'react';
import Parse from './services/back4app';
import { Icons } from './components/Icons';
import PetCard from './components/PetCard';
import Modal from './components/Modal';
import RegisterForm from './components/RegisterForm';
import AdvisorModal from './components/AdvisorModal';

const MOCK_PETS = [{
    id: 1, name: "Paçoca (Teste)", type: "dog", breed: "Vira-lata", age: "2 anos", gender: "Macho", location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1593134257782-e89567577d1a?auto=format&fit=crop&q=80&w=1000",
    description: "Este é um dado de exemplo local.", owner: "Admin", contact: "11999999999", email: "admin@teste.com", vaccinated: true, castrated: true
}];

function App() {
    const [pets, setPets] = useState([]);
    const [donations, setDonations] = useState([]);
    const [adoptions, setAdoptions] = useState([]); 
    const [filteredPets, setFilteredPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [view, setView] = useState('home'); 
    const [adminTab, setAdminTab] = useState('pets'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAdvisor, setShowAdvisor] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [donationForm, setDonationForm] = useState({ name: '', contact: '', items: '' });
    const [isAdmin, setIsAdmin] = useState(false); 
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // Login Fantasma
    useEffect(() => {
        const autenticarInicial = async () => {
            const currentUser = Parse.User.current();
            if (currentUser) {
                const username = currentUser.get("username");
                if (username && !username.startsWith("visitante_")) setIsAdmin(true); 
            } else {
                const user = new Parse.User();
                user.set("username", "visitante_" + Math.random().toString(36).substring(7));
                user.set("password", "senha123");
                try { await user.signUp(); } catch (e) { console.error("Login auto:", e); }
            }
        };
        autenticarInicial();
    }, []);

    // --- BUSCAR DADOS (COM STATUS) ---
    useEffect(() => {
        const fetchData = async () => {
            if (Parse.applicationId && Parse.applicationId !== "SEU_APPLICATION_ID_AQUI") {
                try {
                    // 1. Pets
                    const Pet = Parse.Object.extend("Pet");
                    const qPets = new Parse.Query(Pet);
                    qPets.descending("createdAt");
                    const rPets = await qPets.find();
                    const mappedPets = rPets.map(p => {
                        let img = "https://via.placeholder.com/400";
                        const raw = p.get("image");
                        if (raw) img = raw.url ? raw.url() : (typeof raw === 'string' ? raw : img);
                        return {
                            id: p.id, name: p.get("name"), type: p.get("type"), breed: p.get("breed"),
                            age: p.get("age"), gender: p.get("gender") || "Desconhecido", location: p.get("location"),
                            image: img, description: p.get("description"), owner: p.get("owner"),
                            contact: p.get("contact"), email: p.get("email"), vaccinated: p.get("vaccinated"), castrated: p.get("castrated")
                        };
                    });
                    setPets(mappedPets); setFilteredPets(mappedPets);

                    // 2. Doações
                    const Donation = Parse.Object.extend("Donation");
                    const qDon = new Parse.Query(Donation);
                    qDon.descending("createdAt");
                    const rDon = await qDon.find();
                    setDonations(rDon.map(d => ({ id: d.id, name: d.get("name"), contact: d.get("contact"), items: d.get("items"), date: d.createdAt.toLocaleDateString('pt-BR') })));

                    // 3. Solicitações de Adoção (COM STATUS)
                    const Adoption = Parse.Object.extend("AdoptionRequest");
                    const qAdop = new Parse.Query(Adoption);
                    qAdop.descending("createdAt");
                    const rAdop = await qAdop.find();
                    setAdoptions(rAdop.map(a => ({
                        id: a.id,
                        petName: a.get("petName"),
                        adopterName: a.get("adopterName"),
                        adopterContact: a.get("adopterContact"),
                        status: a.get("status") || "Analisando", // Status padrão
                        date: a.createdAt.toLocaleDateString('pt-BR')
                    })));

                } catch (err) { console.error("Erro Back4App:", err); setPets(MOCK_PETS); }
            } else { setPets(MOCK_PETS); }
            setLoadingInitial(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = pets;
        if (filterType !== 'all') result = result.filter(p => p.type === filterType);
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(t) || p.breed.toLowerCase().includes(t) || p.location.toLowerCase().includes(t));
        }
        setFilteredPets(result);
    }, [pets, searchTerm, filterType]);

    // Salvar Pet
    const handleRegisterPet = async (formData) => {
        setIsSaving(true);
        if (Parse.applicationId && Parse.applicationId !== "SEU_APPLICATION_ID_AQUI") {
            try {
                const Pet = Parse.Object.extend("Pet");
                const newPet = new Pet();
                const acl = new Parse.ACL();
                acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true);
                newPet.setACL(acl);

                newPet.set("name", formData.name); newPet.set("type", formData.type);
                newPet.set("breed", formData.breed); newPet.set("age", formData.age);
                newPet.set("gender", formData.gender); newPet.set("location", formData.location);
                newPet.set("description", formData.description); newPet.set("owner", formData.ownerName);
                newPet.set("contact", formData.contact); newPet.set("email", formData.email);
                newPet.set("vaccinated", formData.vaccinated); newPet.set("castrated", formData.castrated);
                if (formData.file) {
                    const parseFile = new Parse.File("photo.jpg", formData.file);
                    await parseFile.save();
                    newPet.set("image", parseFile);
                }
                await newPet.save();
                alert("Pet cadastrado com sucesso!"); window.location.reload();
            } catch (e) { alert("Erro: " + e.message); setIsSaving(false); }
        } else { alert("Offline."); setIsSaving(false); }
    };

    // Salvar Solicitação (Com status inicial)
    const handleAdoptionRequest = async (pet, adopterData) => {
        setIsSaving(true);
        if (Parse.applicationId && Parse.applicationId !== "SEU_APPLICATION_ID_AQUI") {
            try {
                const Adoption = Parse.Object.extend("AdoptionRequest");
                const req = new Adoption();
                const acl = new Parse.ACL();
                acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true);
                req.setACL(acl);

                req.set("petName", pet.name);
                req.set("petId", pet.id);
                req.set("adopterName", adopterData.name);
                req.set("adopterContact", adopterData.contact);
                req.set("status", "Analisando"); // Define status inicial
                
                await req.save();
                alert("Solicitação enviada! O protetor entrará em contato.");
                setSelectedPet(null);
                setIsSaving(false);
            } catch (e) { alert("Erro: " + e.message); setIsSaving(false); }
        } else { alert("Offline."); setIsSaving(false); }
    };

    // --- NOVA FUNÇÃO: ATUALIZAR STATUS ---
    const handleUpdateStatus = async (id, newStatus) => {
        setIsSaving(true);
        try {
            const Adoption = Parse.Object.extend("AdoptionRequest");
            const query = new Parse.Query(Adoption);
            const obj = await query.get(id);
            obj.set("status", newStatus);
            await obj.save();

            // Atualiza lista local
            const updatedAdoptions = adoptions.map(a => 
                a.id === id ? { ...a, status: newStatus } : a
            );
            setAdoptions(updatedAdoptions);
            setIsSaving(false);
        } catch (e) { alert("Erro ao atualizar: " + e.message); setIsSaving(false); }
    };

    const handleSaveDonation = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try { const D = Parse.Object.extend("Donation"); const d = new D(); 
        const acl = new Parse.ACL(); acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true); d.setACL(acl);
        d.set("name", donationForm.name); d.set("contact", donationForm.contact); d.set("items", donationForm.items);
        await d.save(); alert("Recebido!"); window.location.reload(); } catch(e){alert(e.message); setIsSaving(false);}
    };

    const deleteItem = async (className, id, confirmMsg) => {
        if (!confirm(confirmMsg)) return;
        setIsSaving(true);
        try {
            const Obj = Parse.Object.extend(className);
            const q = new Parse.Query(Obj);
            const o = await q.get(id);
            await o.destroy();
            
            // Atualizar listas locais
            if(className === "Pet") setPets(pets.filter(p => p.id !== id));
            if(className === "Donation") setDonations(donations.filter(d => d.id !== id));
            if(className === "AdoptionRequest") setAdoptions(adoptions.filter(a => a.id !== id));
            
            setIsSaving(false);
        } catch (e) { alert(e.message); setIsSaving(false); }
    };

    const handleDeletePet = async (petId) => { deleteItem("Pet", petId, "Excluir Pet?"); };
    const handleDeleteDonation = async (id) => { deleteItem("Donation", id, "Concluir doação?"); };
    const handleDeleteAdoption = async (id) => { deleteItem("AdoptionRequest", id, "Arquivar solicitação?"); };

    const handleAdminLogin = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try { await Parse.User.logIn(loginData.username, loginData.password); setIsAdmin(true); setIsSaving(false); }
        catch(e){alert(e.message); setIsSaving(false);}
    };
    const handleLogout = async () => { await Parse.User.logOut(); window.location.reload(); }

    if (loadingInitial) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Icons.Loader className="w-10 h-10 animate-spin text-indigo-600" /></div>;
    if (isSaving) return <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm"><Icons.Loader className="w-12 h-12 animate-spin mb-4" /><h2 className="text-2xl font-bold">Processando...</h2></div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}><div className="bg-indigo-600 p-2 rounded-lg"><Icons.Dog className="w-6 h-6 text-white" /></div><span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">EncontreUmAmigo</span></div>
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => setView('home')} className={`text-sm font-medium ${view === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}>Início</button>
                        <button onClick={() => setView('donate')} className={`text-sm font-medium ${view === 'donate' ? 'text-indigo-600' : 'text-gray-500'}`}>Doações</button>
                        <button onClick={() => setView('admin')} className={`text-sm font-medium ${view === 'admin' ? 'text-indigo-600' : 'text-gray-500'}`}>Gerenciar</button>
                        <button onClick={() => setShowAdvisor(true)} className="text-sm font-medium text-indigo-600 flex gap-1 items-center bg-indigo-50 px-3 py-1.5 rounded-full"><Icons.Sparkles className="w-3 h-3" /> IA</button>
                        <button onClick={() => setView('register')} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2"><Icons.PlusCircle className="w-4 h-4" /> Quero Doar</button>
                    </div>
                    <div className="md:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2"><Icons.Menu className="w-6 h-6" /></button></div>
                </div>
                {mobileMenuOpen && (<div className="md:hidden bg-white border-t"><div className="p-2 space-y-1"><button onClick={() => setView('home')} className="block w-full text-left p-2">Início</button><button onClick={() => setView('donate')} className="block w-full text-left p-2">Doações</button><button onClick={() => setView('admin')} className="block w-full text-left p-2">Gerenciar</button></div></div>)}
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {view === 'home' && (
                    <>
                        <div className="relative rounded-3xl overflow-hidden bg-indigo-600 text-white mb-10 shadow-xl">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
                            <div className="relative z-10 px-8 py-16 md:py-20 text-center md:text-left md:flex md:items-center md:justify-between">
                                <div className="md:max-w-xl"><h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">Não compre, <br/><span className="text-indigo-200">adote um amigo.</span></h1><p className="text-lg text-indigo-100 mb-8 font-light">Milhares de cães e gatos estão esperando por um lar amoroso. Encontre o seu companheiro perfeito hoje mesmo.</p><div className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-md w-full"><Icons.Search className="w-5 h-5 text-gray-400 ml-3" /><input type="text" placeholder="Busque por raça, nome ou cidade..." className="flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-6"><button onClick={() => setFilterType('all')} className="px-4 py-1 bg-gray-200 rounded-full text-sm">Todos</button><button onClick={() => setFilterType('dog')} className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Cães</button><button onClick={() => setFilterType('cat')} className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Gatos</button></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{filteredPets.map(pet => <PetCard key={pet.id} pet={pet} onClick={setSelectedPet} />)}</div>
                    </>
                )}

                {view === 'donate' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Ajude a Manter o Projeto ❤️</h2>
                            <p className="text-gray-600">Sua ajuda salva vidas. Doe qualquer valor ou traga itens para nossos pontos de coleta.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4"><div className="bg-green-100 p-2 rounded-full"><Icons.Heart className="w-6 h-6 text-green-600" /></div><h3 className="text-xl font-bold text-gray-800">Doação via PIX</h3></div>
                                    <p className="text-sm text-gray-500 mb-4">Todo valor é usado para compra de ração e remédios.</p>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chave PIX (Email)</p><p className="text-lg font-mono font-bold text-gray-800 select-all">pix@encontreumamigo.org</p><p className="text-xs text-gray-400 mt-1">Banco Fictício S.A.</p></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4"><div className="bg-blue-100 p-2 rounded-full"><Icons.MapPin className="w-6 h-6 text-blue-600" /></div><h3 className="text-xl font-bold text-gray-800">Ponto de Coleta</h3></div>
                                    <p className="text-gray-600 mb-4 text-sm">Recebemos ração, caminhas, brinquedos e remédios.</p>
                                    <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg"><Icons.MapPin className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" /><div><p className="font-bold text-gray-900">Central de Adoção</p><p>Rua dos Animais Felizes, 123</p><p>Centro - Sua Cidade, UF</p><p className="text-xs text-gray-400 mt-1">Seg a Sex: 08h às 18h</p></div></div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit">
                                <div className="flex items-center gap-2 mb-6"><Icons.Sparkles className="w-5 h-5 text-yellow-500" /><h3 className="text-xl font-bold text-gray-800">Quero doar itens</h3></div>
                                <form onSubmit={handleSaveDonation} className="space-y-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: João da Silva" value={donationForm.name} onChange={(e) => setDonationForm({...donationForm, name: e.target.value})} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Seu WhatsApp</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="(00) 00000-0000" value={donationForm.contact} onChange={(e) => setDonationForm({...donationForm, contact: e.target.value})} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">O que deseja doar?</label><textarea required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: 10kg de ração de gato, 2 caminhas usadas..." value={donationForm.items} onChange={(e) => setDonationForm({...donationForm, items: e.target.value})}></textarea></div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg flex justify-center items-center gap-2"><Icons.CheckCircle className="w-5 h-5" /> Enviar Intenção de Doação</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'admin' && (
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        {!isAdmin ? (
                            <div className="p-12 text-center max-w-md mx-auto"><h2 className="text-2xl font-bold mb-4">Admin Login</h2><form onSubmit={handleAdminLogin} className="space-y-4"><input placeholder="Usuário" className="w-full border p-3 rounded" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} /><input type="password" placeholder="Senha" className="w-full border p-3 rounded" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} /><button className="w-full bg-indigo-600 text-white p-3 rounded font-bold">Entrar</button></form></div>
                        ) : (
                            <>
                                <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <button onClick={() => setAdminTab('pets')} className={`px-4 py-2 rounded-lg text-sm font-bold ${adminTab === 'pets' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Pets</button>
                                        <button onClick={() => setAdminTab('donations')} className={`px-4 py-2 rounded-lg text-sm font-bold ${adminTab === 'donations' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Doações</button>
                                        <button onClick={() => setAdminTab('adoptions')} className={`px-4 py-2 rounded-lg text-sm font-bold ${adminTab === 'adoptions' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Solicitações</button>
                                    </div>
                                    <button onClick={handleLogout} className="text-red-500 text-sm underline">Sair</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-white border-b"><tr><th className="p-4">Item</th><th className="p-4">Status</th><th className="p-4 text-right">Ações</th></tr></thead>
                                        <tbody>
                                            {adminTab === 'pets' && pets.map(p => <tr key={p.id} className="hover:bg-gray-50"><td className="p-4 font-bold">{p.name}</td><td className="p-4 text-sm">{p.location}</td><td className="p-4 text-right"><button onClick={() => handleDeletePet(p.id)} className="text-red-500"><Icons.Trash className="w-5 h-5" /></button></td></tr>)}
                                            {adminTab === 'donations' && donations.map(d => <tr key={d.id} className="hover:bg-gray-50"><td className="p-4 font-bold">{d.name}</td><td className="p-4 text-sm">{d.items}</td><td className="p-4 text-right"><button onClick={() => handleDeleteDonation(d.id)} className="text-green-600"><Icons.CheckCircle className="w-5 h-5" /></button></td></tr>)}
                                            
                                            {/* --- TABELA DE SOLICITAÇÕES COM STATUS --- */}
                                            {adminTab === 'adoptions' && adoptions.map(a => (
                                                <tr key={a.id} className="hover:bg-gray-50">
                                                    <td className="p-4">
                                                        <span className="font-bold text-indigo-600 block">{a.petName}</span>
                                                        <span className="text-xs text-gray-500">{a.adopterName} - {a.adopterContact}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        {/* SELETOR DE STATUS */}
                                                        <select 
                                                            value={a.status} 
                                                            onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                                                            className={`text-xs font-bold px-2 py-1 rounded border outline-none ${
                                                                a.status === 'Aprovado' ? 'bg-green-100 text-green-700 border-green-200' :
                                                                a.status === 'Reprovado' ? 'bg-red-100 text-red-700 border-red-200' :
                                                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                            }`}
                                                        >
                                                            <option value="Analisando">Analisando ⏳</option>
                                                            <option value="Aprovado">Aprovado ✅</option>
                                                            <option value="Reprovado">Reprovado ❌</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => handleDeleteAdoption(a.id)} className="text-gray-400 hover:text-red-500 p-2" title="Excluir"><Icons.Trash className="w-5 h-5" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {view === 'register' && <RegisterForm onCancel={() => setView('home')} onSubmit={handleRegisterPet} />}
            </main>
            {selectedPet && <Modal pet={selectedPet} onClose={() => setSelectedPet(null)} onAdopt={handleAdoptionRequest} />}
            {showAdvisor && <AdvisorModal onClose={() => setShowAdvisor(false)} />}
        </div>
    );
}

export default App;