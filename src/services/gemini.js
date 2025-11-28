// src/services/gemini.js

const apiKey = "AIzaSyAkwslF8MFH4auE_gMCINiDn5XvSBuBGPE"; // <--- ⚠️ COLE SUA CHAVE AQUI DENTRO

export const callGemini = async (prompt) => {
    // Verificação de segurança para não enviar a chave placeholder
    if (!apiKey || apiKey.includes("COLE_SUA_CHAVE")) return "⚠️ Chave de API não configurada.";
    
    try {
        // ATUALIZADO: Usando 'gemini-2.5-flash', o modelo padrão gratuito atual
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        // Tratamento de erro detalhado
        if (!response.ok) {
            console.error("Erro detalhado:", data);
            // Se o 2.5 falhar, tenta avisar para trocar (fallback manual)
            if (data.error?.code === 404) {
                return "🚨 Modelo antigo. Tente usar 'gemini-2.0-flash'.";
            }
            return `🚨 Erro do Google: ${data.error?.message || response.statusText}`;
        }

        // Se a resposta vier vazia
        if (!data.candidates || data.candidates.length === 0) {
            return "A IA não soube o que responder.";
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Erro Técnico:", error);
        return `🚨 Erro Técnico: ${error.message}`;
    }
};