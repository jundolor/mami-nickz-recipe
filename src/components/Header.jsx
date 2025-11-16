//import mamiNicksLogo from "../src/assets/images/mamiNicksLogo.png"
import mamiNicksLogo from "../assets/images/mami-nickz-logo.png";

export default function Header() {
    return (
        <header>
            <img src={mamiNicksLogo} alt="Chef Mami Nickz Icon" />
            <h1>Chef Mami Nickz<br />
                <small>By Jun Dolor. View my ➡️<a href="https://www.linkedin.com/in/jun-dolor/" target="_blank" rel="noreferrer">LinkedIn profile</a></small>
            </h1>
        </header>
    )
}