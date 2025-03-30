// First question asking the user if they want a destination recommended by the AI
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Bot } from "lucide-react"
import { Button } from "./ui/button"

export default function AiRecommendationQuestion({ setUseAiRecommendation, nextStep, prevStep }) {
    const [selectedOption, setSelectedOption] = useState(null)

    const handleOptionSelect = (option) => {
        setSelectedOption(option)
        setUseAiRecommendation(option)
    }

    return (
        <motion.div
            key="ai-recommendation"
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
            <div className="formStep">
                <div className="questionHeader">
                    <motion.div
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="questionIcon"
                    >
                        <Bot className="stepIcon" />
                    </motion.div>
                    <h2 className="questionText">WOULD YOU LIKE A DESTINATION RECOMMENDED BY OUR AI - TRIPPY?</h2>
                </div>

                <div className="optionsGrid">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={selectedOption === true ? "default" : "outline"}
                            onClick={() => handleOptionSelect(true)}
                            className={`optionButton ${selectedOption === true ? "optionButtonActive" : ""}`}
                        >
                            Yes, recommend a destination
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={selectedOption === false ? "default" : "outline"}
                            onClick={() => handleOptionSelect(false)}
                            className={`optionButton ${selectedOption === false ? "optionButtonActive" : ""}`}
                        >
                            No, I'll choose my destination
                        </Button>
                    </motion.div>
                </div>

                <div className="buttonContainer">
                    <Button variant="outline" onClick={prevStep} className="backButton">
                        <ArrowLeft className="buttonIcon" />
                        Back
                    </Button>
                    <Button onClick={nextStep} disabled={selectedOption === null} className="nextButton">
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}