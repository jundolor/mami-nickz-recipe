import ReactMarkDown from "react-markdown"

export default function ClaudeRecipe(props){
    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>chef Mami Nickz Recommends</h2>
            <ReactMarkDown>{props.recipe}</ReactMarkDown>
        </section>
    )
}