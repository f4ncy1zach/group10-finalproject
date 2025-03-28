"use client"

import { useState, useRef, useEffect } from "react"
import { differenceInDays } from "date-fns"
import { ThemeProvider } from "./components/theme-provider"
import BackgroundElements from "./components/BackgroundElements"
import Header from "./components/Header"
import ProgressTracker from "./components/ProgressTracker"
import HomePage from "./components/HomePage"
import QuestionFlow from "./components/QuestionFlow"
import ResultsPage from "./components/ResultsPage"
import Footer from "./components/Footer"
import FloatingChat from "./components/FloatingChat"
import "./App.css"

// Destination data
const destinations = {
    "North America": {
        Canada: ["Toronto", "Vancouver", "Montreal", "Winnipeg", "Edmonton", "Calgary"],
        "United States": ["New York City", "Los Angeles", "Las Vegas", "Miami", "San Francisco", "Seattle", "Chicago"],
        Mexico: ["Mexico City", "Cancun", "Tulum", "Guadalajara"],
    },
    Asia: {
        Japan: ["Tokyo", "Yokohama", "Kyoto", "Osaka", "Nara", "Nagoya", "Fukuoka", "Sapporo"],
        China: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Hong Kong"],
        "South Korea": ["Seoul", "Busan", "Jeju City"],
        Taiwan: ["Taipei", "Taoyuan", "Taichung", "Kaohsiung"],
        Singapore: ["Singapore"],
        Malaysia: ["Kuala Lumpur"],
        India: ["Mumbai", "Delhi", "Bangalore"],
        Thailand: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
        Indonesia: ["Bali", "Jakarta", "Yogyakarta"],
        Vietnam: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hoi An"],
    },
    Europe: {
        "United Kingdom": ["London", "Edinburgh", "Manchester", "Liverpool"],
        France: ["Paris", "Nice", "Lyon", "Marseille"],
        Italy: ["Rome", "Venice", "Florence", "Milan"],
        Germany: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
        Spain: ["Barcelona", "Madrid", "Seville", "Valencia"],
        Switzerland: ["Zurich", "Geneva", "Lucerne", "Interlaken"],
        Greece: ["Athens", "Santorini", "Mykonos", "Thessaloniki"],
    },
    Africa: {
        "South Africa": ["Cape Town", "Johannesburg", "Durban"],
        Morocco: ["Marrakech", "Casablanca", "Fes", "Rabat"],
        Egypt: ["Cairo", "Luxor", "Aswan", "Alexandria"],
    },
    Oceania: {
        Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
        "New Zealand": ["Auckland", "Queenstown", "Wellington", "Christchurch"],
    },
    "South America": {
        Brazil: ["Rio de Janeiro", "São Paulo", "Salvador"],
        Argentina: ["Buenos Aires", "Mendoza", "Bariloche"],
        Peru: ["Lima", "Cusco", "Arequipa"],
    },
}

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
    const [selectedRegion, setSelectedRegion] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [regionDropdownOpen, setRegionDropdownOpen] = useState(false)
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

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
    const regionDropdownRef = useRef(null)
    const countryDropdownRef = useRef(null)
    const cityDropdownRef = useRef(null)
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
            if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
                setRegionDropdownOpen(false)
            }
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setCountryDropdownOpen(false)
            }
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setCityDropdownOpen(false)
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

    const totalSteps = 9 // Updated to include the new destination step

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
        setSelectedRegion("")
        setSelectedCountry("")
        setSelectedCity("")
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
                            "This is a placeholder for the actual message, which will be answered by the ChatGPT API.",
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

    // Extract all countries from destinations object
    const getAllCountries = () => {
        const countryList = []

        Object.keys(destinations).forEach((region) => {
            Object.keys(destinations[region]).forEach((country) => {
                countryList.push(country)
            })
        })

        return countryList
    }

    const countries = getAllCountries()

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

    // Get available regions
    const regions = Object.keys(destinations)

    // Get available countries based on selected region
    const availableCountries = selectedRegion ? Object.keys(destinations[selectedRegion]) : []

    // Get available cities based on selected country and region
    const availableCities = selectedRegion && selectedCountry ? destinations[selectedRegion][selectedCountry] : []

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
        selectedRegion,
        setSelectedRegion,
        selectedCountry,
        setSelectedCountry,
        selectedCity,
        setSelectedCity,
        regionDropdownOpen,
        setRegionDropdownOpen,
        countryDropdownOpen,
        setCountryDropdownOpen,
        cityDropdownOpen,
        setCityDropdownOpen,
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
        regions,
        availableCountries,
        availableCities,
        onPrevMonth,
        onNextMonth,
        calculateTripDuration,
        passportDropdownRef,
        originDropdownRef,
        regionDropdownRef,
        countryDropdownRef,
        cityDropdownRef,
        calendarRef,
        returnCalendarRef,
    }

    // Props for results page
    const resultsProps = {
        selectedCity,
        selectedCountry,
        selectedRegion,
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
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <TravelAdvisor />
        </ThemeProvider>
    )
}

export default App