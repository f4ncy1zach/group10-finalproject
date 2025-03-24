import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Globe, Home, ArrowRight, ArrowLeft, Users } from 'lucide-react'
import "./App.css"

function App() {
    const [step, setStep] = useState(0)
    const [travelers, setTravelers] = useState(2)

    const totalSteps = 8 // Total number of steps in the final project

    const resetForm = () => {
        setStep(0)
        setTravelers(2)
    }

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        }
    }

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1)
        }
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

            {/* Progress indicator */}
            <div className="progressContainer">
                <div className="progressTracker">
                    {[...Array(totalSteps + 1)].map((_, i) => (
                        <div key={i} className="progressStep">
                            <motion.div
                                className={`progressDot ${i <= step ? "progressDotActive" : ""}`}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: i === step ? [1, 1.2, 1] : 1,
                                    boxShadow: i <= step ? "0 0 10px rgba(56, 189, 248, 0.5)" : "none",
                                }}
                                transition={{ duration: 1, repeat: i === step ? Number.POSITIVE_INFINITY : 0 }}
                                whileHover={{ scale: 1.2 }}
                            >
                                <span className="progressNumber">{i + 1}</span>
                            </motion.div>
                            {i < totalSteps && <div className={`progressLine ${i < step ? "progressLineActive" : ""}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="mainContent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
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
                                        onClick={nextStep}
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
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Users className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">HOW MANY PEOPLE ARE TRAVELING?</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="sliderLabels">
                                        <span className="sliderLabel">1</span>
                                        <span className="sliderLabel">10</span>
                                    </div>
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
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
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