import { motion } from "framer-motion"
import { MapPin, Globe, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { format } from "date-fns"
import CategoryTabs from "./categories/CategoryTabs"

export default function ResultsPage({
                                        destinationCity,
                                        destinationCountry,
                                        travelers,
                                        passport,
                                        budget,
                                        origin,
                                        departDate,
                                        returnDate,
                                        calculateTripDuration,
                                        prevStep,
                                        resetForm,
                                        activeCategory,
                                        setActiveCategory,
                                    }) {
    return (
        <div className="resultsPageContainer">
            <div className="resultsHeader">
                <motion.h2
                    className="resultsTitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    YOUR DREAM DESTINATION AWAITS
                </motion.h2>
            </div>

            <div className="resultsMainContent">
                {/* Left side - Destination image placeholder */}
                <motion.div
                    className="destinationImageContainer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="destinationImagePlaceholder">
                        <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                        <p>Destination image will be displayed here</p>
                        <p className="text-sm mt-2">
                            {destinationCity}, {destinationCountry}
                        </p>
                    </div>
                </motion.div>

                {/* Right side - Trip summary and destination description */}
                <motion.div
                    className="destinationInfo"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {/* Trip summary */}
                    <div className="tripSummary">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Trip Summary</h3>

                        <div className="summaryItem">
                            <div className="summaryLabel">Travelers:</div>
                            <div className="summaryValue">
                                {travelers} {travelers === 1 ? "person" : "people"}
                            </div>
                        </div>

                        <div className="summaryItem">
                            <div className="summaryLabel">Passport:</div>
                            <div className="summaryValue">{passport}</div>
                        </div>

                        <div className="summaryItem">
                            <div className="summaryLabel">Budget:</div>
                            <div className="summaryValue">${budget.toLocaleString()} CAD</div>
                        </div>

                        <div className="summaryItem">
                            <div className="summaryLabel">Origin:</div>
                            <div className="summaryValue">{origin}</div>
                        </div>

                        <div className="summaryItem">
                            <div className="summaryLabel">Destination:</div>
                            <div className="summaryValue">
                                {destinationCity}, {destinationCountry}
                            </div>
                        </div>

                        <div className="summaryItem">
                            <div className="summaryLabel">Travel Dates:</div>
                            <div className="summaryValue">
                                {departDate && format(departDate, "MMM d, yyyy")} - {returnDate && format(returnDate, "MMM d, yyyy")}
                            </div>
                        </div>

                        <div className="summaryItem">
                            <div className="summaryLabel">Duration:</div>
                            <div className="summaryValue">{calculateTripDuration()} days</div>
                        </div>
                    </div>

                    {/* Destination description placeholder */}
                    <div className="destinationDescription">
                        <div className="descriptionPlaceholder">
                            <Globe size={40} className="mb-3 mx-auto opacity-50" />
                            <p>Destination description will be loaded here</p>
                            <p className="text-sm mt-2">Information about {destinationCity} will be retrieved from the API</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Added separator between upper section and categories */}
            <div className="categoriesSeparator"></div>

            {/* Category tabs and content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <CategoryTabs
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    selectedCity={destinationCity}
                    calculateTripDuration={calculateTripDuration}
                />
            </motion.div>

            {/* Action buttons */}
            <div className="resultsActions">
                <Button variant="outline" onClick={prevStep} className="backButton">
                    <ArrowLeft className="buttonIcon" />
                    Back
                </Button>
                <Button onClick={resetForm} className="nextButton" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Start Over
                </Button>
            </div>
        </div>
    )
}