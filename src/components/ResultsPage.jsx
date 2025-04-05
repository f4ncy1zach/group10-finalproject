// Result page, showing destination image, trip summary, destination description, and 4 category tabs
import { motion } from "framer-motion"
import { MapPin, Globe, ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import { format } from "date-fns"
import CategoryTabs from "./categories/CategoryTabs"
import { checkSpelling, createItinerary, getDestination, getGeneralInformation } from "./api/chatGPT"
import { getCityInfo } from "./api/tripAdvisorService"
import { useState, useEffect } from "react"

export default function ResultsPage({
                                        useAiRecommendation,
                                        destinationCity,
                                        setDestinationCity,
                                        destinationCountry,
                                        setDestinationCountry,
                                        travelers,
                                        budget,
                                        departDate,
                                        returnDate,
                                        calculateTripDuration,
                                        prevStep,
                                        resetForm,
                                        activeCategory,
                                        setActiveCategory,
                                    }) 
{
    // Adding City information status
    const [cityInfo, setCityInfo] = useState(null);
    const [cityInfoLoading, setCityInfoLoading] = useState(false);
    const [cityInfoError, setCityInfoError] = useState(null);
    
    const fetchCityInfo = async () => {
        setCityInfoLoading(true);
        setCityInfoError(null);

        let country;
        let city;
        
        //checks if useAiRecommendation is true or not
        // if yes make chatGPT set destinationCity and destinationCountry if not keep whatever the user entered.
        if(useAiRecommendation == true){
            let trys = 0;
            let found = false;
            while(!found && trys < 2){
                try{
                    if(!travelers) return;
                    let prompt = {
                        "No. of travelers": travelers.length,
                        "Traveler(s) information": travelers,
                        "Departure Date": departDate,
                        "Return Date": returnDate,
                    };
                    const response = await getDestination(prompt);
                    
                    //update local
                    destinationCity = response["data"]["state"];
                    destinationCountry = response["data"]["location"];
                    
                    //update parent
                    setDestinationCountry(response["data"]["location"]);
                    setDestinationCity(response["data"]["state"]);

                    found = true;
                }catch(error){
                    trys += 1;
                    continue;
                }
            }
        }else{
            if (!destinationCity || !destinationCountry) return;
            
            let trys = 0;
            let found = false;
            while(!found && trys < 2){
                try{
                    const response = await checkSpelling(destinationCountry, destinationCity);

                    console.log(response);
                    if(response["correction"] == true){
                        //update local
                        destinationCity = response["data"]["state"];
                        destinationCountry = response["data"]["location"];
                        
                        //update parent
                        setDestinationCountry(response["data"]["location"]);
                        setDestinationCity(response["data"]["state"]);
                    }

                    found = true;
                }catch(error){
                    trys+=1;
                    continue;
                }
            }
        }

        try {
            const data = await getCityInfo(destinationCity, destinationCity);
            if (data) {
                if(data.locationDetails?.description == undefined){
                    try{
                        const response = await getGeneralInformation(destinationCity);
                        data.locationDetails.description = response;
                    }catch(error){
                        console.log(error);
                    }
                }
                setCityInfo(data);
            } else {
                setCityInfoError('Does Not Find City Detail');
            }
        } catch (error) {
            console.error('Failed to get city information:', error);
            setCityInfoError('An error occurred while getting city information');
        } finally {
            setCityInfoLoading(false);
        }
    };

    // Get city detail
    useEffect(() => {
        fetchCityInfo();
    }, []);

    return (
        <div className="resultsPageContainer">
            <div className="resultsHeader">
                <motion.h2
                    className="resultsTitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {useAiRecommendation ? "THE DESTINATION DESIGNATED FOR YOU AWAITS" : "YOUR DESIRED DESTINATION AWAITS"}
                </motion.h2>
            </div>

            <div className="resultsMainContent">
                {/* Left side - Destination image */}
                <motion.div
                    className="destinationImageContainer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {cityInfoLoading ? (
                        <div className="destinationImagePlaceholder">
                            <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                            <p>Loading destination image...</p>
                        </div>
                    ) : cityInfoError ? (
                        <div className="destinationImagePlaceholder">
                            <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                            <p>Failed to load destination image</p>
                        </div>
                    ) : cityInfo?.locationPhotos?.[0] ? (
                        <img 
                            src={cityInfo.locationPhotos[0].images.large.url} 
                            alt={destinationCity}
                            className="destinationImage"
                        />
                    ) : (
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
                    {/* Trip summary */}
                    <div className="tripSummary">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Trip Summary</h3>

                        {/* Only show travelers count if AI recommendation was used */}
                        {useAiRecommendation && (
                            <div className="summaryItem">
                                <div className="summaryLabel">Travelers:</div>
                                <div className="summaryValue">
                                    {travelers.length} {travelers.length === 1 ? "person" : "people"}
                                </div>
                            </div>
                        )}

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

                    {/* Destination description */}
                    <div className="destinationDescription">
                        {cityInfoLoading ? (
                            <div className="descriptionPlaceholder">
                                <Globe size={40} className="mb-3 mx-auto opacity-50" />
                                <p>Loading destination description...</p>
                            </div>
                        ) : cityInfoError ? (
                            <div className="descriptionPlaceholder">
                                <Globe size={40} className="mb-3 mx-auto opacity-50" />
                                <p>Failed to load destination description</p>
                            </div>
                        ) : cityInfo?.locationDetails?.description ? (
                            <div className="descriptionContent">
                                <h3 className="text-lg font-semibold mb-2">About {destinationCity}</h3>
                                <p className="text-gray-600">{cityInfo.locationDetails.description}</p>
                            </div>
                        ) : (
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

            {/* Action buttons */}
            <div className="resultsActions">
                <Button variant="outline" onClick={prevStep} className="backButton">
                    <ArrowLeft className="buttonIcon" />
                    Back
                </Button>
                <Button onClick={resetForm} className="nextButton">
                    Start Over
                </Button>
            </div>
        </div>
    )
}