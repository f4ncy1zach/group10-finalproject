
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export function Select({ options, onChange, placeholder, className = "" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleSelect = (option) => {
        setSelectedOption(option)
        setIsOpen(false)
        if (onChange) onChange(option)
    }

    return (
        <div className={`selectContainer ${className}`} ref={dropdownRef}>
            <button className="selectButton" onClick={() => setIsOpen(!isOpen)} type="button">
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={`selectIcon ${isOpen ? "rotate" : ""}`} />
            </button>

            {isOpen && (
                <div className="selectDropdown">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`selectOption ${selectedOption?.value === option.value ? "selected" : ""}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}