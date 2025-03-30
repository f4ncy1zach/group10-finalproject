// Background icons and elements for styling and decorations, with animations and dynamic effects
import { motion } from "framer-motion"
import { Plane, Globe, MapIcon, Camera, Luggage, Mountain, Landmark, Sun, Cloud } from "lucide-react"

export default function BackgroundElements() {
    return (
        <div className="backgroundElements">
            <div className="backgroundElement plane1">
                <motion.div
                    animate={{
                        x: [0, window.innerWidth + 200],
                        y: [-20, 50, -30, 20],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                >
                    <Plane size={80} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement plane2">
                <motion.div
                    animate={{
                        x: [window.innerWidth + 100, -200],
                        y: [50, 100, 30, 80],
                    }}
                    transition={{
                        duration: 40,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay: 5,
                    }}
                >
                    <Plane size={60} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement globe">
                <motion.div
                    animate={{
                        rotate: 360,
                        y: [0, 15, 0],
                    }}
                    transition={{
                        rotate: {
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        },
                        y: {
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        },
                    }}
                >
                    <Globe size={120} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement map">
                <motion.div
                    animate={{
                        rotate: [-5, 5, -5],
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    <MapIcon size={100} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement camera">
                <motion.div
                    animate={{
                        rotate: [-10, 10, -10],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    <Camera size={70} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement luggage">
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        x: [0, 10, 0, -10, 0],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    <Luggage size={80} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement mountain">
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    <Mountain size={110} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement landmark">
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, 2, 0, -2, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                >
                    <Landmark size={90} className="travelIcon" />
                </motion.div>
            </div>

            <div className="backgroundElement sun">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 30,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        },
                        scale: {
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        },
                    }}
                >
                    <Sun size={100} className="travelIcon" />
                </motion.div>
            </div>

            {/* Clouds */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="backgroundElement cloud"
                    style={{
                        top: `${10 + i * 15}%`,
                        left: `${-20 + i * 5}%`,
                        opacity: 0.7 - i * 0.1,
                    }}
                >
                    <motion.div
                        animate={{
                            x: [0, window.innerWidth + 200],
                        }}
                        transition={{
                            duration: 60 + i * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                            delay: i * 5,
                        }}
                    >
                        <Cloud size={80 + i * 20} className="travelIcon" />
                    </motion.div>
                </div>
            ))}
        </div>
    )
}