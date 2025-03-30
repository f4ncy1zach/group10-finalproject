// Reload button components for hotels, attractions, and restaurants of result page
import { RefreshCw } from "lucide-react"

export default function ReloadButton({ onClick, isLoading }) {
    return (
        <button onClick={onClick} disabled={isLoading} className="reloadButton">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            <span>Reload</span>
        </button>
    )
}