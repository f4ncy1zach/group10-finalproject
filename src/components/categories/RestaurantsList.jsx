// Restaurants list in result page
import { useState, useEffect } from "react"
import { getAggregatedLocationData } from "@/utils/tripAdvisorService.js"
import ReloadButton from "../ui/reload-button"
import { Utensils } from "lucide-react"
import '@/styles/resultPageStyles.css';

export default function RestaurantsList({ destinationCity, destinationCountry }) {
    const [restaurants, setRestaurants] = useState([])
    const [restaurantsLoading, setRestaurantsLoading] = useState(false)
    const [restaurantsError, setRestaurantsError] = useState(null)

    const refreshRestaurants = () => {
        setRestaurants([]);
        setRestaurantsError(null);
        setRestaurantsLoading(true);
        fetchRestaurants();
    };

    const fetchRestaurants = async () => {
        if (!destinationCity || !destinationCountry) return;
        
        setRestaurantsLoading(true);
        setRestaurantsError(null);
        
        try {
            const response = await getAggregatedLocationData(destinationCity+','+destinationCountry, 'restaurants');
            if (response.data) {
                setRestaurants(response.data);
            } else {
                setRestaurantsError('No restaurant information found');
            }
        } catch (error) {
            console.error('Failed to fetch restaurant data:', error);
            setRestaurantsError('Error occurred while fetching restaurant data');
        } finally {
            setRestaurantsLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, [destinationCity, destinationCountry]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            if (i < Math.floor(rating)) {
                return (
                    <span key={i} className="star star-full">
                        ★
                    </span>
                )
            } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                return (
                    <span key={i} className="star star-half">
                        ☆<span className="half-star">★</span>
                    </span>
                )
            } else {
                return (
                    <span key={i} className="star">
                        ☆
                    </span>
                )
            }
        })
    }

    const getDescription = (restaurant) => {
        const defaultDesc = `A charming restaurant in ${destinationCity} offering delicious cuisine and a welcoming atmosphere.`;
        const description = restaurant.description || restaurant.locationDetails?.description || defaultDesc;
        return description;
    };

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton 
                    onClick={refreshRestaurants} 
                    isLoading={restaurantsLoading}
                />
            </div>

            {restaurantsLoading ? (
                <div className="loadingMessage">Loading restaurants...</div>
            ) : restaurantsError ? (
                <div className="errorMessage">{restaurantsError}</div>
            ) : restaurants.length === 0 ? (
                <div className="noDataMessage">No restaurants found</div>
            ) : (
                restaurants.map((restaurant, index) => (
                    <div key={`restaurant-${index}`} className="listingCard">
                        <div className="listingImage">
                            {restaurant.locationPhotos?.[0]?.images?.medium?.url ? (
                                <img 
                                    src={restaurant.locationPhotos[0].images.medium.url} 
                                    alt={restaurant.name}
                                    className="listingImage"
                                />
                            ) : (
                                <div className="imagePlaceholder">
                                    <Utensils size={30} className="placeholderIcon" />
                                </div>
                            )}
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">{restaurant.name}</h3>
                                <p className="listingAddress">{restaurant.address_obj?.address_string || 'Address not available'}</p>
                                <div className="listingRating">
                                    <div className="stars">
                                        {renderStars(parseFloat(restaurant.rating || 0))}
                                    </div>
                                    <span className="ratingText">
                                        {restaurant.rating || '0.0'}/5.0 ({restaurant.num_reviews || 0} reviews)
                                    </span>
                                </div>
                                {/* <p className="listingPrice">{restaurant.price_level || 'Price not available'}</p> */}
                                <p className="listingPhone">{restaurant.phone || 'Phone not available'}</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>
                                        {getDescription(restaurant)}
                                    </p>
                                </div>
                                <div className="listingFeatures">
                                    <h4>Style</h4>
                                    <ul className="featuresList">
                                        {restaurant.cuisine && restaurant.cuisine.map((cuisine, idx) => (
                                            <li key={idx}>{cuisine.name}</li>
                                        ))}
                                        {restaurant.dietary_restrictions && restaurant.dietary_restrictions.map((diet, idx) => (
                                            <li key={`diet-${idx}`}>{diet.name}</li>
                                        ))}
                                        {(!restaurant.cuisine && !restaurant.dietary_restrictions) && (
                                            <>
                                                <li>Outdoor Seating</li>
                                                <li>Takeaway Available</li>
                                                <li>Reservations</li>
                                                <li>Full Bar</li>
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