/**
 * PassportVisaForm Component
 * Collects passport and visa information from travelers
 * Used when AI recommendation is selected to determine suitable destinations
 * Allows adding multiple travelers and their travel documents
 *
 * @param {Object} props - Component props
 * @param {Array} props.travelers - Array of traveler objects with passport and visa info
 * @param {Function} props.updateTravelerPassport - Function to update a traveler's passport
 * @param {Function} props.updateTravelerVisas - Function to update a traveler's visas
 * @param {Function} props.addTraveler - Function to add a new traveler
 * @param {Function} props.removeTraveler - Function to remove a traveler
 * @param {Function} props.nextStep - Function to advance to next step
 * @param {Function} props.prevStep - Function to go back to previous step
 * @returns {JSX.Element} The passport and visa form component
 */
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
    // State for validation errors
    const [errors, setErrors] = useState({})

    /**
     * Handles passport input change and validation
     * Updates the traveler's passport and validates the input
     *
     * @param {number} id - The ID of the traveler to update
     * @param {string} value - The new passport country value
     */
    const handlePassportChange = (id, value) => {
        // Update the traveler's passport
        updateTravelerPassport(id, value)

        // Validate the input
        const newErrors = { ...errors }
        if (!value.trim()) {
            // Add error if field is empty
            newErrors[`passport-${id}`] = "Passport country is required"
        } else {
            // Remove error if field is valid
            delete newErrors[`passport-${id}`]
        }
        setErrors(newErrors)
    }

    /**
     * Handles adding a visa to a traveler
     * Validates input and updates the traveler's visas array
     *
     * @param {number} travelerId - The ID of the traveler to update
     * @param {string} visaInput - The visa country to add
     */
    const handleAddVisa = (travelerId, visaInput) => {
        // Skip if input is empty
        if (!visaInput.trim()) return

        // Find the traveler and add the visa if it doesn't already exist
        const traveler = travelers.find((t) => t.id === travelerId)
        if (traveler && !traveler.visas.includes(visaInput)) {
            updateTravelerVisas(travelerId, [...traveler.visas, visaInput])
        }

        // Clear the input field
        document.getElementById(`visa-input-${travelerId}`).value = ""
    }

    /**
     * Removes a visa from a traveler
     * Filters out the specified visa from the traveler's visas array
     *
     * @param {number} travelerId - The ID of the traveler to update
     * @param {string} visa - The visa country to remove
     */
    const removeVisa = (travelerId, visa) => {
        const traveler = travelers.find((t) => t.id === travelerId)
        if (traveler) {
            // Filter out the visa to remove
            updateTravelerVisas(
                travelerId,
                traveler.visas.filter((v) => v !== visa),
            )
        }
    }

    /**
     * Checks if the form is valid for submission
     * Ensures all travelers have a passport and no validation errors exist
     *
     * @returns {boolean} Whether the form is valid
     */
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
                {/* Form header with icon and title */}
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

                {/* Container for traveler cards */}
                <div className="travelersContainer">
                    {/* Map through travelers and render a card for each */}
                    {travelers.map((traveler) => (
                        <div key={traveler.id} className="travelerCard">
                            {/* Traveler card header with remove button */}
                            <div className="travelerHeader">
                                <h3 className="travelerTitle">Traveler {traveler.id}</h3>
                                {/* Only show remove button if there's more than one traveler */}
                                {travelers.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        data-test={`Remove-Button-${traveler.id}`}
                                        className="removeButton"
                                        onClick={() => removeTraveler(traveler.id)}
                                        aria-label={`Remove traveler ${traveler.id}`}
                                    >
                                        <X size={16} />
                                    </Button>
                                )}
                            </div>

                            {/* Passport Input Field */}
                            <div className="inputField">
                                <label htmlFor={`passport-${traveler.id}`} className="inputLabel">
                                    Passport Country
                                </label>
                                <input spellCheck="true"
                                    id={`passport-${traveler.id}`}
                                    type="text"
                                    value={traveler.passport}
                                    onChange={(e) => handlePassportChange(traveler.id, e.target.value)}
                                    placeholder="Enter passport country"
                                    data-test={`Traveler-ID-${traveler.id}`}
                                    className="textInput"
                                    aria-required="true"
                                    aria-invalid={!!errors[`passport-${traveler.id}`]}
                                />
                                {/* Show error message if validation fails */}
                                {errors[`passport-${traveler.id}`] && (
                                    <p className="errorText" role="alert">
                                        {errors[`passport-${traveler.id}`]}
                                    </p>
                                )}
                            </div>

                            {/* Visa Input Section */}
                            <div className="inputField">
                                <label className="inputLabel">Current Visas (Optional)</label>
                                <div className="visaInputContainer">
                                    {/* Visa input field with Enter key handler */}
                                    <input
                                        spellCheck="true"   
                                        id={`visa-input-${traveler.id}`}
                                        type="text"
                                        placeholder="Enter visa country"
                                        data-test={`Visa-ID-${traveler.id}`}
                                        className="textInput"
                                        onKeyDown={(e) => {
                                            // Add visa when Enter key is pressed
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddVisa(traveler.id, e.target.value)
                                            }
                                        }}
                                        aria-label={`Visa for traveler ${traveler.id}`}
                                    />
                                    {/* Add visa button */}
                                    <Button
                                        variant="default"
                                        size="sm"
                                        data-test={`Visa-Button-${traveler.id}`}
                                        className="addVisaButton"
                                        onClick={() => {
                                            const input = document.getElementById(`visa-input-${traveler.id}`)
                                            handleAddVisa(traveler.id, input.value)
                                        }}
                                        aria-label="Add visa"
                                    >
                                        <Plus size={16} className="mr-1" /> Add Visa
                                    </Button>
                                </div>
                                {/* Helper text for visa input */}
                                <p className="helperText">Enter a country and click "Add Visa" or press Enter to add to your list</p>

                                {/* Display selected visas as tags */}
                                {traveler.visas.length > 0 && (
                                    <div className="selectedVisas">
                                        {traveler.visas.map((visa) => (
                                            <div key={visa} className="visaTag">
                                                {visa}
                                                {/* Remove visa button */}
                                                <button
                                                    data-test={`Visa-Remove-${traveler.id}`}
                                                    className="removeVisaButton"
                                                    onClick={() => removeVisa(traveler.id, visa)}
                                                    aria-label={`Remove ${visa} visa`}
                                                >
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
                    <Button
                        variant="outline"
                        data-test="Add-Traveler"
                        className="addTravelerButton"
                        onClick={addTraveler}
                        aria-label="Add another traveler"
                    >
                        <Plus size={16} className="buttonIcon" />
                        Add Traveler
                    </Button>
                </div>

                {/* Navigation buttons */}
                <div className="buttonContainer">
                    <Button variant="outline" onClick={prevStep} data-test="Pass-Back" className="backButton">
                        <ArrowLeft className="buttonIcon" />
                        Back
                    </Button>
                    <Button
                        onClick={nextStep}
                        disabled={!isFormValid()}
                        className="nextButton"
                        data-test="Next-Button-Pass"
                        aria-label="Continue to next step"
                    >
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}