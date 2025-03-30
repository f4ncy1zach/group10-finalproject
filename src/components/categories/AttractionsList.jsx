// Attractions list in result page
import { useState } from "react"
import { Landmark } from "lucide-react"
import ReloadButton from "../ui/reload-button"

export default function AttractionsList({ selectedCity }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleReload = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    // Function to render stars based on rating
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

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton onClick={handleReload} isLoading={isLoading} />
            </div>

            {[...Array(6)].map((_, index) => {
                const rating = 4.5 - index * 0.5

                return (
                    <div key={`attraction-${index}`} className="listingCard">
                        <div className="listingImage">
                            <div className="imagePlaceholder">
                                <Landmark size={30} className="placeholderIcon" />
                            </div>
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">
                                    {selectedCity} Attraction {index + 1}
                                </h3>
                                <p className="listingAddress">
                                    {456 + index * 10} Tourist Avenue, {selectedCity}
                                </p>
                                <div className="listingRating">
                                    <div className="stars">{renderStars(rating)}</div>
                                    <span className="ratingText">
                    {rating.toFixed(1)}/5.0 ({120 + index * 15} reviews)
                  </span>
                                </div>
                                <p className="listingPrice">${15 + index * 5} per person</p>
                                <p className="listingPhone">+1 (555) 789-{index}123</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>
                                        A popular tourist destination in {selectedCity}. Known for its cultural significance and beautiful
                                        views.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}