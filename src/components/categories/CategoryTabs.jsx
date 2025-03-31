// Tabs for hotels, attractions, restaurants, and itinerary
import { motion, AnimatePresence } from "framer-motion"
import HotelsList from "./HotelsList"
import AttractionsList from "./AttractionsList"
import RestaurantsList from "./RestaurantsList"
import ItineraryView from "./ItineraryView"

export default function CategoryTabs({ activeCategory, setActiveCategory, destinationCity, destinationCountry, calculateTripDuration }) {
    // Define all available categories
    const categories = ["Hotels", "Attractions", "Restaurants", "Itinerary"]

    return (
        <>
            {/* Category tabs with click handlers */}
            <div className="categoryTabs">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`categoryTab ${activeCategory === category ? "categoryTabActive" : ""}`}
                        onClick={() => setActiveCategory(category)}
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
                >
                    {activeCategory === "Hotels" && <HotelsList destinationCity={destinationCity} destinationCountry={destinationCountry} />}
                    {activeCategory === "Attractions" && <AttractionsList destinationCity={destinationCity} destinationCountry={destinationCountry} />}
                    {activeCategory === "Restaurants" && <RestaurantsList destinationCity={destinationCity} destinationCountry={destinationCountry} />}
                    {activeCategory === "Itinerary" && (
                        <ItineraryView selectedCity={selectedCity} tripDuration={calculateTripDuration()} />
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    )
}