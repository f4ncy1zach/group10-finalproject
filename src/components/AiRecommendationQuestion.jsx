import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Bot } from "lucide-react"
import { Button } from "./ui/button"

/**
 * AiRecommendationQuestion Component
 * Asks the user if they want an AI-recommended destination
 * First step in the travel planning flow
 *
 * @param {Object} props - Component props
 * @param {Function} props.setUseAiRecommendation - Function to set AI recommendation preference
 * @param {Function} props.nextStep - Function to advance to next step
 * @param {Function} props.prevStep - Function to go back to previous step
 * @returns {JSX.Element} The AI recommendation question component
 */
export default function AiRecommendationQuestion({ setUseAiRecommendation, nextStep, prevStep }) {
    // State to track which option is selected
    const [selectedOption, setSelectedOption] = useState(null)

    /**
     * Handles option selection and updates parent state
     *
     * @param {boolean} option - Whether to use AI recommendation (true/false)
     */
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
                    {/* Yes option */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={selectedOption === true ? "default" : "outline"}
                            onClick={() => handleOptionSelect(true)}
                            data-test="Recommend-Button"
                            className={`optionButton ${selectedOption === true ? "optionButtonActive" : ""}`}
                        >
                            Yes, recommend a destination
                        </Button>
                    </motion.div>

                    {/* No option */}
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

                {/* Navigation buttons */}
                <div className="buttonContainer">
                    <Button variant="outline" onClick={prevStep} data-test="AiRec-Back" className="backButton">
                        <ArrowLeft className="buttonIcon" />
                        Back
                    </Button>
                    <Button onClick={nextStep} disabled={selectedOption === null} data-test="Next-Button-AiRec" className="nextButton">
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}