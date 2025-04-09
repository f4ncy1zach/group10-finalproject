import { useState, useEffect } from "react"
import { getAggregatedLocationData } from "@/components/api/tripAdvisorService.js"
import ReloadButton from "../ui/reload-button"
import { Utensils } from "lucide-react"
import "@/styles/resultPageStyles.css"

/**
 * RestaurantsList Component
 * Displays a list of restaurants for the selected destination
 * Fetches data from TripAdvisor API and handles loading/error states
 *
 * @param {Object} props - Component props
 * @param {string} props.destinationCity - The selected city
 * @param {string} props.destinationCountry - The selected country
 * @returns {JSX.Element} The restaurants list component
 */
export default function RestaurantsList({ destinationCity, destinationCountry }) {
    // State for restaurants data
    const [restaurants, setRestaurants] = useState([])
    // Loading state for API calls
    const [restaurantsLoading, setRestaurantsLoading] = useState(false)
    // Error state for API failures
    const [restaurantsError, setRestaurantsError] = useState(null)

    /**
     * Handles manual refresh of restaurants data
     * Resets state and triggers a new API call
     */
    const refreshRestaurants = () => {
        setRestaurants([])
        setRestaurantsError(null)
        setRestaurantsLoading(true)
        fetchRestaurants()
    }

    /**
     * Fetches restaurant data from the TripAdvisor API
     * Updates state with results, loading status, and any errors
     */
    const fetchRestaurants = async () => {
        if (!destinationCity || !destinationCountry) return

        setRestaurantsLoading(true)
        setRestaurantsError(null)

        try {
            const response = await getAggregatedLocationData(destinationCity + "," + destinationCountry, "restaurants")
            if (response.data) {
                setRestaurants(response.data)
            } else {
                setRestaurantsError("No restaurant information found")
            }
        } catch (error) {
            setRestaurantsError("Error occurred while fetching restaurant data")
        } finally {
            setRestaurantsLoading(false)
        }
    }

    /**
     * Effect to fetch restaurants when destination changes
     */
    useEffect(() => {
        fetchRestaurants()
    }, [destinationCity, destinationCountry])

    /**
     * Renders star rating based on numeric rating value
     *
     * @param {number} rating - Rating value (0-5)
     * @returns {JSX.Element[]} Array of star elements
     */
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

    /**
     * Gets description text for a restaurant
     * Falls back to default text if no description is available
     *
     * @param {Object} restaurant - Restaurant data object
     * @returns {string} Description text
     */
    const getDescription = (restaurant) => {
        const defaultDesc = `A charming restaurant in ${destinationCity} offering delicious cuisine and a welcoming atmosphere.`
        const description = restaurant.description || restaurant.locationDetails?.description || defaultDesc
        return description
    }

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton onClick={refreshRestaurants} isLoading={restaurantsLoading} />
            </div>

            {restaurantsLoading ? (
                // Loading state
                <div className="loadingMessage">Loading restaurants...</div>
            ) : restaurantsError ? (
                // Error state
                <div className="errorMessage">{restaurantsError}</div>
            ) : restaurants.length === 0 ? (
                // Empty state
                <div className="noDataMessage">No restaurants found</div>
            ) : (
                // Map through restaurants and render each one
                restaurants.map((restaurant, index) => (
                    <div key={`restaurant-${index}`} className="listingCard">
                        <div className="listingImage">
                            {restaurant.locationPhotos?.[0]?.images?.medium?.url ? (
                                <img
                                    src={restaurant.locationPhotos[0].images.medium.url || "/placeholder.svg"}
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
                                <p className="listingAddress">{restaurant.address_obj?.address_string || "Address not available"}</p>
                                <div className="listingRating">
                                    <div className="stars">{renderStars(Number.parseFloat(restaurant.rating || 0))}</div>
                                    <span className="ratingText">
                    {restaurant.rating || "0.0"}/5.0 ({restaurant.num_reviews || 0} reviews)
                  </span>
                                </div>
                                <p className="listingPhone">{restaurant.phone || "Phone not available"}</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>{getDescription(restaurant)}</p>
                                </div>
                                <div className="listingFeatures">
                                    <h4>Style</h4>
                                    <ul className="featuresList">
                                        {/* Display cuisine types if available */}
                                        {restaurant.cuisine && restaurant.cuisine.map((cuisine, idx) => <li key={idx}>{cuisine.name}</li>)}
                                        {/* Display dietary restrictions if available */}
                                        {restaurant.dietary_restrictions &&
                                            restaurant.dietary_restrictions.map((diet, idx) => <li key={`diet-${idx}`}>{diet.name}</li>)}
                                        {/* Fallback features if no data available */}
                                        {!restaurant.cuisine && !restaurant.dietary_restrictions && (
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