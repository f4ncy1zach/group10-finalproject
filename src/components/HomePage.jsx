// Homepage of the website, showing website description and start button
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"
import Logo from "./Logo"

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
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="homepageLogoContainer"
                >
                    <Logo size={110} />
                </motion.div>
                <motion.h2
                    className="welcomeTitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    TRAVEL ADVISOR
                </motion.h2>
                <motion.p className="welcomeText" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    Discover the world with ease using our AI-powered travel advisor. Whether you need destination ideas based on
                    your passport and visas or already have a place in mind, we've got you covered. Get personalized
                    recommendations for hotels, restaurants, and must-see attractions. Plus, let our AI generate a customized
                    itinerary to make your trip unforgettable.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <Button onClick={nextStep} className="startButton" whileTap={{ scale: 0.95 }}>
                        Start Your Journey
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}