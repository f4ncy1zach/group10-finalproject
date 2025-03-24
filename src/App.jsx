import { useState } from "react"
import { Button } from "./components/ui/button"
import "./App.css"

function App() {
    const [step, setStep] = useState(0)

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <div className="headerContent">
                    <div className="logo">
                        <h1 className="logoText">TRAVEL ADVISOR</h1>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="mainContent">
                <div className="glassCard">
                    <div className="welcomeStep">
                        <h2 className="welcomeTitle">TRAVEL ADVISOR</h2>
                        <p className="welcomeText">
                            Embark on a journey with your AI-powered travel companion, crafting magical trips tailored just for you.
                        </p>
                        <Button
                            onClick={() => setStep(1)}
                            className="startButton"
                        >
                            Start Your Journey
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footerContent">
                    <p className="copyright">&copy; {new Date().getFullYear()} Travel Advisor. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default App