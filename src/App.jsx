"use client"

import { useState, useRef, useEffect } from "react"
import { differenceInDays } from "date-fns"
import BackgroundElements from "./components/BackgroundElements"
import Header from "./components/Header"
import ProgressTracker from "./components/ProgressTracker"
import HomePage from "./components/HomePage"
import QuestionFlow from "./components/QuestionFlow"
import ResultsPage from "./components/ResultsPage"
import Footer from "./components/Footer"
import FloatingChat from "./components/FloatingChat"
import "./App.css"

function TravelAdvisor() {
    const [step, setStep] = useState(0)
    const [travelers, setTravelers] = useState(2)
    const [samePassport, setSamePassport] = useState(null)
    const [passport, setPassport] = useState("")
    const [budget, setBudget] = useState(2000)
    const [origin, setOrigin] = useState("")
    const [departDate, setDepartDate] = useState(undefined)
    const [returnDate, setReturnDate] = useState(undefined)
    const [activeCategory, setActiveCategory] = useState("Hotels")

    // Destination state
    const [destinationCountry, setDestinationCountry] = useState("")
    const [destinationCity, setDestinationCity] = useState("")

    // Custom select states
    const [passportDropdownOpen, setPassportDropdownOpen] = useState(false)
    const [originDropdownOpen, setOriginDropdownOpen] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [returnCalendarOpen, setReturnCalendarOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [returnMonth, setReturnMonth] = useState(new Date())

    // Add floating chat state and functionality
    const [floatingChatOpen, setFloatingChatOpen] = useState(false)
    const [floatingChatMessage, setFloatingChatMessage] = useState("")
    const [floatingChatHistory, setFloatingChatHistory] = useState([
        {
            message: "Hi there! I'm Trippy, your AI travel assistant. How can I help you plan your perfect trip today?",
            isUser: false,
        },
    ])

    const floatingChatRef = useRef(null)
    const passportDropdownRef = useRef(null)
    const originDropdownRef = useRef(null)
    const calendarRef = useRef(null)
    const returnCalendarRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (passportDropdownRef.current && !passportDropdownRef.current.contains(event.target)) {
                setPassportDropdownOpen(false)
            }
            if (originDropdownRef.current && !originDropdownRef.current.contains(event.target)) {
                setOriginDropdownOpen(false)
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarOpen(false)
            }
            if (returnCalendarRef.current && !returnCalendarRef.current.contains(event.target)) {
                setReturnCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const totalSteps = 9

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        }
    }

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const resetForm = () => {
        setStep(0)
        setTravelers(2)
        setSamePassport(null)
        setPassport("")
        setBudget(2000)
        setOrigin("")
        setDestinationCountry("")
        setDestinationCity("")
        setDepartDate(undefined)
        setReturnDate(undefined)
    }

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
                            "Thanks for your message! This is Trippy, your travel companion. The actual implementation will connect to the DeepSeek AI API.",
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

    // Sample list of countries for passport dropdown
    const countries = [
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
        "Japan",
        "China",
        "Brazil",
        "India",
        "Mexico",
        "Italy",
        "Spain",
        "South Korea",
        "Russia",
        "Netherlands",
        "Sweden",
        "Switzerland",
    ]

    const onPrevMonth = (date, setMonth) => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() - 1)
        setMonth(newDate)
    }

    const onNextMonth = (date, setMonth) => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() + 1)
        setMonth(newDate)
    }

    // Function to prepare travel data for API
    const prepareTravelData = () => {
        return {
            travelers,
            passport,
            budget,
            origin,
            destination: {
                country: destinationCountry,
                city: destinationCity,
            },
            dates: {
                departure: departDate,
                return: returnDate,
                duration: calculateTripDuration(),
            },
        }
    }

    // Props for question flow
    const questionProps = {
        step,
        travelers,
        setTravelers,
        samePassport,
        setSamePassport,
        passport,
        setPassport,
        budget,
        setBudget,
        origin,
        setOrigin,
        departDate,
        setDepartDate,
        returnDate,
        setReturnDate,
        destinationCountry,
        setDestinationCountry,
        destinationCity,
        setDestinationCity,
        passportDropdownOpen,
        setPassportDropdownOpen,
        originDropdownOpen,
        setOriginDropdownOpen,
        calendarOpen,
        setCalendarOpen,
        returnCalendarOpen,
        setReturnCalendarOpen,
        currentMonth,
        setCurrentMonth,
        returnMonth,
        setReturnMonth,
        nextStep,
        prevStep,
        countries,
        onPrevMonth,
        onNextMonth,
        calculateTripDuration,
        passportDropdownRef,
        originDropdownRef,
        calendarRef,
        returnCalendarRef,
        prepareTravelData,
    }

    // Props for results page
    const resultsProps = {
        destinationCity,
        destinationCountry,
        travelers,
        passport,
        budget,
        origin,
        departDate,
        returnDate,
        calculateTripDuration,
        prevStep,
        resetForm,
        activeCategory,
        setActiveCategory,
    }

    return (
        <div className="container" style={{ minHeight: "100vh" }}>
            <BackgroundElements />
            <Header resetForm={resetForm} />
            <ProgressTracker step={step} totalSteps={totalSteps} />

            <div className="mainContent">
                {step === 0 && <HomePage nextStep={nextStep} />}
                {step >= 1 && step <= 8 && <QuestionFlow {...questionProps} />}
                {step === 9 && <ResultsPage {...resultsProps} />}
            </div>

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