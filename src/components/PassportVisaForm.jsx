// Passport and visa form if the user has selected AI recommendation
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, StampIcon as Passport, Plus, X } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export default function PassportVisaForm({
                                             travelers,
                                             updateTravelerPassport,
                                             updateTravelerVisas,
                                             addTraveler,
                                             removeTraveler,
                                             nextStep,
                                             prevStep,
                                         }) {
    // State for validation
    const [errors, setErrors] = useState({})

    // Handle passport input change
    const handlePassportChange = (id, value) => {
        updateTravelerPassport(id, value)

        // Validate
        const newErrors = { ...errors }
        if (!value.trim()) {
            newErrors[`passport-${id}`] = "Passport country is required"
        } else {
            delete newErrors[`passport-${id}`]
        }
        setErrors(newErrors)
    }

    // Handle visa input
    const handleAddVisa = (travelerId, visaInput) => {
        if (!visaInput.trim()) return

        const traveler = travelers.find((t) => t.id === travelerId)
        if (traveler && !traveler.visas.includes(visaInput)) {
            updateTravelerVisas(travelerId, [...traveler.visas, visaInput])
        }

        // Clear the input field
        document.getElementById(`visa-input-${travelerId}`).value = ""
    }

    // Remove a visa from a traveler
    const removeVisa = (travelerId, visa) => {
        const traveler = travelers.find((t) => t.id === travelerId)
        if (traveler) {
            updateTravelerVisas(
                travelerId,
                traveler.visas.filter((v) => v !== visa),
            )
        }
    }

    // Check if form is valid (all travelers have a passport)
    const isFormValid = () => {
        return travelers.every((traveler) => traveler.passport.trim() !== "") && Object.keys(errors).length === 0
    }

    return (
        <motion.div
            key="passport-visa-form"
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
                        <Passport className="stepIcon" />
                    </motion.div>
                    <h2 className="questionText">TELL US ABOUT YOUR TRAVEL DOCUMENTS</h2>
                </div>

                <div className="travelersContainer">
                    {travelers.map((traveler) => (
                        <div key={traveler.id} className="travelerCard">
                            <div className="travelerHeader">
                                <h3 className="travelerTitle">Traveler {traveler.id}</h3>
                                {travelers.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="removeButton"
                                        onClick={() => removeTraveler(traveler.id)}
                                    >
                                        <X size={16} />
                                    </Button>
                                )}
                            </div>

                            {/* Passport Input */}
                            <div className="inputField">
                                <label htmlFor={`passport-${traveler.id}`} className="inputLabel">
                                    Passport Country
                                </label>
                                <input
                                    id={`passport-${traveler.id}`}
                                    type="text"
                                    value={traveler.passport}
                                    onChange={(e) => handlePassportChange(traveler.id, e.target.value)}
                                    placeholder="Enter passport country"
                                    className="textInput"
                                />
                                {errors[`passport-${traveler.id}`] && <p className="errorText">{errors[`passport-${traveler.id}`]}</p>}
                            </div>

                            {/* Visa Input */}
                            <div className="inputField">
                                <label className="inputLabel">Current Visas (Optional)</label>
                                <div className="visaInputContainer">
                                    <input
                                        id={`visa-input-${traveler.id}`}
                                        type="text"
                                        placeholder="Enter visa country"
                                        className="textInput"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddVisa(traveler.id, e.target.value)
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="addVisaButton"
                                        onClick={() => {
                                            const input = document.getElementById(`visa-input-${traveler.id}`)
                                            handleAddVisa(traveler.id, input.value)
                                        }}
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                <p className="helperText">Press Enter or click + to add a visa</p>

                                {/* Display selected visas */}
                                {traveler.visas.length > 0 && (
                                    <div className="selectedVisas">
                                        {traveler.visas.map((visa) => (
                                            <div key={visa} className="visaTag">
                                                {visa}
                                                <button className="removeVisaButton" onClick={() => removeVisa(traveler.id, visa)}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Traveler Button */}
                    <Button variant="outline" className="addTravelerButton" onClick={addTraveler}>
                        <Plus size={16} className="buttonIcon" />
                        Add Traveler
                    </Button>
                </div>

                <div className="buttonContainer">
                    <Button variant="outline" onClick={prevStep} className="backButton">
                        <ArrowLeft className="buttonIcon" />
                        Back
                    </Button>
                    <Button onClick={nextStep} disabled={!isFormValid()} className="nextButton">
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}