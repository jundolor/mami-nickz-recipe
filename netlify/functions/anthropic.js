import Anthropic from "@anthropic-ai/sdk"

export async function handler(event) {
    // Check for POST method for cleaner API
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    let ingredientsArr = ['Onion', 'Garlic', 'Pasta', 'Beef']; // Better fallback: simple strings

    // --- Input Parsing and Validation ---
    if (event.body) {
        try {
            const body = JSON.parse(event.body); 
            
            // Check if the property exists and is an array
            if (Array.isArray(body.ingredientsArr)) {
                ingredientsArr = body.ingredientsArr; 
            }
        } catch (e) {
            // Log error and proceed with fallback, or return a 400 error
            console.error("Error parsing request body JSON:", e);
            // Optionally: return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON format" }) };
        } 
    }
    // ------------------------------------

    const ingredientsString = ingredientsArr.join(", ");
    const SYSTEM_PROMPT = "You are a helpful chef. Provide clear, easy recipes.";

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
        });

        const recipeText = msg.content[0].text; // Explicitly assign the result

        return {
            statusCode: 200,
            body: JSON.stringify({ text: recipeText }),
        };
    } catch (err) {
        // Better error message for the user, while logging the specific API error
        console.error("Anthropic API Error:", err.message); 
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process request due to internal error." }),
        };
    }
}