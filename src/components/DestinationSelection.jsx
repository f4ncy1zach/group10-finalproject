import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

/**
 * DestinationSelection Component
 * Allows users to manually enter their desired destination
 * Used when AI recommendation is not selected
 *
 * @param {Object} props - Component props
 * @param {string} props.destinationCountry - Selected destination country
 * @param {Function} props.setDestinationCountry - Function to update destination country
 * @param {string} props.destinationCity - Selected destination city
 * @param {Function} props.setDestinationCity - Function to update destination city
 * @param {Function} props.nextStep - Function to advance to next step
 * @param {Function} props.prevStep - Function to go back to previous step
 * @returns {JSX.Element} The destination selection component
 */
export default function DestinationSelection({
                                                 destinationCountry,
                                                 setDestinationCountry,
                                                 destinationCity,
                                                 setDestinationCity,
                                                 nextStep,
                                                 prevStep,
                                             }) {
    // State for validation errors
    const [countryError, setCountryError] = useState("")
    const [cityError, setCityError] = useState("")

    /**
     * Handles country input change and validation
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleCountryChange = (e) => {
        const value = e.target.value
        setDestinationCountry(value)

        // Validate input
        if (!value.trim()) {
            setCountryError("Country is required")
        } else {
            setCountryError("")
        }
    }

    /**
     * Handles city input change and validation
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleCityChange = (e) => {
        const value = e.target.value
        setDestinationCity(value)

        // Validate input
        if (!value.trim()) {
            setCityError("City is required")
        } else {
            setCityError("")
        }
    }

    // Check if form is valid (both fields have values)
    const isFormValid = destinationCountry.trim() !== "" && destinationCity.trim() !== ""

    return (
        <motion.div
            key="destination-selection"
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
                        animate={{
                            x: [0, 10, 0, -10, 0],
                            rotate: [0, 10, 0, -10, 0],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        className="questionIcon"
                    >
                        <MapPin className="stepIcon" />
                    </motion.div>
                    <h2 className="questionText">WHERE IS YOUR DESIRED DESTINATION?</h2>
                </div>

                <div className="inputContainer">
                    {/* Country Input */}
                    <div className="inputField">
                        <label htmlFor="destinationCountry" className="inputLabel">
                            Country
                        </label>
                        <input
                            id="destinationCountry"
                            type="text"
                            value={destinationCountry}
                            onChange={handleCountryChange}
                            placeholder="Enter destination country"
                            data-test="Country-Input"
                            className="textInput"
                            aria-required="true"
                            aria-invalid={!!countryError}
                        />
                        {countryError && (
                            <p className="errorText" role="alert">
                                {countryError}
                            </p>
                        )}
                    </div>

                    {/* City Input */}
                    <div className="inputField mt-4">
                        <label htmlFor="destinationCity" className="inputLabel">
                            City
                        </label>
                        <input
                            id="destinationCity"
                            type="text"
                            value={destinationCity}
                            onChange={handleCityChange}
                            placeholder="Enter destination city"
                            data-test="City-Input"
                            className="textInput"
                            aria-required="true"
                            aria-invalid={!!cityError}
                        />
                        {cityError && (
                            <p className="errorText" role="alert">
                                {cityError}
                            </p>
                        )}
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="buttonContainer">
                    <Button variant="outline" onClick={prevStep} data-test="Back-Button-Des" className="backButton">
                        <ArrowLeft className="buttonIcon" />
                        Back
                    </Button>
                    <Button onClick={nextStep} disabled={!isFormValid} data-test="Next-Button-Des" className="nextButton">
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}