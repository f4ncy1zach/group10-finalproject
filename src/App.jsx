import { useState } from "react"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Textarea } from "./components/ui/textarea"
import { Globe, Home } from 'lucide-react'
import "./App.css"

function App() {
    const [step, setStep] = useState(0)
    const [travelers, setTravelers] = useState(2)
    const [chatMessage, setChatMessage] = useState("")

    const resetForm = () => {
        setStep(0)
        setTravelers(2)
        setChatMessage("")
    }

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <div className="headerContent">
                    <div className="logo">
                        <div className="logoIconContainer">
                            <Globe className="logoIcon" />
                        </div>
                        <h1 className="logoText">TRAVEL ADVISOR</h1>
                    </div>
                    <Button variant="ghost" size="icon" className="homeButton" onClick={resetForm}>
                        <Home className="homeIcon" />
                        <span className="sr-only">Home</span>
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <div className="mainContent">
                <div className="glassCard">
                    {step === 0 && (
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
                    )}

                    {step === 1 && (
                        <div className="formStep">
                            <h2 className="questionText">HOW MANY PEOPLE ARE TRAVELING?</h2>
                            <div className="inputContainer">
                                <div className="sliderContainer">
                                    <Slider
                                        value={[travelers]}
                                        min={1}
                                        max={10}
                                        step={1}
                                        onValueChange={(value) => setTravelers(value[0])}
                                        className="slider"
                                    />
                                    <div className="travelersBadge">{travelers}</div>
                                </div>
                            </div>
                            <div className="buttonContainer">
                                <Button variant="outline" onClick={() => setStep(0)} className="backButton">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(2)} className="nextButton">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="formStep">
                            <h2 className="questionText">ANY ADDITIONAL COMMENTS?</h2>
                            <div className="inputContainer">
                                <Textarea
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Add any additional details about your trip..."
                                    className="textarea"
                                />
                            </div>
                            <div className="buttonContainer">
                                <Button variant="outline" onClick={() => setStep(1)} className="backButton">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(0)} className="nextButton">
                                    Submit
                                </Button>
                            </div>
                        </div>
                    )}
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