import { motion } from "framer-motion";

/**
 * Button Component
 * Reusable button component with different variants and sizes
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button style variant (default, outline, ghost)
 * @param {string} props.size - Button size (default, sm, lg, icon)
 * @returns {JSX.Element} The button component
 */
export function Button({ children, className = "", variant = "default", size = "default", ...props }) {
    // Base styles applied to all buttons
    const baseStyles =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-['Exo_2']"

    // Style variants for different button types
    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    }

    // Size variants for different button dimensions
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    }

    // Combine all classes
    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
        <motion.button className={classes} {...props}>
            {children}
        </motion.button>
    )
}