import { Landmark } from "lucide-react"

export default function AttractionsList({ selectedCity }) {
    return (
        <div className="listingsContainer">
            {[...Array(6)].map((_, index) => (
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
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < 4.5 - index * 0.5 ? "star filled" : "star"}>
                      ★
                    </span>
                                    ))}
                                </div>
                                <span className="ratingText">
                  {4.5 - index * 0.5}/5.0 ({120 + index * 15} reviews)
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
                            <div className="listingFeatures">
                                <h4>Features</h4>
                                <ul className="featuresList">
                                    <li>Guided Tours</li>
                                    <li>Gift Shop</li>
                                    <li>Photo Spots</li>
                                    <li>Accessible</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}