"use client"

import { motion } from "framer-motion"

export default function ProgressTracker({ step, totalSteps }) {
    return (
        <div className="progressContainer">
            <div className="progressTracker">
                {[...Array(totalSteps + 1)].map((_, i) => (
                    <div key={i} className="progressStep">
                        <motion.div
                            className={`progressDot ${i <= step ? "progressDotActive" : ""}`}
                            initial={{ scale: 1 }}
                            animate={{
                                scale: i === step ? [1, 1.2, 1] : 1,
                                // Removed box shadow animation
                            }}
                            transition={{ duration: 1, repeat: i === step ? Number.POSITIVE_INFINITY : 0 }}
                        >
                            <span className="progressNumber">{i + 1}</span>
                        </motion.div>
                        {i < totalSteps && (
                            <motion.div
                                className="progressLine"
                                initial={{ background: "#e5e7eb" }}
                                animate={{
                                    background: i < step ? "linear-gradient(to right, #38bdf8, #8b5cf6)" : "#e5e7eb",
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}