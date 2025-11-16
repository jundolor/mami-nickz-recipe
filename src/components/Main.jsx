import  {useState, useRef, useEffect } from "react";
import ClaudeRecipe from "./ClaudeRecipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromChefClaude, getRecipeFromMistral } from "../ai_request";

export default function Main(){
    const [ingredients, setIngredients] = useState([])
    const [loading, setLoading] = useState(false)

    const [recipe, setRecipe] = useState("")
    const recipeSection = useRef(null)

    useEffect(() => {
        if(recipe && recipeSection.current) {
            console.log(recipe)

            recipeSection.current.scrollIntoView({recipeSection: "smooth"})
        }
    }, [recipe])

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")

        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    async function getRecipe(){
        // 1. SET LOADING TO TRUE *BEFORE* the async work begins
        setLoading(true); 
        
        // You can console.log the *new* value after the function runs, 
        // or rely on the render to show the new state.

        let recipeMarkdown;
        const flag = 0;
        
        try {
            if(flag === 0){
                // This is where the frontend waits for the backend Netlify function
                recipeMarkdown = await getRecipeFromChefClaude(ingredients);
            } else {
                recipeMarkdown = await getRecipeFromMistral(ingredients);
            }

            // 2. ONLY set the final recipe state if the fetch was successful
            setRecipe(recipeMarkdown);

        } catch (error) {
            // Handle any errors from the fetch call (e.g., API issues)
            console.error("Failed to fetch recipe:", error);
            // Maybe set an error state here
        } finally {
            // 3. SET LOADING TO FALSE *AFTER* the async work is complete
            // This runs whether the try block succeeded or the catch block ran
            setLoading(false);
        }
    }

    return (
            <main>
                <form className="add-ingredient-form" action={addIngredient}>
                    <input 
                        type="text"
                        placeholder="e.g. oregano"
                        aria-label="Add ingredient" 
                        name="ingredient"
                    />
                    <button>Add Ingredient</button>
                </form>
                {
                    ingredients.length > 0 &&
                    <IngredientsList 
                        ref={recipeSection}
                        ingredients = {ingredients}
                        getRecipe = {getRecipe}
                    />
                }
                {loading && <h1>Loading...</h1>} {/* ✅ Display while waiting */}
                {
                    recipe &&
                    <ClaudeRecipe recipe={recipe} />
                }
    
    
            </main>
        
    )
}