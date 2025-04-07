import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"
import Logo from "./Logo"

/**
 * HomePage Component
 * Landing page with welcome message and start button
 * First screen users see when visiting the application
 *
 * @param {Object} props - Component props
 * @param {Function} props.nextStep - Function to advance to next step
 * @returns {JSX.Element} The home page component
 */
export default function HomePage({ nextStep }) {
    return (
        <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glassCard"
            whileHover={{
                boxShadow: "0 10px 25px rgba(56, 189, 248, 0.3)",
                y: -5,
            }}
        >
            <div className="welcomeStep">
                {/* Animated logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="homepageLogoContainer"
                >
                    <Logo size={110} />
                </motion.div>

                {/* Title with animation */}
                <motion.h2
                    data-test="Website-Name" className="welcomeTitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    TRAVEL ADVISOR
                </motion.h2>

                {/* Description with animation */}
                <motion.p className="welcomeText" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    Discover the world with ease using our AI-powered travel advisor. Whether you need destination ideas based on
                    your passport and visas or already have a place in mind, we've got you covered. Get personalized
                    recommendations for hotels, restaurants, and must-see attractions. Plus, let our AI generate a customized
                    itinerary to make your trip unforgettable.
                </motion.p>

                {/* Start button with animation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <Button onClick={nextStep} data-test="Start-Button" className="startButton" whileTap={{ scale: 0.95 }}>
                        Start Your Journey
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}