import { useState, useRef, useEffect } from "react"
import { differenceInDays } from "date-fns"
import BackgroundElements from "./components/BackgroundElements"
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import AiRecommendationQuestion from "./components/AiRecommendationQuestion"
import PassportVisaForm from "./components/PassportVisaForm"
import DestinationSelection from "./components/DestinationSelection"
import DateSelection from "./components/DateSelection"
import ResultsPage from "./components/ResultsPage"
import Footer from "./components/Footer"
import FloatingChat from "./components/FloatingChat"
import "./App.css"

function TravelAdvisor() {
    // Main flow control
    const [step, setStep] = useState(0)
    const [useAiRecommendation, setUseAiRecommendation] = useState(null)

    // Traveler information
    const [travelers, setTravelers] = useState([{ id: 1, passport: "", visas: [] }])

    // Destination information
    const [destinationCountry, setDestinationCountry] = useState("")
    const [destinationCity, setDestinationCity] = useState("")

    // Date selection
    const [departDate, setDepartDate] = useState(undefined)
    const [returnDate, setReturnDate] = useState(undefined)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [returnCalendarOpen, setReturnCalendarOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [returnMonth, setReturnMonth] = useState(new Date())

    // Results page
    const [activeCategory, setActiveCategory] = useState("Hotels")

    // Budget (optional)
    const [budget, setBudget] = useState(2000)

    // Dropdown states
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

    // Floating chat state and functionality
    const [floatingChatOpen, setFloatingChatOpen] = useState(false)
    const [floatingChatMessage, setFloatingChatMessage] = useState("")
    const [floatingChatHistory, setFloatingChatHistory] = useState([
        {
            message: "Hi there! I'm your AI travel assistant. How can I help you plan your perfect trip today?",
            isUser: false,
        },
    ])

    // Refs for handling outside clicks
    const floatingChatRef = useRef(null)
    const calendarRef = useRef(null)
    const returnCalendarRef = useRef(null)
    const countryDropdownRef = useRef(null)
    const cityDropdownRef = useRef(null)

    // Calendar navigation functions
    const onPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const onNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarOpen(false)
            }
            if (returnCalendarRef.current && !returnCalendarRef.current.contains(event.target)) {
                setReturnCalendarOpen(false)
            }
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setCountryDropdownOpen(false)
            }
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setCityDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Navigation functions
    const nextStep = () => {
        setStep(step + 1)
    }

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const resetForm = () => {
        setStep(0)
        setUseAiRecommendation(null)
        setTravelers([{ id: 1, passport: "", visas: [] }])
        setDestinationCountry("")
        setDestinationCity("")
        setDepartDate(undefined)
        setReturnDate(undefined)
        setBudget(2000)
    }

    // Add a new traveler
    const addTraveler = () => {
        const newId = travelers.length > 0 ? Math.max(...travelers.map((t) => t.id)) + 1 : 1
        setTravelers([...travelers, { id: newId, passport: "", visas: [] }])
    }

    // Update traveler information
    const updateTravelerPassport = (id, passport) => {
        setTravelers(travelers.map((t) => (t.id === id ? { ...t, passport } : t)))
    }

    const updateTravelerVisas = (id, visas) => {
        setTravelers(travelers.map((t) => (t.id === id ? { ...t, visas } : t)))
    }

    // Remove a traveler
    const removeTraveler = (id) => {
        if (travelers.length > 1) {
            setTravelers(travelers.filter((t) => t.id !== id))
        }
    }

    // Chat functionality
    const sendFloatingChatMessage = () => {
        if (floatingChatMessage.trim()) {
            setFloatingChatHistory([...floatingChatHistory, { message: floatingChatMessage, isUser: true }])
            setFloatingChatMessage("")

            // Simulate AI response
            setTimeout(() => {
                setFloatingChatHistory((prev) => [
                    ...prev,
                    {
                        message:
                            "Thanks for your message! This is your travel companion. The actual implementation will connect to the ChatGPT API.",
                        isUser: false,
                    },
                ])

                // Scroll to bottom of chat
                if (floatingChatRef.current) {
                    floatingChatRef.current.scrollTop = floatingChatRef.current.scrollHeight
                }
            }, 1000)
        }
    }

    // Calculate trip duration
    const calculateTripDuration = () => {
        if (!departDate || !returnDate) return 0
        return differenceInDays(returnDate, departDate) + 1
    }

    // Props for destination selection
    const destinationProps = {
        destinationCountry,
        setDestinationCountry,
        destinationCity,
        setDestinationCity,
        nextStep,
        prevStep,
    }

    // Props for date selection
    const dateProps = {
        departDate,
        setDepartDate,
        returnDate,
        setReturnDate,
        calendarOpen,
        setCalendarOpen,
        returnCalendarOpen,
        setReturnCalendarOpen,
        currentMonth,
        setCurrentMonth,
        returnMonth,
        setReturnMonth,
        onPrevMonth,
        onNextMonth,
        calculateTripDuration,
        calendarRef,
        returnCalendarRef,
        nextStep,
        prevStep,
    }

    // Props for results page
    const resultsProps = {
        useAiRecommendation,
        destinationCity,
        destinationCountry,
        travelers,
        budget,
        departDate,
        returnDate,
        calculateTripDuration,
        prevStep,
        resetForm,
        activeCategory,
        setActiveCategory,
    }

    // Render the appropriate component based on the current step
    const renderStep = () => {
        switch (step) {
            case 0:
                return <HomePage nextStep={nextStep} />
            case 1:
                return (
                    <AiRecommendationQuestion
                        setUseAiRecommendation={setUseAiRecommendation}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )
            case 2:
                // If AI recommendation, show passport form, otherwise show destination selection
                return useAiRecommendation ? (
                    <PassportVisaForm
                        travelers={travelers}
                        updateTravelerPassport={updateTravelerPassport}
                        updateTravelerVisas={updateTravelerVisas}
                        addTraveler={addTraveler}
                        removeTraveler={removeTraveler}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                ) : (
                    <DestinationSelection {...destinationProps} />
                )
            case 3:
                // For both paths, show departure date selection
                return <DateSelection {...dateProps} isReturn={false} title="WHEN DO YOU WANT TO TRAVEL?" />
            case 4:
                // For both paths, show return date selection
                return <DateSelection {...dateProps} isReturn={true} title="WHEN DO YOU WANT TO RETURN?" />
            case 5:
                // Show results page
                return <ResultsPage {...resultsProps} />
            default:
                return <HomePage nextStep={nextStep} />
        }
    }

    return (
        <div className="container" style={{ minHeight: "100vh" }}>
            <BackgroundElements />
            <Header resetForm={resetForm} />

            <div className="mainContent">{renderStep()}</div>

            <Footer />
            <FloatingChat
                floatingChatOpen={floatingChatOpen}
                setFloatingChatOpen={setFloatingChatOpen}
                floatingChatMessage={floatingChatMessage}
                setFloatingChatMessage={setFloatingChatMessage}
                floatingChatHistory={floatingChatHistory}
                sendFloatingChatMessage={sendFloatingChatMessage}
                floatingChatRef={floatingChatRef}
            />
        </div>
    )
}

function App() {
    return <TravelAdvisor />
}

export default App