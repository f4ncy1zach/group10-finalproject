import { useState, useEffect } from "react"
import { getAggregatedLocationData } from "@/components/api/tripAdvisorService.js"
import ReloadButton from "../ui/reload-button"
import { Landmark } from "lucide-react"
import "@/styles/resultPageStyles.css"

/**
 * AttractionsList Component
 * Displays a list of attractions for the selected destination
 * Fetches data from TripAdvisor API and handles loading/error states
 *
 * @param {Object} props - Component props
 * @param {string} props.destinationCity - The selected city
 * @param {string} props.destinationCountry - The selected country
 * @returns {JSX.Element} The attractions list component
 */
export default function AttractionsList({ destinationCity, destinationCountry }) {
    // State for attractions data
    const [attractions, setAttractions] = useState([])
    // Loading state for API calls
    const [attractionsLoading, setAttractionsLoading] = useState(false)
    // Error state for API failures
    const [attractionsError, setAttractionsError] = useState(null)

    /**
     * Fetches attraction data from the TripAdvisor API
     * Updates state with results, loading status, and any errors
     */
    const fetchAttractions = async () => {
        if (!destinationCity || !destinationCountry) return

        setAttractionsLoading(true)
        setAttractionsError(null)

        try {
            const response = await getAggregatedLocationData(destinationCity + "," + destinationCountry, "attractions")
            if (response.data) {
                setAttractions(response.data)
            } else {
                setAttractionsError("No attraction information found")
            }
        } catch (error) {
            setAttractionsError("Error occurred while fetching attraction data")
        } finally {
            setAttractionsLoading(false)
        }
    }

    /**
     * Effect to fetch attractions when destination changes
     */
    useEffect(() => {
        fetchAttractions()
    }, [destinationCity, destinationCountry])

    /**
     * Handles manual refresh of attractions data
     * Resets state and triggers a new API call
     */
    const refreshAttractions = () => {
        setAttractions([])
        setAttractionsError(null)
        setAttractionsLoading(true)
        fetchAttractions()
    }

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
     * Gets description text for an attraction
     * Falls back to default text if no description is available
     *
     * @param {Object} attraction - Attraction data object
     * @returns {string} Description text
     */
    const getDescription = (attraction) => {
        const defaultDesc = `A fascinating attraction in ${destinationCity}. Experience the local culture and create unforgettable memories.`
        const description = attraction.description || attraction.locationDetails?.description || defaultDesc
        return description
    }

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton onClick={refreshAttractions} isLoading={attractionsLoading} />
            </div>

            {attractionsLoading ? (
                // Loading state
                <div className="loadingMessage">Loading attractions...</div>
            ) : attractionsError ? (
                // Error state
                <div className="errorMessage">{attractionsError}</div>
            ) : attractions.length === 0 ? (
                // Empty state
                <div className="noDataMessage">No attractions found</div>
            ) : (
                // Map through attractions and render each one
                attractions.map((attraction, index) => (
                    <div key={`attraction-${index}`} className="listingCard">
                        <div className="listingImage">
                            {attraction.locationPhotos?.[0]?.images?.medium?.url ? (
                                <img
                                    src={attraction.locationPhotos[0].images.medium.url || "/placeholder.svg"}
                                    alt={attraction.name}
                                    className="listingImage"
                                />
                            ) : (
                                <div className="imagePlaceholder">
                                    <Landmark size={30} className="placeholderIcon" />
                                </div>
                            )}
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">{attraction.name}</h3>
                                <p className="listingAddress">{attraction.address_obj?.address_string || "Address not available"}</p>
                                <div className="listingRating">
                                    <div className="stars">{renderStars(Number.parseFloat(attraction.rating || 0))}</div>
                                    <span className="ratingText">
                    {attraction.rating || "0.0"}/5.0 ({attraction.num_reviews || 0} reviews)
                  </span>
                                </div>
                                <p className="listingPhone">{attraction.phone || "Phone not available"}</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>{getDescription(attraction)}</p>
                                </div>
                                <div className="listingFeatures">
                                    <h4>Features</h4>
                                    <ul className="featuresList">
                                        {/* Display subcategories if available */}
                                        {attraction.subcategory && attraction.subcategory.map((cat, idx) => <li key={idx}>{cat.name}</li>)}
                                        {/* Display amenities if available */}
                                        {attraction.amenities &&
                                            Object.entries(attraction.amenities).map(
                                                ([key, value], idx) => value && <li key={`amenity-${idx}`}>{key.replace(/_/g, " ")}</li>,
                                            )}
                                        {/* Fallback features if no data available */}
                                        {!attraction.subcategory && !attraction.amenities && (
                                            <>
                                                <li>Guided Tours</li>
                                                <li>Photo Spots</li>
                                                <li>Gift Shop</li>
                                                <li>Wheelchair Access</li>
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