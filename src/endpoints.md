Create an endpoint (e.g., POST /api/recipe-suggestions) that accepts the user's prompt from your frontend.

Here is what that lightweight controller looks like in Node:

JavaScript
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your secret key from the environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRecipeSuggestions = async (req, res) => {
try {
const { userIngredients } = req.body;

    // Use the free Gemini 1.5 Flash model for fast text tasks
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Suggest a recipe using these ingredients: ${userIngredients}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Send the safe text back to your React app
    res.json({ recipe: response.text() });

} catch (error) {
console.error("AI Generation Error:", error);
res.status(500).json({ error: "Failed to generate recipe" });
}
};
