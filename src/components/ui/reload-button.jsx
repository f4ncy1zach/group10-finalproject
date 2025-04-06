import { RefreshCw } from "lucide-react"

/**
 * ReloadButton Component
 * Button with loading state for refreshing data
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @returns {JSX.Element} The reload button component
 */
export default function ReloadButton({ onClick, isLoading }) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="reloadButton"
            aria-label={isLoading ? "Loading..." : "Reload data"}
        >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            <span>Reload</span>
        </button>
    )
}