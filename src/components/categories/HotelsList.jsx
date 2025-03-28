import { Luggage } from "lucide-react"

export default function HotelsList({ selectedCity }) {
    return (
        <div className="listingsContainer">
            {[...Array(6)].map((_, index) => (
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
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < 4 ? "star filled" : "star"}>
                      ★
                    </span>
                                    ))}
                                </div>
                                <span className="ratingText">4.0/5.0 ({80 + index * 10} reviews)</span>
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
                            <div className="listingFeatures">
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
            ))}
        </div>
    )
}