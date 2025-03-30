import { Calendar } from "lucide-react"

export default function ItineraryView({ selectedCity, tripDuration }) {
    return (
        <div className="itineraryContainer">
            <div className="itineraryHeader">
                <h3 className="itineraryTitle">
                    Your {tripDuration}-Day Trip to {selectedCity}
                </h3>
                <p className="itinerarySubtitle">Personalized itinerary powered by AI</p>
            </div>

            <div className="itineraryPlaceholder">
                <Calendar size={40} className="mb-3 mx-auto opacity-50" />
                <p className="itineraryMessage">Your personalized itinerary will be generated here</p>
                <p className="itineraryDescription">
                    We'll create a day-by-day plan for your {tripDuration}-day trip to {selectedCity}, including recommended
                    activities, dining options, and travel tips.
                </p>
                <div className="itineraryGenerateButton">
                    <button className="generateButton" disabled>
                        <span>Generate Itinerary</span>
                    </button>
                </div>
            </div>
        </div>
    )
}