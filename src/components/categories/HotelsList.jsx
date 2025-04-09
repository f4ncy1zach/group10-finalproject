import { useState, useEffect } from "react"
import { getAggregatedLocationData } from "@/components/api/tripAdvisorService.js"
import ReloadButton from "../ui/reload-button"
import { Luggage } from "lucide-react"
import "@/styles/resultPageStyles.css"

/**
 * HotelsList Component
 * Displays a list of hotels for the selected destination
 * Fetches data from TripAdvisor API and handles loading/error states
 *
 * @param {Object} props - Component props
 * @param {string} props.destinationCity - The selected city
 * @param {string} props.destinationCountry - The selected country
 * @returns {JSX.Element} The hotels list component
 */
export default function HotelsList({ destinationCity, destinationCountry }) {
    // State for hotels data
    const [hotels, setHotels] = useState([])
    // Loading state for API calls
    const [hotelsLoading, setHotelsLoading] = useState(false)
    // Error state for API failures
    const [hotelsError, setHotelsError] = useState(null)

    /**
     * Handles manual refresh of hotels data
     * Resets state and triggers a new API call
     */
    const refreshHotels = () => {
        setHotels([])
        setHotelsError(null)
        setHotelsLoading(true)
        fetchHotels()
    }

    /**
     * Fetches hotel data from the TripAdvisor API
     * Updates state with results, loading status, and any errors
     */
    const fetchHotels = async () => {
        if (!destinationCity || !destinationCountry) return

        setHotelsLoading(true)
        setHotelsError(null)

        try {
            const response = await getAggregatedLocationData(destinationCity + "," + destinationCountry, "hotels")
            if (response.data) {
                setHotels(response.data)
            } else {
                setHotelsError("No hotel information found")
            }
        } catch (error) {
            setHotelsError("Error occurred while fetching hotel data")
        } finally {
            setHotelsLoading(false)
        }
    }

    /**
     * Effect to fetch hotels when destination changes
     */
    useEffect(() => {
        fetchHotels()
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
     * Gets description text for a hotel
     * Falls back to default text if no description is available
     *
     * @param {Object} hotel - Hotel data object
     * @returns {string} Description text
     */
    const getDescription = (hotel) => {
        const defaultDesc = `A beautiful hotel located in the heart of ${destinationCity}. Offering comfortable rooms and excellent service.`
        const description = hotel.description || hotel.locationDetails?.description || defaultDesc
        return description
    }

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton onClick={refreshHotels} isLoading={hotelsLoading}/>
            </div>

            {hotelsLoading ? (
                // Loading state
                <div className="loadingMessage">Loading hotels...</div>
            ) : hotelsError ? (
                // Error state
                <div className="errorMessage">{hotelsError}</div>
            ) : hotels.length === 0 ? (
                // Empty state
                <div className="noDataMessage">No hotels found</div>
            ) : (
                // Map through hotels and render each one
                hotels.map((hotel, index) => (
                    <div key={`hotel-${index}`} className="listingCard">
                        <div className="listingImage">
                            {hotel.locationPhotos?.[0]?.images?.medium?.url ? (
                                <img
                                    src={hotel.locationPhotos[0].images.medium.url || "/placeholder.svg"}
                                    alt={hotel.name}
                                    className="listingImage"
                                />
                            ) : (
                                <div className="imagePlaceholder">
                                    <Luggage size={30} className="placeholderIcon"/>
                                </div>
                            )}
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">{hotel.name}</h3>
                                <p className="listingAddress">{hotel.address_obj?.address_string || "Address not available"}</p>
                                <div className="listingRating">
                                    <div className="stars">{renderStars(Number.parseFloat(hotel.rating || 0))}</div>
                                    <span className="ratingText">
                    {hotel.rating || "0.0"}/5.0 ({hotel.num_reviews || 0} reviews)
                  </span>
                                </div>
                                <p className="listingPrice">{hotel.price_level || "Price not available"}</p>
                                <p className="listingPhone">{hotel.phone || "Phone not available"}</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>{getDescription(hotel)}</p>
                                </div>
                                <div className="listingFeatures  scrollable-features">
                                    <h4>Features</h4>
                                    <ul className="featuresList">
                                        {/* Display amenities if available */}
                                        {(hotel.amenities || hotel.locationDetails?.amenities || []).slice(0, 4).map((amenity, index) => (
                                            <li key={index}>{amenity}</li>
                                        ))}
                                        {/* Fallback features if no data available */}
                                        {!hotel.amenities && !hotel.locationDetails?.amenities && (
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