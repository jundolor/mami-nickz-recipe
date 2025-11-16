import { HfInference } from "@huggingface/inference"

export async function handler(event) {
    // 1. Check for POST method and exit early if it's not a POST request
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Method Not Allowed. Please use POST." }) 
        };
    }

    // 2. Initialize Hugging Face client with the token from environment variables
    const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

    // 3. Fallback ingredients array (used if no valid body is sent)
    let ingredientsArr = ['Shrimp', 'Onion', 'Pepper', 'Tomato Sauce']; 

    // --- Input Parsing and Validation ---
    if (event.body) {
        try {
            const body = JSON.parse(event.body); 
            
            // Check if the property exists and is a non-empty array
            if (Array.isArray(body.ingredientsArr) && body.ingredientsArr.length > 0) {
                ingredientsArr = body.ingredientsArr; 
            }
        } catch (e) {
            // Log error for debugging, but proceed with the fallback ingredients
            console.error("Error parsing request body JSON:", e.message); 
        } 
    }
    // ------------------------------------

    const ingredientsString = ingredientsArr.join(", ");
    const SYSTEM_PROMPT = "You are a helpful chef. Provide clear, easy recipes.";

    try {
        // We use textGeneration with a combined prompt, and switch to the
        // more stable Mistral 7B Instruct model.
        const prompt = `System: ${SYSTEM_PROMPT}\nUser: I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;

        const response = await hf.textGeneration({
            // ✅ FIX: Switched from Mixtral-8x7B to Mistral-7B-Instruct-v0.2
            model: "mistralai/Mistral-7B-Instruct-v0.2", 
            inputs: prompt, // The single, combined instruction prompt
            parameters: {
                max_new_tokens: 1024,
                temperature: 0.7, // Add temperature for creative output
            },
        });

        // The response object for textGeneration contains the result in 'generated_text'
        const recipeText = response.generated_text;

        return {
            statusCode: 200,
            body: JSON.stringify({ text: recipeText }),
        };
    } catch(err) {
        // Log the specific error for server-side debugging
        console.error("Hugging Face API Error:", err.message); 
        
        // Return a generic 500 error to the client
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Failed to generate recipe. Check API key or model availability." 
            }),
        };
    }
}