// Header components, showing website logo and home button
import { Home } from "lucide-react"
import { Button } from "../components/ui/button"
import Logo from "./Logo"

export default function Header({ resetForm }) {
    return (
        <header className="header">
            <div className="headerContent">
                <div className="logo">
                    <Logo size={50} />
                    <h1 className="logoText">TRAVEL ADVISOR</h1>
                </div>
                <Button variant="ghost" size="icon" className="homeButton" onClick={resetForm}>
                    <Home className="homeIcon" />
                    <span className="sr-only">Home</span>
                </Button>
            </div>
        </header>
    )
}