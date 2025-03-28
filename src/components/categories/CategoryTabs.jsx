"use client"
import { motion, AnimatePresence } from "framer-motion"
import HotelsList from "./HotelsList"
import AttractionsList from "./AttractionsList"
import RestaurantsList from "./RestaurantsList"
import ItineraryView from "./ItineraryView"

export default function CategoryTabs({ activeCategory, setActiveCategory, selectedCity, calculateTripDuration }) {
    // Remove the isAnimating state and setTimeout delay
    return (
        <>
            {/* Category tabs with click handlers */}
            <div className="categoryTabs">
                {["Hotels", "Attractions", "Restaurants", "Itinerary"].map((category) => (
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
                    transition={{ duration: 0.2 }} // Reduced animation time for faster response
                >
                    {activeCategory === "Hotels" && <HotelsList selectedCity={selectedCity} />}
                    {activeCategory === "Attractions" && <AttractionsList selectedCity={selectedCity} />}
                    {activeCategory === "Restaurants" && <RestaurantsList selectedCity={selectedCity} />}
                    {activeCategory === "Itinerary" && (
                        <ItineraryView selectedCity={selectedCity} tripDuration={calculateTripDuration()} />
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    )
}