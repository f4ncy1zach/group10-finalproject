import { RefreshCw } from "lucide-react"
import { Button } from "./button"

export default function ReloadButton({ onClick, isLoading }) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            disabled={isLoading}
            className="reloadButton"
        >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Reload
        </Button>
    )
}