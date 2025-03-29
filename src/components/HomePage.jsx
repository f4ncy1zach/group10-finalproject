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
                    className="welcomeIcon"
                    whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
                    }}
                >
                    <Logo className="welcomeGlobe" size={48} />
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
                    Embark on a journey with your AI-powered travel companion, crafting magical trips tailored just for you.
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