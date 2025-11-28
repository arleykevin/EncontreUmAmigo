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
    const [messages, setMessages] = useState([]); 
    const [volunteers, setVolunteers] = useState([]); 
    
    const [filteredPets, setFilteredPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [editingPet, setEditingPet] = useState(null);
    
    const [view, setView] = useState('home'); 
    const [adminTab, setAdminTab] = useState('pets'); 
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAdvisor, setShowAdvisor] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [donationForm, setDonationForm] = useState({ name: '', contact: '', items: '' });
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [volunteerForm, setVolunteerForm] = useState({ name: '', contact: '', availability: '', interests: '' }); 

    const [isAdmin, setIsAdmin] = useState(false); 
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // --- FUNÇÃO CENTRAL PARA RECARREGAR DADOS SEM SAIR DA TELA ---
    const loadAllData = async () => {
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
                        image: img, description: p.get("description"), owner: p.get("owner") || p.get("ownerName"),
                        contact: p.get("contact"), email: p.get("email"), vaccinated: p.get("vaccinated"), castrated: p.get("castrated"),
                        isAdopted: p.get("isAdopted") || false,
                        ownerName: p.get("owner")
                    };
                });
                mappedPets.sort((a, b) => (a.isAdopted === b.isAdopted) ? 0 : a.isAdopted ? 1 : -1);
                setPets(mappedPets); setFilteredPets(mappedPets);

                // 2. Doações
                const Donation = Parse.Object.extend("Donation");
                const qDon = new Parse.Query(Donation);
                qDon.descending("createdAt");
                const rDon = await qDon.find();
                setDonations(rDon.map(d => ({ id: d.id, name: d.get("name"), contact: d.get("contact"), items: d.get("items"), date: d.createdAt.toLocaleDateString('pt-BR') })));

                // 3. Solicitações
                const Adoption = Parse.Object.extend("AdoptionRequest");
                const qAdop = new Parse.Query(Adoption);
                qAdop.descending("createdAt");
                const rAdop = await qAdop.find();
                setAdoptions(rAdop.map(a => ({
                    id: a.id, petName: a.get("petName"), adopterName: a.get("adopterName"),
                    adopterContact: a.get("adopterContact"), status: a.get("status") || "Analisando",
                    date: a.createdAt.toLocaleDateString('pt-BR')
                })));

                // 4. Mensagens
                const Contact = Parse.Object.extend("ContactMessage");
                const qMsg = new Parse.Query(Contact);
                qMsg.descending("createdAt");
                const rMsg = await qMsg.find();
                setMessages(rMsg.map(m => ({
                    id: m.id, name: m.get("name"), email: m.get("email"), 
                    subject: m.get("subject"), message: m.get("message"),
                    date: m.createdAt.toLocaleDateString('pt-BR')
                })));

                // 5. Voluntários
                const Volunteer = Parse.Object.extend("Volunteer");
                const qVol = new Parse.Query(Volunteer);
                qVol.descending("createdAt");
                const rVol = await qVol.find();
                setVolunteers(rVol.map(v => ({
                    id: v.id, name: v.get("name"), contact: v.get("contact"), 
                    availability: v.get("availability"), interests: v.get("interests"),
                    date: v.createdAt.toLocaleDateString('pt-BR')
                })));

            } catch (err) { console.error("Erro Back4App:", err); setPets(MOCK_PETS); }
        } else { setPets(MOCK_PETS); }
        setLoadingInitial(false);
    };

    // Inicialização
    useEffect(() => {
        const init = async () => {
            // Login Fantasma
            const currentUser = Parse.User.current();
            if (currentUser) {
                const username = currentUser.get("username");
                if (username && !username.startsWith("visitante_")) setIsAdmin(true); 
            } else {
                const user = new Parse.User();
                user.set("username", "visitante_" + Math.random().toString(36).substring(7));
                user.set("password", "senha123");
                try { await user.signUp(); } catch (e) { console.error("Erro ghost:", e); }
            }
            // Carrega dados
            await loadAllData();
        };
        init();
    }, []);

    // Filtros
    useEffect(() => {
        let result = pets;
        if (filterType !== 'all') result = result.filter(p => p.type === filterType);
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(t) || p.breed.toLowerCase().includes(t) || p.location.toLowerCase().includes(t));
        }
        setFilteredPets(result);
    }, [pets, searchTerm, filterType]);

    const ensureGhostUser = async () => {
        if (Parse.User.current()) return;
        const user = new Parse.User();
        user.set("username", "visitante_" + Math.random().toString(36).substring(7));
        user.set("password", "senha123");
        try { await user.signUp(); } catch (e) { console.error("Erro ghost user:", e); }
    };

    // --- AÇÕES COM RECARREGAMENTO SUAVE (SEM RELOAD) ---

    const handleSaveVolunteer = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try { await ensureGhostUser(); const V = Parse.Object.extend("Volunteer"); const v = new V();
            const acl = new Parse.ACL(); acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true); v.setACL(acl);
            v.set("name", volunteerForm.name); v.set("contact", volunteerForm.contact);
            v.set("availability", volunteerForm.availability); v.set("interests", volunteerForm.interests);
            await v.save(); alert("Cadastro realizado!"); setVolunteerForm({ name: '', contact: '', availability: '', interests: '' });
            await loadAllData(); // Recarrega dados
        } catch (err) { alert(err.message); } finally { setIsSaving(false); }
    };

    const handleSaveContact = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try { await ensureGhostUser(); const C = Parse.Object.extend("ContactMessage"); const m = new C();
            const acl = new Parse.ACL(); acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true); m.setACL(acl);
            m.set("name", contactForm.name); m.set("email", contactForm.email); m.set("subject", contactForm.subject); m.set("message", contactForm.message);
            await m.save(); alert("Mensagem enviada!"); setContactForm({ name: '', email: '', subject: '', message: '' });
            await loadAllData();
        } catch (err) { alert(err.message); } finally { setIsSaving(false); }
    };

    const handleRegisterPet = async (formData, editId) => {
        setIsSaving(true);
        try {
            await ensureGhostUser(); 
            const Pet = Parse.Object.extend("Pet");
            let petToSave;
            if (editId) {
                const query = new Parse.Query(Pet);
                petToSave = await query.get(editId);
            } else {
                petToSave = new Pet();
                const acl = new Parse.ACL(); acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true); petToSave.setACL(acl);
                petToSave.set("isAdopted", false);
            }
            petToSave.set("name", formData.name); petToSave.set("type", formData.type);
            petToSave.set("breed", formData.breed); petToSave.set("age", formData.age);
            petToSave.set("gender", formData.gender); petToSave.set("location", formData.location);
            petToSave.set("description", formData.description); petToSave.set("owner", formData.ownerName);
            petToSave.set("contact", formData.contact); petToSave.set("email", formData.email);
            petToSave.set("vaccinated", formData.vaccinated); petToSave.set("castrated", formData.castrated);
            
            if (formData.file) {
                const parseFile = new Parse.File("photo.jpg", formData.file);
                await parseFile.save();
                petToSave.set("image", parseFile);
            }
            await petToSave.save();
            alert("Sucesso!"); 
            await loadAllData(); // Recarrega
            setView(isAdmin ? 'admin' : 'home'); // Volta para a tela certa
        } catch (e) { alert(e.message); } finally { setIsSaving(false); }
    };

    const handleAdoptionRequest = async (pet, adopterData) => {
        setIsSaving(true);
        try {
            await ensureGhostUser(); const A = Parse.Object.extend("AdoptionRequest"); const req = new A();
            const acl = new Parse.ACL(); acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true); req.setACL(acl);
            req.set("petName", pet.name); req.set("petId", pet.id); req.set("adopterName", adopterData.name); req.set("adopterContact", adopterData.contact); req.set("status", "Analisando");
            await req.save(); alert("Solicitação enviada!"); setSelectedPet(null); 
            await loadAllData();
        } catch (e) { alert(e.message); } finally { setIsSaving(false); }
    };

    const handleSaveDonation = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try { await ensureGhostUser(); const D = Parse.Object.extend("Donation"); const d = new D(); 
            const acl = new Parse.ACL(); acl.setPublicReadAccess(true); acl.setPublicWriteAccess(true); d.setACL(acl);
            d.set("name", donationForm.name); d.set("contact", donationForm.contact); d.set("items", donationForm.items);
            await d.save(); alert("Recebido!"); setDonationForm({name:'', contact:'', items:''});
            await loadAllData();
        } catch(e){alert(e.message);} finally { setIsSaving(false); }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        // Atualiza visualmente primeiro para ser rápido
        setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        try {
            const Adoption = Parse.Object.extend("AdoptionRequest"); const q = new Parse.Query(Adoption); const o = await q.get(id);
            o.set("status", newStatus); await o.save();
        } catch (e) { alert("Erro ao salvar status"); }
    };

    const togglePetAdopted = async (petId, currentStatus) => {
        setIsSaving(true);
        try {
            const Pet = Parse.Object.extend("Pet"); const q = new Parse.Query(Pet); const p = await q.get(petId);
            p.set("isAdopted", !currentStatus); await p.save();
            await loadAllData(); // Recarrega
        } catch (e) { alert(e.message); } finally { setIsSaving(false); }
    };

    const deleteItem = async (className, id, confirmMsg) => {
        if (!confirm(confirmMsg)) return;
        setIsSaving(true);
        try {
            const Obj = Parse.Object.extend(className); const q = new Parse.Query(Obj); const o = await q.get(id); await o.destroy();
            await loadAllData(); // Recarrega tudo limpo
        } catch (e) { alert(e.message); } finally { setIsSaving(false); }
    };

    const handleDeletePet = async (id) => { deleteItem("Pet", id, "Excluir Pet?"); };
    const handleDeleteDonation = async (id) => { deleteItem("Donation", id, "Concluir doação?"); };
    const handleDeleteAdoption = async (id) => { deleteItem("AdoptionRequest", id, "Arquivar?"); };
    const handleDeleteMessage = async (id) => { deleteItem("ContactMessage", id, "Excluir mensagem?"); };
    const handleDeleteVolunteer = async (id) => { deleteItem("Volunteer", id, "Excluir voluntário?"); };

    const handleAdminLogin = async (e) => {
        e.preventDefault(); setIsSaving(true);
        try { await Parse.User.logIn(loginData.username, loginData.password); setIsAdmin(true); }
        catch(e){alert(e.message);} finally { setIsSaving(false); }
    };
    
    const handleLogout = async () => { 
        await Parse.User.logOut(); 
        setIsAdmin(false); // Apenas sai do modo admin, não recarrega
        setView('home');
    }

    // Helpers
    const openRegister = () => { setEditingPet(null); setView('register'); }
    const openEdit = (pet) => { setEditingPet(pet); setView('register'); }

    if (loadingInitial) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Icons.Loader className="w-10 h-10 animate-spin text-indigo-600" /></div>;
    if (isSaving) return <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm"><Icons.Loader className="w-12 h-12 animate-spin mb-4" /><h2 className="text-2xl font-bold">Processando...</h2></div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                        <div className="w-10 h-10 text-indigo-600 hover:scale-110 transition-transform">
                            <Icons.Dog className="w-full h-full" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Encontre um Amigo</span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => setView('home')} className={`text-sm font-medium ${view === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}>Início</button>
                        <button onClick={() => setView('donate')} className={`text-sm font-medium ${view === 'donate' ? 'text-indigo-600' : 'text-gray-500'}`}>Doações</button>
                        <button onClick={() => setView('volunteer')} className={`text-sm font-medium ${view === 'volunteer' ? 'text-indigo-600' : 'text-gray-500'}`}>Seja Voluntário</button>
                        <button onClick={() => setView('contact')} className={`text-sm font-medium ${view === 'contact' ? 'text-indigo-600' : 'text-gray-500'}`}>Fale Conosco</button>
                        <button onClick={() => setView('admin')} className={`text-sm font-medium ${view === 'admin' ? 'text-indigo-600' : 'text-gray-500'}`}>Gerenciar</button>
                        <button onClick={() => setShowAdvisor(true)} className="text-sm font-medium text-indigo-600 flex gap-1 items-center bg-indigo-50 px-3 py-1.5 rounded-full"><Icons.Sparkles className="w-3 h-3" /> IA</button>
                    </div>
                    <div className="md:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2"><Icons.Menu className="w-6 h-6" /></button></div>
                </div>
                
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t animate-fade-in shadow-lg absolute w-full left-0 top-16 z-50">
                        <div className="p-2 space-y-1">
                            <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">Início</button>
                            <button onClick={() => { setView('donate'); setMobileMenuOpen(false); }} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">Doações</button>
                            <button onClick={() => { setView('volunteer'); setMobileMenuOpen(false); }} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">Seja Voluntário</button>
                            <button onClick={() => { setView('contact'); setMobileMenuOpen(false); }} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">Fale Conosco</button>
                            <button onClick={() => { setView('admin'); setMobileMenuOpen(false); }} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">Gerenciar</button>
                            <button onClick={() => { setShowAdvisor(true); setMobileMenuOpen(false); }} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-indigo-600 flex items-center gap-2"><Icons.Sparkles className="w-4 h-4" /> Conselheiro IA</button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* --- HOME VIEW --- */}
                {view === 'home' && (
                    <>
                        <div className="relative rounded-3xl overflow-hidden bg-indigo-600 text-white mb-10 shadow-xl min-h-[300px] flex items-center">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
                            <div className="relative z-10 px-6 py-10 md:p-12 w-full">
                                <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left">
                                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">Não compre, <br/><span className="text-indigo-200">adote um amigo.</span></h1>
                                    <p className="text-base md:text-lg text-indigo-100 mb-8 font-light">Milhares de cães e gatos estão esperando por um lar amoroso.</p>
                                    <div className="bg-white p-2 rounded-full shadow-lg flex items-center w-full">
                                        <Icons.Search className="w-5 h-5 ml-3 text-gray-400 shrink-0" />
                                        <input className="flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400 w-full" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                            <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType==='all'?'bg-gray-800 text-white':'bg-gray-200 text-gray-600'}`}>Todos</button>
                            <button onClick={() => setFilterType('dog')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType==='dog'?'bg-blue-600 text-white':'bg-blue-100 text-blue-700'}`}>Cães</button>
                            <button onClick={() => setFilterType('cat')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType==='cat'?'bg-orange-500 text-white':'bg-orange-100 text-orange-700'}`}>Gatos</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{filteredPets.map(pet => <PetCard key={pet.id} pet={pet} onClick={setSelectedPet} />)}</div>
                    </>
                )}

                {/* --- DONATE, VOLUNTEER, CONTACT (MESMOS) --- */}
                {view === 'donate' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-800 mb-2">Ajude a Manter o Projeto ❤️</h2><p className="text-gray-600">Sua ajuda salva vidas.</p></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-4"><div className="bg-green-100 p-2 rounded-full"><Icons.Heart className="w-6 h-6 text-green-600" /></div><h3 className="text-xl font-bold text-gray-800">Doação via PIX</h3></div><p className="text-sm text-gray-500 mb-4">Todo valor é usado para compra de ração e remédios.</p><div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chave PIX (Email)</p><p className="text-lg font-mono font-bold text-gray-800 select-all break-all">pix@encontreumamigo.org</p><p className="text-xs text-gray-400 mt-1">Banco Fictício S.A.</p></div></div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-4"><div className="bg-blue-100 p-2 rounded-full"><Icons.MapPin className="w-6 h-6 text-blue-600" /></div><h3 className="text-xl font-bold text-gray-800">Ponto de Coleta</h3></div><p className="text-gray-600 mb-4 text-sm">Recebemos ração, caminhas, brinquedos e remédios.</p><div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg"><Icons.MapPin className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" /><div><p className="font-bold text-gray-900">Central de Adoção</p><p>Rua dos Animais Felizes, 123</p><p>Centro - Sua Cidade, UF</p><p className="text-xs text-gray-400 mt-1">Seg a Sex: 08h às 18h</p></div></div></div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit"><div className="flex items-center gap-2 mb-6"><Icons.Sparkles className="w-5 h-5 text-yellow-500" /><h3 className="text-xl font-bold text-gray-800">Quero doar itens</h3></div><form onSubmit={handleSaveDonation} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: João da Silva" value={donationForm.name} onChange={(e) => setDonationForm({...donationForm, name: e.target.value})} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Seu WhatsApp</label><input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="(00) 00000-0000" value={donationForm.contact} onChange={(e) => setDonationForm({...donationForm, contact: e.target.value})} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">O que deseja doar?</label><textarea required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: 10kg de ração..." value={donationForm.items} onChange={(e) => setDonationForm({...donationForm, items: e.target.value})}></textarea></div><button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md flex justify-center items-center gap-2"><Icons.CheckCircle className="w-5 h-5" /> Enviar Intenção de Doação</button></form></div>
                        </div>
                    </div>
                )}

                {view === 'volunteer' && (
                    <div className="animate-fade-in max-w-4xl mx-auto">
                        <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-800 mb-2">Faça Parte do Time 🤝</h2><p className="text-gray-600">Doe seu tempo e carinho.</p></div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <form onSubmit={handleSaveVolunteer} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label><input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={volunteerForm.name} onChange={e => setVolunteerForm({...volunteerForm, name: e.target.value})} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={volunteerForm.contact} onChange={e => setVolunteerForm({...volunteerForm, contact: e.target.value})} /></div>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade</label><input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={volunteerForm.availability} onChange={e => setVolunteerForm({...volunteerForm, availability: e.target.value})} /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Como você gostaria de ajudar?</label><textarea required rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={volunteerForm.interests} onChange={e => setVolunteerForm({...volunteerForm, interests: e.target.value})}></textarea></div>
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md">Enviar Inscrição</button>
                            </form>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="animate-fade-in max-w-4xl mx-auto">
                        <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-800 mb-2">Fale Conosco</h2><p className="text-gray-600">Dúvidas, sugestões ou parcerias?</p></div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <form onSubmit={handleSaveContact} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome</label><input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} /></div>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label><input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})} /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label><textarea required rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}></textarea></div>
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md">Enviar Mensagem</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- ADMIN VIEW (ATUALIZADO PARA MOBILE E SEM RELOAD) --- */}
                {view === 'admin' && (
                    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        {!isAdmin ? (
                            <div className="p-12 text-center max-w-md mx-auto"><h2 className="text-2xl font-bold mb-4">Admin Login</h2><form onSubmit={handleAdminLogin} className="space-y-4"><input placeholder="Usuário" className="w-full border p-3 rounded" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} /><input type="password" placeholder="Senha" className="w-full border p-3 rounded" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} /><button className="w-full bg-indigo-600 text-white p-3 rounded font-bold">Entrar</button></form></div>
                        ) : (
                            <>
                                <div className="p-6 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={() => setAdminTab('pets')} className={`px-3 py-2 rounded-lg text-sm font-bold ${adminTab === 'pets' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Pets</button>
                                        <button onClick={() => setAdminTab('donations')} className={`px-3 py-2 rounded-lg text-sm font-bold ${adminTab === 'donations' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Doações</button>
                                        <button onClick={() => setAdminTab('adoptions')} className={`px-3 py-2 rounded-lg text-sm font-bold ${adminTab === 'adoptions' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Solicitações</button>
                                        <button onClick={() => setAdminTab('messages')} className={`px-3 py-2 rounded-lg text-sm font-bold ${adminTab === 'messages' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Mensagens</button>
                                        <button onClick={() => setAdminTab('volunteers')} className={`px-3 py-2 rounded-lg text-sm font-bold ${adminTab === 'volunteers' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>Voluntários</button>
                                    </div>
                                    <button onClick={handleLogout} className="text-red-500 text-sm underline">Sair</button>
                                </div>

                                {adminTab === 'pets' && (
                                    <div className="p-4 bg-gray-50 flex justify-end">
                                        <button onClick={openRegister} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-indigo-700"><Icons.PlusCircle className="w-4 h-4"/> Novo Pet</button>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[600px]">
                                        <thead className="bg-white border-b text-sm text-gray-500 uppercase">
                                            <tr>
                                                {adminTab === 'pets' && <><th className="p-4 pl-6">Pet</th><th className="p-4">Doador</th><th className="p-4">Local</th></>}
                                                {adminTab === 'donations' && <><th className="p-4 pl-6">Data/Doador</th><th className="p-4">Itens</th></>}
                                                {adminTab === 'adoptions' && <><th className="p-4 pl-6">Pet</th><th className="p-4">Interessado</th><th className="p-4">Status</th></>}
                                                {adminTab === 'messages' && <><th className="p-4 pl-6">Data/Nome</th><th className="p-4">Assunto</th></>}
                                                {adminTab === 'volunteers' && <><th className="p-4 pl-6">Data/Nome</th><th className="p-4">Ajuda</th></>}
                                                <th className="p-4 text-right">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {adminTab === 'pets' && pets.map(p => (
                                                <tr key={p.id} className="hover:bg-gray-50">
                                                    <td className="p-4 pl-6 flex items-center gap-3"><img src={p.image} className={`w-12 h-12 rounded-lg object-cover ${p.isAdopted?'grayscale':''}`}/><div><p className="font-bold">{p.name}</p><span className="text-xs text-gray-500">{p.breed}</span></div></td>
                                                    <td className="p-4"><div className="text-sm font-medium">{p.owner}</div>{p.contact && <a href={`https://wa.me/55${p.contact.replace(/\D/g,'')}`} target="_blank" className="text-xs text-green-600 flex gap-1"><Icons.Phone className="w-3 h-3"/> {p.contact}</a>}</td>
                                                    <td className="p-4 text-sm">{p.location}</td>
                                                    <td className="p-4 text-right flex justify-end gap-2">
                                                        <button onClick={() => openEdit(p)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full"><Icons.Edit className="w-5 h-5" /></button>
                                                        <button onClick={() => togglePetAdopted(p.id, p.isAdopted)} className={`px-2 py-1 rounded text-xs font-bold border ${p.isAdopted ? 'bg-gray-100' : 'bg-green-100 text-green-700'}`}>{p.isAdopted ? 'ADOTADO' : 'DISPONÍVEL'}</button>
                                                        <button onClick={() => handleDeletePet(p.id)} className="text-red-500 p-2"><Icons.Trash className="w-5 h-5" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {adminTab === 'donations' && donations.map(d => <tr key={d.id} className="hover:bg-gray-50"><td className="p-4 pl-6"><div className="text-xs text-gray-400">{d.date}</div><div className="font-bold">{d.name}</div><div className="text-sm text-green-600">{d.contact}</div></td><td className="p-4 text-sm italic">"{d.items}"</td><td className="p-4 text-right"><button onClick={() => handleDeleteDonation(d.id)} className="text-green-600 p-2"><Icons.CheckCircle className="w-5 h-5" /></button></td></tr>)}
                                            {adminTab === 'adoptions' && adoptions.map(a => <tr key={a.id} className="hover:bg-gray-50"><td className="p-4 pl-6"><div className="text-xs text-gray-400">{a.date}</div><span className="font-bold text-indigo-600">{a.petName}</span></td><td className="p-4"><div className="font-medium">{a.adopterName}</div><a href={`https://wa.me/55${a.adopterContact.replace(/\D/g,'')}`} target="_blank" className="text-xs text-green-600 hover:underline flex gap-1"><Icons.Phone className="w-3 h-3"/> {a.adopterContact}</a></td><td className="p-4"><select value={a.status} onChange={(e) => handleUpdateStatus(a.id, e.target.value)} className="text-xs font-bold px-2 py-1 rounded border outline-none"><option value="Analisando">Analisando ⏳</option><option value="Aprovado">Aprovado ✅</option><option value="Reprovado">Reprovado ❌</option></select></td><td className="p-4 text-right"><button onClick={() => handleDeleteAdoption(a.id)} className="text-gray-400 hover:text-red-500 p-2"><Icons.Trash className="w-5 h-5" /></button></td></tr>)}
                                            {adminTab === 'messages' && messages.map(m => <tr key={m.id} className="hover:bg-gray-50"><td className="p-4 pl-6"><div className="text-xs text-gray-400">{m.date}</div><div className="font-bold">{m.name}</div><div className="text-xs text-indigo-600">{m.email}</div></td><td className="p-4"><div className="font-bold text-sm">{m.subject}</div><div className="text-sm text-gray-600">{m.message}</div></td><td className="p-4 text-right"><button onClick={() => handleDeleteMessage(m.id)} className="text-red-500 p-2"><Icons.Trash className="w-5 h-5" /></button></td></tr>)}
                                            {adminTab === 'volunteers' && volunteers.map(v => <tr key={v.id} className="hover:bg-gray-50"><td className="p-4 pl-6"><div className="text-xs text-gray-400">{v.date}</div><div className="font-bold">{v.name}</div><div className="text-sm text-green-600">{v.contact}</div></td><td className="p-4 text-sm">{v.availability}</td><td className="p-4 text-right"><button onClick={() => handleDeleteVolunteer(v.id)} className="text-red-500 p-2"><Icons.Trash className="w-5 h-5" /></button></td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* MODIFICADO: Passa 'editingPet' para o formulário */}
                {view === 'register' && <RegisterForm onCancel={() => setView(isAdmin ? 'admin' : 'home')} onSubmit={handleRegisterPet} initialData={editingPet} />}
            </main>
            {selectedPet && <Modal pet={selectedPet} onClose={() => setSelectedPet(null)} onAdopt={handleAdoptionRequest} />}
            {showAdvisor && <AdvisorModal onClose={() => setShowAdvisor(false)} />}
        </div>
    );
}

export default App;