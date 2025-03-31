// Attractions list in result page
import { useState, useEffect } from "react"
import { getAggregatedLocationData } from "@/utils/tripAdvisorService.js"
import ReloadButton from "../ui/reload-button"
import { Landmark } from "lucide-react"
import '@/styles/resultPageStyles.css';

export default function AttractionsList({ destinationCity, destinationCountry }) {
    const [attractions, setAttractions] = useState([])
    const [attractionsLoading, setAttractionsLoading] = useState(false)
    const [attractionsError, setAttractionsError] = useState(null)

    // Get Attraction detail
    const fetchAttractions = async () => {
        if (!destinationCity || !destinationCountry) return;
        
        setAttractionsLoading(true);
        setAttractionsError(null);
        
        try {
            const response = await getAggregatedLocationData(destinationCity+','+destinationCountry, 'attractions');
            if (response.data) {
                setAttractions(response.data);
            } else {
                setAttractionsError('No attraction information found');
            }
        } catch (error) {
            console.error('Failed to fetch attraction data:', error);
            setAttractionsError('Error occurred while fetching attraction data');
        } finally {
            setAttractionsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttractions();
    }, [destinationCity, destinationCountry]);

    // refresh
    const refreshAttractions = () => {
        setAttractions([]);
        setAttractionsError(null);
        setAttractionsLoading(true);
        fetchAttractions(); 
    };

    // Rating star
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

    const getDescription = (attraction) => {
        const defaultDesc = `A fascinating attraction in ${destinationCity}. Experience the local culture and create unforgettable memories.`;
        const description = attraction.description || attraction.locationDetails?.description || defaultDesc;
        return description;
    };

    return (
        <div className="listingsContainer">
            <div className="listingsHeader">
                <ReloadButton 
                    onClick={refreshAttractions} 
                    isLoading={attractionsLoading}
                />
            </div>
            
            {attractionsLoading ? (
                <div className="loadingMessage">Loading attractions...</div>
            ) : attractionsError ? (
                <div className="errorMessage">{attractionsError}</div>
            ) : attractions.length === 0 ? (
                <div className="noDataMessage">No attractions found</div>
            ) : (
                attractions.map((attraction, index) => (
                    <div key={`attraction-${index}`} className="listingCard">
                        <div className="listingImage">
                            {attraction.locationPhotos?.[0]?.images?.medium?.url ? (
                                <img 
                                    src={attraction.locationPhotos[0].images.medium.url} 
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
                                <p className="listingAddress">{attraction.address_obj?.address_string || 'Address not available'}</p>
                                <div className="listingRating">
                                    <div className="stars">
                                        {renderStars(parseFloat(attraction.rating || 0))}
                                    </div>
                                    <span className="ratingText">
                                        {attraction.rating || '0.0'}/5.0 ({attraction.num_reviews || 0} reviews)
                                    </span>
                                </div>
                                {/*<p className="listingPrice">{attraction.price_level || 'Price not available'}</p>*/}
                                <p className="listingPhone">{attraction.phone || 'Phone not available'}</p>
                            </div>
                            <div className="listingSecondaryInfo">
                                <div className="listingAbout">
                                    <h4>About</h4>
                                    <p>
                                        {getDescription(attraction)}
                                    </p>
                                </div>
                                <div className="listingFeatures">
                                    <h4>Features</h4>
                                    <ul className="featuresList">
                                        {attraction.subcategory && attraction.subcategory.map((cat, idx) => (
                                            <li key={idx}>{cat.name}</li>
                                        ))}
                                        {attraction.amenities && Object.entries(attraction.amenities).map(([key, value], idx) => (
                                            value && <li key={`amenity-${idx}`}>{key.replace(/_/g, ' ')}</li>
                                        ))}
                                        {(!attraction.subcategory && !attraction.amenities) && (
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
    );
}