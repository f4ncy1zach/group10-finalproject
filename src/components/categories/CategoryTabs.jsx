import { motion, AnimatePresence } from "framer-motion"
import HotelsList from "./HotelsList"
import AttractionsList from "./AttractionsList"
import RestaurantsList from "./RestaurantsList"
import ItineraryView from "./ItineraryView"

/**
 * CategoryTabs Component
 * Displays tabs for different categories of travel information
 * Manages tab selection and renders the appropriate content
 *
 * @param {Object} props - Component props
 * @param {string} props.activeCategory - Currently selected category
 * @param {Function} props.setActiveCategory - Function to change the active category
 * @param {string} props.destinationCity - The selected city
 * @param {string} props.destinationCountry - The selected country
 * @param {Function} props.calculateTripDuration - Function to calculate trip duration
 * @returns {JSX.Element} The category tabs component
 */
export default function CategoryTabs({
                                         activeCategory,
                                         setActiveCategory,
                                         destinationCity,
                                         destinationCountry,
                                         calculateTripDuration,
                                     }) {
    // Define all available categories
    const categories = ["Hotels", "Attractions", "Restaurants", "Itinerary"]

    return (
        <>
            {/* Category tabs with click handlers */}
            <div className="categoryTabs">
                {categories.map((category) => (
                    <button
                        key={category}
                        data-test={`Category-Button-${category}`}
                        className={`categoryTab ${activeCategory === category ? "categoryTabActive" : ""}`}
                        onClick={() => setActiveCategory(category)}
                        aria-selected={activeCategory === category}
                        role="tab"
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Content area for selected category with animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    className="categoryContent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    role="tabpanel"
                >
                    {/* Render the appropriate component based on active category */}
                    {activeCategory === "Hotels" && (
                        <HotelsList destinationCity={destinationCity} destinationCountry={destinationCountry} />
                    )}
                    {activeCategory === "Attractions" && (
                        <AttractionsList destinationCity={destinationCity} destinationCountry={destinationCountry} />
                    )}
                    {activeCategory === "Restaurants" && (
                        <RestaurantsList destinationCity={destinationCity} destinationCountry={destinationCountry} />
                    )}
                    {activeCategory === "Itinerary" && (
                        <ItineraryView selectedCity={destinationCity} tripDuration={calculateTripDuration()} />
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    )
}