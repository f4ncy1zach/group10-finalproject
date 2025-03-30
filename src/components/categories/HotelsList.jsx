import { useState } from "react"
import { Luggage } from "lucide-react"
import ReloadButton from "../ui/reload-button"

export default function HotelsList({ selectedCity }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleReload = () => {
        setIsLoading(true)
        // Simulate loading
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
                // Vary the rating slightly for each hotel
                const rating = 4.0 + (index % 3) * 0.5

                return (
                    <div key={`hotel-${index}`} className="listingCard">
                        <div className="listingImage">
                            <div className="imagePlaceholder">
                                <Luggage size={30} className="placeholderIcon" />
                            </div>
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">Hotel {index + 1}</h3>
                                <p className="listingAddress">123 Main Street, {selectedCity}</p>
                                <div className="listingRating">
                                    <div className="stars">{renderStars(rating)}</div>
                                    <span className="ratingText">
                    {rating.toFixed(1)}/5.0 ({80 + index * 10} reviews)
                  </span>
                                </div>
                                <p className="listingPrice">${100 + index * 50}/night</p>
                                <p className="listingPhone">+1 (555) 123-45{index}0</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>
                                        A beautiful hotel located in the heart of {selectedCity}. Offering comfortable rooms and excellent
                                        service.
                                    </p>
                                </div>
                                <div className="listingFeatures scrollable-features">
                                    <h4>Features</h4>
                                    <ul className="featuresList">
                                        <li>Free WiFi</li>
                                        <li>Swimming Pool</li>
                                        <li>Fitness Center</li>
                                        <li>Restaurant</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}