// Destination selection for the user if they choose not to use AI recommendation
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export default function DestinationSelection({
                                                 destinationCountry,
                                                 setDestinationCountry,
                                                 destinationCity,
                                                 setDestinationCity,
                                                 nextStep,
                                                 prevStep,
                                             }) {
    // State for validation
    const [countryError, setCountryError] = useState("")
    const [cityError, setCityError] = useState("")

    // Handle country input change
    const handleCountryChange = (e) => {
        const value = e.target.value
        setDestinationCountry(value)

        if (!value.trim()) {
            setCountryError("Country is required")
        } else {
            setCountryError("")
        }
    }

    // Handle city input change
    const handleCityChange = (e) => {
        const value = e.target.value
        setDestinationCity(value)

        if (!value.trim()) {
            setCityError("City is required")
        } else {
            setCityError("")
        }
    }

    // Check if form is valid
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
                            className="textInput"
                        />
                        {countryError && <p className="errorText">{countryError}</p>}
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
                            className="textInput"
                        />
                        {cityError && <p className="errorText">{cityError}</p>}
                    </div>
                </div>

                <div className="buttonContainer">
                    <Button variant="outline" onClick={prevStep} className="backButton">
                        <ArrowLeft className="buttonIcon" />
                        Back
                    </Button>
                    <Button onClick={nextStep} disabled={!isFormValid} className="nextButton">
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}