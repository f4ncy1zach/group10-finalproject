import { Calendar, MapPin, CheckCircle, Loader } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createItinerary } from "../api/chatGPT"

/**
 * ItineraryView Component
 * Displays and generates AI-powered travel itineraries for the selected city and trip duration
 *
 * @param {Object} props - Component props
 * @param {string} props.selectedCity - The city for which to generate an itinerary
 * @param {number} props.tripDuration - The duration of the trip in days
 * @returns {JSX.Element} The itinerary view component
 */
export default function ItineraryView({ selectedCity, tripDuration }) {
    // State for storing the generated itinerary data
    const [itinerary, setItinerary] = useState(null)
    // Loading state for API calls
    const [isLoading, setIsLoading] = useState(false)
    // Error state for handling API failures
    const [error, setError] = useState(null)
    // Ref for scrolling to top when new itinerary is generated
    const itineraryResultsRef = useRef(null)

    /**
     * Generates a new itinerary using the ChatGPT API
     * Handles loading states and error handling with retry logic
     */
    const initializePlan = async () => {
        setIsLoading(true)
        setError(null)

        let trys = 0
        let found = false

        // Retry logic - attempts up to 2 times to generate an itinerary
        while (!found && trys < 2) {
            try {
                const result = await createItinerary(selectedCity, tripDuration)
                setItinerary(result)
                found = true
            } catch {
                if (trys < 2) {
                    trys += 1
                    continue
                }
                setError("Failed to generate itinerary. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }
    }

    /**
     * Effect to scroll to the top of the itinerary results when a new itinerary is generated
     * Ensures users always see the beginning of the itinerary first
     */
    useEffect(() => {
        if (itinerary && itineraryResultsRef.current) {
            itineraryResultsRef.current.scrollTop = 0
        }
    }, [itinerary])

    return (
        <div className="itineraryContainer">
            <div className="itineraryHeader">
                <h3 className="itineraryTitle">
                    Your {tripDuration}-Day Trip to {selectedCity}
                </h3>
                <p className="itinerarySubtitle">Personalized itinerary powered by AI</p>
            </div>

            {!itinerary ? (
                // Display placeholder or loading state when no itinerary exists
                <div className="itineraryPlaceholder">
                    {isLoading ? (
                        // Loading animation while generating itinerary
                        <div className="loadingAnimation">
                            <Loader size={40} className="loadingIcon" />
                            <p className="loadingText">Generating your personalized itinerary...</p>
                        </div>
                    ) : (
                        // Initial state before generating an itinerary
                        <>
                            <Calendar size={40} className="mb-3 mx-auto opacity-50" />
                            <p className="itineraryMessage">Your personalized itinerary will be generated here</p>
                            <p className="itineraryDescription">
                                We'll create a day-by-day plan for your {tripDuration}-day trip to {selectedCity}, including recommended
                                activities, dining options, and travel tips.
                            </p>
                            {error && <p className="itineraryError">{error}</p>}
                            <div className="itineraryGenerateButton">
                                <button data-test="Itinerary-Button" className="generateButton" onClick={initializePlan} disabled={isLoading}>
                                    <span>Generate Itinerary</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                // Display the generated itinerary
                <div className="itineraryResults" ref={itineraryResultsRef}>
                    {/* Map through each day in the itinerary */}
                    {itinerary.map((day) => (
                        <div key={day.Day} className="itineraryDay">
                            <h4 data-test={`Day-${day.Day}`} className="dayTitle">Day {day.Day}</h4>
                            <div className="dayContent">
                                {/* Map through each activity/location for the day */}
                                {day.Plan.map((item, index) => (
                                    <div key={index} className="itineraryItem">
                                        <div className="itemLocation">
                                            <MapPin size={16} className="locationIcon" />
                                            <span>{item.Location}</span>
                                        </div>
                                        <div className="itemTodo">
                                            <CheckCircle size={16} className="todoIcon" />
                                            <span>{item["To-do"]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="itineraryActions">
                        <button
                            data-test="Another-Itinerary"
                            className="resetButton"
                            onClick={() => {
                                // Clear the current itinerary and generate a new one
                                setItinerary(null)
                                // Immediately start generating a new itinerary
                                initializePlan()
                            }}
                        >
                            Create Another Itinerary
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}