// src/services/gemini.js

// ⚠️ Se você tiver a chave da IA (Gemini API Key), coloque dentro das aspas abaixo.
// Se não tiver agora, deixe vazio (a IA só vai avisar que precisa configurar).
const apiKey = ""; 

export const callGemini = async (prompt, systemInstruction = "") => {
    if (!apiKey) return "⚠️ Configure a chave da API no código para usar a IA.";
    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) throw new Error('Falha na API Gemini');
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar resposta.";
    } catch (error) {
        console.error("Erro Gemini:", error);
        return "Desculpe, a IA está indisponível no momento.";
    }
};