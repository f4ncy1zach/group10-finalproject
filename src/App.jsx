import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Textarea } from "./components/ui/textarea"
import { Globe, Home, ArrowRight } from 'lucide-react'
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
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Globe className="logoIcon" />
                        </motion.div>
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
                <motion.div
                    className="glassCard"
                    whileHover={{
                        boxShadow: "0 10px 25px rgba(56, 189, 248, 0.3)",
                        y: -5,
                    }}
                >
                    {step === 0 && (
                        <div className="welcomeStep">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="welcomeIcon"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
                                }}
                            >
                                <Globe className="welcomeGlobe" />
                            </motion.div>
                            <motion.h2
                                className="welcomeTitle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                TRAVEL ADVISOR
                            </motion.h2>
                            <motion.p
                                className="welcomeText"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Embark on a journey with your AI-powered travel companion, crafting magical trips tailored just for you.
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                <Button
                                    onClick={() => setStep(1)}
                                    className="startButton"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Your Journey
                                    <ArrowRight className="buttonIcon" />
                                </Button>
                            </motion.div>
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
                                    <motion.div
                                        className="travelersBadge"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                    >
                                        {travelers}
                                    </motion.div>
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
                </motion.div>
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