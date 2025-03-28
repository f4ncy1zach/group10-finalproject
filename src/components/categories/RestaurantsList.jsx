export default function RestaurantsList({ selectedCity }) {
    return (
        <div className="listingsContainer">
            {[...Array(6)].map((_, index) => (
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
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < 5 - index * 0.5 ? "star filled" : "star"}>
                      ★
                    </span>
                                    ))}
                                </div>
                                <span className="ratingText">
                  {5 - index * 0.5}/5.0 ({90 + index * 20} reviews)
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
                                    A {index < 3 ? "high-end" : "cozy"} restaurant serving {index % 2 === 0 ? "local" : "international"}{" "}
                                    cuisine with a modern twist.
                                </p>
                            </div>
                            <div className="listingFeatures">
                                <h4>Features</h4>
                                <ul className="featuresList">
                                    <li>{index % 2 === 0 ? "Outdoor" : "Indoor"} Seating</li>
                                    <li>Reservations {index < 4 ? "Required" : "Recommended"}</li>
                                    <li>{index < 3 ? "Full Bar" : "BYOB"}</li>
                                    <li>{index % 2 === 0 ? "Vegan Options" : "Gluten-Free Options"}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}