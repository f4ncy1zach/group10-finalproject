// Restaurants list in result page
import { useState } from "react"
import ReloadButton from "../ui/reload-button"
import { Select } from "../ui/select"

export default function RestaurantsList({ selectedCity }) {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState(null)

    const hotelOptions = [
        { value: "hotel1", label: "Hotel 1" },
        { value: "hotel2", label: "Hotel 2" },
        { value: "hotel3", label: "Hotel 3" },
        { value: "hotel4", label: "Hotel 4" },
        { value: "hotel5", label: "Hotel 5" },
        { value: "hotel6", label: "Hotel 6" },
    ]

    const handleReload = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    const handleHotelChange = (option) => {
        setSelectedHotel(option)
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
                <Select
                    options={hotelOptions}
                    onChange={handleHotelChange}
                    placeholder="Select hotel"
                    className="hotelSelect"
                />
            </div>

            {[...Array(6)].map((_, index) => {
                const rating = 5 - index * 0.5

                return (
                    <div key={`restaurant-${index}`} className="listingCard">
                        <div className="listingImage">
                            <div className="imagePlaceholder">
                                <div className="placeholderIcon">🍽️</div>
                            </div>
                        </div>
                        <div className="listingDetails">
                            <div className="listingMainInfo">
                                <h3 className="listingName">
                                    {selectedCity} Restaurant {index + 1}
                                </h3>
                                <p className="listingAddress">
                                    {789 + index * 10} Dining Street, {selectedCity}
                                </p>
                                <div className="listingRating">
                                    <div className="stars">{renderStars(rating)}</div>
                                    <span className="ratingText">
                    {rating.toFixed(1)}/5.0 ({90 + index * 20} reviews)
                  </span>
                                </div>
                                <p className="listingPrice">
                                    {index < 2 ? "$$$" : index < 4 ? "$$" : "$"} • {index < 3 ? "Fine Dining" : "Casual"}
                                </p>
                                <p className="listingPhone">+1 (555) 456-78{index}9</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>
                                        A {index < 3 ? "high-end" : "cozy"} restaurant serving {index % 2 === 0 ? "local" : "international"}
                                        cuisine with a modern twist.
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