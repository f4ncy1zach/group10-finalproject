/**
 * ResultsPage Component
 * Displays the final travel plan with destination details and category tabs
 * Shows destination image, trip summary, and description
 * Handles AI recommendation processing if selected
 *
 * @param {Object} props - Component props
 * @param {boolean} props.useAiRecommendation - Whether AI recommendation was selected
 * @param {string} props.destinationCity - Selected destination city
 * @param {Function} props.setDestinationCity - Function to update destination city
 * @param {string} props.destinationCountry - Selected destination country
 * @param {Function} props.setDestinationCountry - Function to update destination country
 * @param {Array} props.travelers - Array of traveler objects with passport and visa info
 * @param {number} props.budget - Trip budget amount
 * @param {Date} props.departDate - Selected departure date
 * @param {Date} props.returnDate - Selected return date
 * @param {Function} props.calculateTripDuration - Function to calculate trip duration
 * @param {Function} props.prevStep - Function to go back to previous step
 * @param {Function} props.resetForm - Function to reset the form and start over
 * @param {string} props.activeCategory - Currently selected category tab
 * @param {Function} props.setActiveCategory - Function to change the active category
 * @returns {JSX.Element} The results page component
 */
// Result page, showing destination image, trip summary, destination description, and 4 category tabs
import { motion } from "framer-motion"
import { MapPin, Globe, ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import { format } from "date-fns"
import CategoryTabs from "./categories/CategoryTabs"
import { checkSpelling, getDestination, getGeneralInformation } from "./api/chatGPT"
import { getCityInfo } from "./api/tripAdvisorService"
import { useState, useEffect } from "react"

export default function ResultsPage({
                                        useAiRecommendation,
                                        destinationCity,
                                        setDestinationCity,
                                        destinationCountry,
                                        setDestinationCountry,
                                        travelers,
                                        departDate,
                                        returnDate,
                                        calculateTripDuration,
                                        prevStep,
                                        resetForm,
                                        activeCategory,
                                        setActiveCategory,
                                    }) {
    // State for city information data, loading status, and errors
    const [cityInfo, setCityInfo] = useState(null)
    const [cityInfoLoading, setCityInfoLoading] = useState(false)
    const [cityInfoError, setCityInfoError] = useState(null)

    /**
     * Fetches city information from TripAdvisor API
     * If AI recommendation is enabled, gets destination from ChatGPT
     * Otherwise, checks spelling of user-entered destination
     * Then fetches city details and description
     */
    const fetchCityInfo = async () => {
        // Set loading state
        setCityInfoLoading(true)
        setCityInfoError(null)

        // Handle AI recommendation vs. manual destination entry
        if (useAiRecommendation == true) {
            // AI recommendation flow - get destination from ChatGPT
            let trys = 0
            let found = false

            // Retry logic - attempts up to 2 times to get a destination
            while (!found && trys < 2) {
                try {
                    if (!travelers) return

                    // Prepare prompt with traveler information
                    const prompt = {
                        "No. of travelers": travelers.length,
                        "Traveler(s) information": travelers,
                        "Departure Date": departDate,
                        "Return Date": returnDate,
                    }

                    // Get destination recommendation from ChatGPT
                    const response = await getDestination(prompt)

                    // Update local variables
                    destinationCity = response["data"]["state"]
                    destinationCountry = response["data"]["location"]

                    // Update parent state
                    setDestinationCountry(response["data"]["location"])
                    setDestinationCity(response["data"]["state"])

                    found = true
                } catch (error) {
                    trys += 1
                    continue
                }
            }
        } else {
            // Manual destination entry flow - check spelling
            if (!destinationCity || !destinationCountry) return

            let trys = 0
            let found = false

            // Retry logic - attempts up to 2 times to check spelling
            while (!found && trys < 2) {
                try {
                    const response = await checkSpelling(destinationCountry, destinationCity)

                    // If correction is needed, update destination values
                    if (response["correction"] == true) {
                        // Update local variables
                        destinationCity = response["data"]["city"]
                        destinationCountry = response["data"]["location"]

                        // Update parent state
                        setDestinationCountry(response["data"]["location"])
                        setDestinationCity(response["data"]["city"])
                    }

                    found = true
                } catch (error) {
                    trys += 1
                    continue
                }
            }
        }

        // Fetch city information from TripAdvisor API
        try {
            const data = await getCityInfo(destinationCity, destinationCity)
            if (data) {
                // If description is missing, get it from ChatGPT
                if (data.locationDetails?.description == undefined) {
                    try {
                        const response = await getGeneralInformation(destinationCity)
                        data.locationDetails.description = response
                    } catch (error) {
                    }
                }
                setCityInfo(data)
            } else {
                setCityInfoError("Does Not Find City Detail")
            }
        } catch (error) {
            setCityInfoError("An error occurred while getting city information")
        } finally {
            setCityInfoLoading(false)
        }
    }

    /**
     * Effect to fetch city information when component mounts
     * Triggers the API calls to get destination details
     */
    useEffect(() => {
        fetchCityInfo()
    }, [])

    return (
        <div className="resultsPageContainer">
            {/* Page header with title */}
            <div className="resultsHeader">
                <motion.h2
                    data-test="Results-Text"
                    className="resultsTitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {useAiRecommendation ? "THE DESTINATION DESIGNATED FOR YOU AWAITS" : "YOUR DESIRED DESTINATION AWAITS"}
                </motion.h2>
            </div>

            <div className="resultsMainContent">
                {/* Left side - Destination image with loading/error states */}
                <motion.div
                    className="destinationImageContainer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {cityInfoLoading ? (
                        // Loading state
                        <div className="destinationImagePlaceholder">
                            <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                            <p>Loading destination image...</p>
                        </div>
                    ) : cityInfoError ? (
                        // Error state
                        <div className="destinationImagePlaceholder">
                            <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                            <p>Failed to load destination image</p>
                        </div>
                    ) : cityInfo?.locationPhotos?.[0] ? (
                        // Image available
                        <img
                            src={cityInfo.locationPhotos[0].images.large.url || "/placeholder.svg"}
                            alt={destinationCity}
                            className="destinationImage"
                        />
                    ) : (
                        // No image available
                        <div className="destinationImagePlaceholder">
                            <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                            <p>No image available</p>
                            <p className="text-sm mt-2">
                                {destinationCity}, {destinationCountry}
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Right side - Trip summary and destination description */}
                <motion.div
                    className="destinationInfo"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {/* Trip summary section */}
                    <div className="tripSummary">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Trip Summary</h3>

                        {/* Only show travelers count if AI recommendation was used */}
                        {useAiRecommendation && (
                            <div className="summaryItem">
                                <div className="summaryLabel">Travelers:</div>
                                <div data-test="Traveler-Number" className="summaryValue">
                                    {travelers.length} {travelers.length === 1 ? "person" : "people"}
                                </div>
                            </div>
                        )}

                        {/* Destination information */}
                        <div className="summaryItem">
                            <div className="summaryLabel">Destination:</div>
                            <div className="summaryValue">
                                {destinationCity}, {destinationCountry}
                            </div>
                        </div>

                        {/* Travel dates */}
                        <div className="summaryItem">
                            <div className="summaryLabel">Travel Dates:</div>
                            <div data-test="Travel-Date" className="summaryValue">
                                {departDate && format(departDate, "MMM d, yyyy")} - {returnDate && format(returnDate, "MMM d, yyyy")}
                            </div>
                        </div>

                        {/* Trip duration */}
                        <div className="summaryItem">
                            <div className="summaryLabel">Duration:</div>
                            <div data-test="Travel-Duration" className="summaryValue">{calculateTripDuration()} days</div>
                        </div>
                    </div>

                    {/* Destination description section with loading/error states */}
                    <div className="destinationDescription">
                        {cityInfoLoading ? (
                            // Loading state
                            <div className="descriptionPlaceholder">
                                <Globe size={40} className="mb-3 mx-auto opacity-50" />
                                <p>Loading destination description...</p>
                            </div>
                        ) : cityInfoError ? (
                            // Error state
                            <div className="descriptionPlaceholder">
                                <Globe size={40} className="mb-3 mx-auto opacity-50" />
                                <p>Failed to load destination description</p>
                            </div>
                        ) : cityInfo?.locationDetails?.description ? (
                            // Description available
                            <div className="descriptionContent">
                                <h3 className="text-lg font-semibold mb-2">About {destinationCity}</h3>
                                <p className="text-gray-600">{cityInfo.locationDetails.description}</p>
                            </div>
                        ) : (
                            // No description available
                            <div className="descriptionPlaceholder">
                                <Globe size={40} className="mb-3 mx-auto opacity-50" />
                                <p>No description available</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Separator between upper section and categories */}
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
                    destinationCity={destinationCity}
                    destinationCountry={destinationCountry}
                    calculateTripDuration={calculateTripDuration}
                />
            </motion.div>

            {/* Action buttons for navigation */}
            <div className="resultsActions">
                <Button data-test="Results-Back" variant="outline" onClick={prevStep} className="backButton">
                    <ArrowLeft className="buttonIcon" />
                    Back
                </Button>
                <Button onClick={resetForm} data-test="Start-Over" className="nextButton">
                    Start Over
                </Button>
            </div>
        </div>
    )
}