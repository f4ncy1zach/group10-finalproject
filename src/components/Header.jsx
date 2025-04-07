import { Home } from "lucide-react"
import { Button } from "../components/ui/button"
import Logo from "./Logo"

/**
 * Header Component
 * Displays the application header with logo and home button
 *
 * @param {Object} props - Component props
 * @param {Function} props.resetForm - Function to reset the form and return to home
 * @returns {JSX.Element} The header component
 */
export default function Header({ resetForm }) {
    return (
        <header className="header">
            <div className="headerContent">
                <div className="logo">
                    <Logo size={50} />
                    <h1 className="logoText">TRAVEL ADVISOR</h1>
                </div>
                <Button variant="ghost" size="icon" className="homeButton" onClick={resetForm} aria-label="Return to home">
                    <Home className="homeIcon" />
                    <span className="sr-only">Home</span>
                </Button>
            </div>
        </header>
    )
}