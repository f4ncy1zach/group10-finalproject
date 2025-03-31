// Hotels list in result page
import { useState, useEffect } from "react"
import { getAggregatedLocationData } from "@/utils/tripAdvisorService.js"
import ReloadButton from "../ui/reload-button"
import { Luggage } from "lucide-react"
import '@/styles/resultPageStyles.css';

export default function HotelsList({ destinationCity, destinationCountry }) {
    const [hotels, setHotels] = useState([])
    const [hotelsLoading, setHotelsLoading] = useState(false)
    const [hotelsError, setHotelsError] = useState(null)

    const refreshHotels = () => {
        setHotels([]);
        setHotelsError(null);
        setHotelsLoading(true);
        fetchHotels();
    };

    const fetchHotels = async () => {
        console.log("fetchHotels",destinationCity,destinationCountry);
        if (!destinationCity || !destinationCountry) return;
        
        setHotelsLoading(true);
        setHotelsError(null);
        
        try {
            const response = await getAggregatedLocationData(destinationCity+','+destinationCountry, 'hotels');
            if (response.data) {
                setHotels(response.data);
            } else {
                setHotelsError('No hotel information found');
            }
        } catch (error) {
            console.error('Failed to fetch hotel data:', error);
            setHotelsError('Error occurred while fetching hotel data');
        } finally {
            setHotelsLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [destinationCity, destinationCountry]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            if (i < Math.floor(rating)) {
                // Full star
                return (
                    <span key={i} className="star star-full">
                        ★
                    </span>
                )
            } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                // Half star
                return (
                    <span key={i} className="star star-half">
                        ☆<span className="half-star">★</span>
                    </span>
                )
            } else {
                // Empty star
                return (
                    <span key={i} className="star">
                        ☆
                    </span>
                )
            }
        })
    }

    const getDescription = (hotel) => {
        const defaultDesc = `A beautiful hotel located in the heart of ${destinationCity}. Offering comfortable rooms and excellent service.`;
        const description = hotel.description || hotel.locationDetails?.description || defaultDesc;
        return description;
    };

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton 
                    onClick={refreshHotels} 
                    isLoading={hotelsLoading}
                />
            </div>

            {hotelsLoading ? (
                <div className="loadingMessage">Loading hotels...</div>
            ) : hotelsError ? (
                <div className="errorMessage">{hotelsError}</div>
            ) : hotels.length === 0 ? (
                <div className="noDataMessage">No hotels found</div>
            ) : (
                hotels.map((hotel, index) => (
                    <div key={`hotel-${index}`} className="listingCard">
                        <div className="listingImage">
                            {hotel.locationPhotos?.[0]?.images?.medium?.url ? (
                                <img 
                                    src={hotel.locationPhotos[0].images.medium.url} 
                                    alt={hotel.name}
                                    className="listingImage"
                                />
                            ) : (
                                <div className="imagePlaceholder">
                                    <Luggage size={30} className="placeholderIcon" />
                                </div>
                            )}
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">{hotel.name}</h3>
                                <p className="listingAddress">{hotel.address_obj?.address_string || 'Address not available'}</p>
                                <div className="listingRating">
                                    <div className="stars">
                                        {renderStars(parseFloat(hotel.rating || 0))}
                                    </div>
                                    <span className="ratingText">
                                        {hotel.rating || '0.0'}/5.0 ({hotel.num_reviews || 0} reviews)
                                    </span>
                                </div>
                                <p className="listingPrice">{hotel.price_level || '/Night'}</p> 
                                <p className="listingPhone">{hotel.phone || 'Phone not available'}</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>
                                        {getDescription(hotel)}
                                    </p>
                                </div>
                                <div className="listingFeatures  scrollable-features">
                                    <h4>Features</h4>
                                    <ul className="featuresList">
                                        {(hotel.amenities || hotel.locationDetails?.amenities || [])
                                            .slice(0, 4)
                                            .map((amenity, index) => (
                                                <li key={index}>{amenity}</li>
                                            ))}
                                        {(!hotel.amenities && !hotel.locationDetails?.amenities) && (
                                            <>
                                                <li>Free WiFi</li>
                                                <li>Swimming Pool</li>
                                                <li>Fitness Center</li>
                                                <li>Restaurant</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}