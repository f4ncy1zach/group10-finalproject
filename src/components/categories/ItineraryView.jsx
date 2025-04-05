import { Calendar, MapPin, CheckCircle } from "lucide-react"
import { useState } from "react"
import { createItinerary } from "../api/chatGPT";

export default function ItineraryView({ selectedCity, tripDuration }) {
    const [itinerary, setItinerary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const initializePlan = async()=>{
        setIsLoading(true);
        setError(null);
        
        let trys = 0;
        let found = false;

        while(!found && trys < 2){
            try{
                const result = await createItinerary(selectedCity, tripDuration);
                setItinerary(result);
                
                found = true;
            }catch{
                if(trys < 2){
                    trys+=1;
                    continue;
                }
                setError("Failed to generate itinerary. Please try again.");
            }finally{
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="itineraryContainer">
            <div className="itineraryHeader">
                <h3 className="itineraryTitle">
                    Your {tripDuration}-Day Trip to {selectedCity}
                </h3>
                <p className="itinerarySubtitle">Personalized itinerary powered by AI</p>
            </div>

            {!itinerary ?
                <div className="itineraryPlaceholder">
                    <Calendar size={40} className="mb-3 mx-auto opacity-50" />
                    <p className="itineraryMessage">Your personalized itinerary will be generated here</p>
                    <p className="itineraryDescription">
                        We'll create a day-by-day plan for your {tripDuration}-day trip to {selectedCity}, including recommended
                        activities, dining options, and travel tips.
                    </p>
                    {error && <p className="itineraryError">{error}</p>}
                    <div className="itineraryGenerateButton">
                        <button className={`generateButton ${isLoading ? 'loading' : ''}`} 
                                onClick={initializePlan}
                                disabled={isLoading}
                        >
                            <span>{isLoading ? 'Generating...' : 'Generate Itinerary'}</span>
                        </button>
                    </div>
                </div>
            :
                <div className="itineraryResults">
                    {itinerary.map((day) => (
                        <div key={day.Day} className="itineraryDay">
                            <h4 className="dayTitle">Day {day.Day}</h4>
                            <div className="dayContent">
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
                            className="resetButton"
                            onClick={() => setItinerary(null)}
                        >
                            Create Another Itinerary
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}