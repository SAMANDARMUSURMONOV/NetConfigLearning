import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

export const generateQuizQuestions = async (topic: string, difficulty: string, count: number) => {
    try {
        const prompt = `
            You are a professional networking and IT instructor. 
            Generate a set of quiz questions for the following topic: "${topic}".
            
            Requirements:
            1. Difficulty level: ${difficulty}.
            2. Number of questions: ${count}.
            3. Language: Uzbek (Latin script).
            4. Format: Return ONLY a valid JSON array of objects.
            
            Each object must have exactly this structure:
            {
                "question": "The text of the question in Uzbek",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "correctAnswer": 0
            }
            
            Example:
            [
                {
                    "question": "IP manzil necha bitdan iborat?",
                    "options": ["16 bit", "32 bit", "64 bit", "128 bit"],
                    "correctAnswer": 1
                }
            ]
            
            Return ONLY the raw JSON array. DO NOT include markdown formatting like \`\`\`json.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional IT instructor that returns output in JSON format only."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2048,
        });

        const text = chatCompletion.choices[0]?.message?.content?.trim() || '[]';
        
        // Clean markdown backticks if any
        const cleanJson = text.replace(/```json|```/g, '').trim();
        
        return JSON.parse(cleanJson);
    } catch (error: any) {
        console.error('Groq Generation Error:', error);
        throw new Error('AI Generation failed: ' + error.message);
    }
};
