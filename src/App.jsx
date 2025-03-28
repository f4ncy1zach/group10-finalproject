"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe,
    Plane,
    Calendar,
    DollarSign,
    Users,
    StampIcon as Passport,
    ArrowRight,
    ArrowLeft,
    Home,
    Send,
    Camera,
    Mountain,
    Luggage,
    MapIcon,
    Cloud,
    Sun,
    Landmark,
    ChevronDown,
    MessageSquare,
    MapPin,
} from "lucide-react"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { format, differenceInDays } from "date-fns"
import { ThemeProvider } from "./components/theme-provider"
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
    const [chatMessage, setChatMessage] = useState("")
    const [chatHistory, setChatHistory] = useState([
        { message: "Hello! I'm your AI travel assistant. How can I help you with your trip?", isUser: false },
    ])

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
        { message: "Hello! I'm your AI travel assistant. How can I help you plan your trip?", isUser: false },
    ])

    const floatingChatRef = useRef(null)

    // Add this with the other state variables at the top of the TravelAdvisor component
    const [activeCategory, setActiveCategory] = useState("Hotels")

    const sendFloatingChatMessage = () => {
        if (floatingChatMessage.trim()) {
            setFloatingChatHistory([...floatingChatHistory, { message: floatingChatMessage, isUser: true }])
            setFloatingChatMessage("")

            // Simulate AI response
            setTimeout(() => {
                setFloatingChatHistory((prev) => [
                    ...prev,
                    {
                        message: "This is a placeholder response. The actual implementation will connect to the DeepSeek AI API.",
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

    const chatContainerRef = useRef(null)
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

    const sendChatMessage = () => {
        if (chatMessage.trim()) {
            setChatHistory([...chatHistory, { message: chatMessage, isUser: true }])
            setChatMessage("")

            // Simulate AI response
            setTimeout(() => {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        message: "This is a placeholder response. The actual implementation will connect to the DeepSeek AI API.",
                        isUser: false,
                    },
                ])

                // Scroll to bottom of chat
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
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

    return (
        <div className="container">
            {/* Background elements */}
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

            {/* Header */}
            <header className="header">
                <div className="headerContent">
                    <div className="logo">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Globe className="logoIcon" />
                        </motion.div>
                        <h1 className="logoText">TRAVEL ADVISOR</h1>
                    </div>
                    <Button variant="ghost" size="icon" className="homeButton" onClick={resetForm}>
                        <Home className="homeIcon" />
                        <span className="sr-only">Home</span>
                    </Button>
                </div>
            </header>

            {/* Progress indicator */}
            <div className="progressContainer">
                <div className="progressTracker">
                    {[...Array(totalSteps + 1)].map((_, i) => (
                        <div key={i} className="progressStep">
                            <motion.div
                                className={`progressDot ${i <= step ? "progressDotActive" : ""}`}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: i === step ? [1, 1.2, 1] : 1,
                                    boxShadow: i <= step ? "0 0 10px rgba(56, 189, 248, 0.5)" : "none",
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

            {/* Main content */}
            <div className="mainContent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="glassCard"
                        whileHover={{
                            boxShadow: "0 10px 25px rgba(56, 189, 248, 0.3)",
                            y: -5,
                        }}
                    >
                        {step === 0 && (
                            <div className="welcomeStep">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, 5, 0, -5, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="welcomeIcon"
                                    whileHover={{
                                        scale: 1.1,
                                        boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
                                    }}
                                >
                                    <Globe className="welcomeGlobe" />
                                </motion.div>
                                <motion.h2
                                    className="welcomeTitle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    TRAVEL ADVISOR
                                </motion.h2>
                                <motion.p
                                    className="welcomeText"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Embark on a journey with your AI-powered travel companion, crafting magical trips tailored just for
                                    you.
                                </motion.p>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                    <Button onClick={nextStep} className="startButton" whileTap={{ scale: 0.95 }}>
                                        Start Your Journey
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </motion.div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Users className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">HOW MANY PEOPLE ARE TRAVELING?</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="sliderLabels">
                                        <span className="sliderLabel">1</span>
                                        <span className="sliderLabel">10</span>
                                    </div>
                                    <div className="sliderContainer">
                                        <Slider
                                            value={[travelers]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={(value) => setTravelers(value[0])}
                                            className="slider"
                                        />
                                        <motion.div
                                            className="travelersBadge"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            {travelers}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="questionIcon"
                                    >
                                        <Passport className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">DOES EVERYONE HAVE THE SAME PASSPORT?</h2>
                                </div>
                                <div className="optionsGrid">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant={samePassport === true ? "default" : "outline"}
                                            onClick={() => setSamePassport(true)}
                                            className={`optionButton ${samePassport === true ? "optionButtonActive" : ""}`}
                                        >
                                            Yes
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant={samePassport === false ? "default" : "outline"}
                                            onClick={() => setSamePassport(false)}
                                            className={`optionButton ${samePassport === false ? "optionButtonActive" : ""}`}
                                        >
                                            No
                                        </Button>
                                    </motion.div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={samePassport === null}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ y: [0, -5, 0, 5, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Passport className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">
                                        WHAT PASSPORT {travelers > 1 && samePassport ? "DOES EVERYONE" : "DO YOU"} HAVE?
                                    </h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="customSelect" ref={passportDropdownRef}>
                                        <div className="customSelectTrigger" onClick={() => setPassportDropdownOpen(!passportDropdownOpen)}>
                                            {passport || "Select a country"}
                                            <ChevronDown size={16} />
                                        </div>
                                        {passportDropdownOpen && (
                                            <div className="customSelectDropdown">
                                                {countries.map((country) => (
                                                    <div
                                                        key={country}
                                                        className={`customSelectOption ${passport === country ? "customSelectOptionSelected" : ""}`}
                                                        onClick={() => {
                                                            setPassport(country)
                                                            setPassportDropdownOpen(false)
                                                        }}
                                                    >
                                                        {country}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!passport}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, 0, -10, 0],
                                        }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <DollarSign className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHAT IS YOUR BUDGET? (in CAD)</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="sliderLabels">
                                        <span className="sliderLabel">$500</span>
                                        <span className="sliderLabel">$10,000</span>
                                    </div>
                                    <div className="sliderContainer">
                                        <Slider
                                            value={[budget]}
                                            min={500}
                                            max={10000}
                                            step={100}
                                            onValueChange={(value) => setBudget(value[0])}
                                            className="slider"
                                        />
                                        <motion.div
                                            className="budgetBadge"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 1, delay: 0.2, repeat: Number.POSITIVE_INFINITY }}
                                        >
                                            ${budget.toLocaleString()}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{
                                            x: [0, 10, 0, -10, 0],
                                            rotate: [0, 10, 0, -10, 0],
                                        }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Plane className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHERE ARE YOU TRAVELING FROM?</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="customSelect" ref={originDropdownRef}>
                                        <div className="customSelectTrigger" onClick={() => setOriginDropdownOpen(!originDropdownOpen)}>
                                            {origin || "Select a country"}
                                            <ChevronDown size={16} />
                                        </div>
                                        {originDropdownOpen && (
                                            <div className="customSelectDropdown">
                                                {countries.map((country) => (
                                                    <div
                                                        key={country}
                                                        className={`customSelectOption ${origin === country ? "customSelectOptionSelected" : ""}`}
                                                        onClick={() => {
                                                            setOrigin(country)
                                                            setOriginDropdownOpen(false)
                                                        }}
                                                    >
                                                        {country}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!origin}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 6 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{
                                            x: [0, 10, 0, -10, 0],
                                            rotate: [0, 10, 0, -10, 0],
                                        }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <MapPin className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHERE IS YOUR DESTINATION?</h2>
                                </div>
                                <div className="inputContainer">
                                    {/* Region Selection */}
                                    <div className="customSelect" ref={regionDropdownRef}>
                                        <div className="customSelectTrigger" onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}>
                                            {selectedRegion || "Select a region"}
                                            <ChevronDown size={16} />
                                        </div>
                                        {regionDropdownOpen && (
                                            <div className="customSelectDropdown">
                                                {regions.map((region) => (
                                                    <div
                                                        key={region}
                                                        className={`customSelectOption ${selectedRegion === region ? "customSelectOptionSelected" : ""}`}
                                                        onClick={() => {
                                                            setSelectedRegion(region)
                                                            setSelectedCountry("")
                                                            setSelectedCity("")
                                                            setRegionDropdownOpen(false)
                                                        }}
                                                    >
                                                        {region}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Country Selection - only show if region is selected */}
                                    {selectedRegion && (
                                        <div className="customSelect mt-4" ref={countryDropdownRef}>
                                            <div className="customSelectTrigger" onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}>
                                                {selectedCountry || "Select a country"}
                                                <ChevronDown size={16} />
                                            </div>
                                            {countryDropdownOpen && (
                                                <div className="customSelectDropdown">
                                                    {availableCountries.map((country) => (
                                                        <div
                                                            key={country}
                                                            className={`customSelectOption ${selectedCountry === country ? "customSelectOptionSelected" : ""}`}
                                                            onClick={() => {
                                                                setSelectedCountry(country)
                                                                setSelectedCity("")
                                                                setCountryDropdownOpen(false)
                                                            }}
                                                        >
                                                            {country}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* City Selection - only show if country is selected */}
                                    {selectedRegion && selectedCountry && (
                                        <div className="customSelect mt-4" ref={cityDropdownRef}>
                                            <div className="customSelectTrigger" onClick={() => setCityDropdownOpen(!cityDropdownOpen)}>
                                                {selectedCity || "Select a city"}
                                                <ChevronDown size={16} />
                                            </div>
                                            {cityDropdownOpen && (
                                                <div className="customSelectDropdown">
                                                    {availableCities.map((city) => (
                                                        <div
                                                            key={city}
                                                            className={`customSelectOption ${selectedCity === city ? "customSelectOptionSelected" : ""}`}
                                                            onClick={() => {
                                                                setSelectedCity(city)
                                                                setCityDropdownOpen(false)
                                                            }}
                                                        >
                                                            {city}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!selectedRegion || !selectedCountry || !selectedCity}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 7 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="questionIcon"
                                    >
                                        <Calendar className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHEN DO YOU WANT TO TRAVEL?</h2>
                                </div>
                                <div className="inputContainer" ref={calendarRef}>
                                    <div className="dateButton" onClick={() => setCalendarOpen(!calendarOpen)}>
                                        {departDate ? format(departDate, "PPP") : "Select departure date"}
                                        <ChevronDown size={16} />
                                    </div>
                                    {calendarOpen && (
                                        <div className="calendarPopover">
                                            <div className="calendar">
                                                <div className="calendarHeader">
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => onPrevMonth(currentMonth, setCurrentMonth)}
                                                    >
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="calendarMonthTitle">{format(currentMonth, "MMMM yyyy")}</div>
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => onNextMonth(currentMonth, setCurrentMonth)}
                                                    >
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                                <div className="calendarDayNames">
                                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                                        <div key={day} className="calendarDayName">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="calendarGrid">
                                                    {Array.from({
                                                        length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(),
                                                    }).map((_, i) => (
                                                        <div key={`empty-${i}`}></div>
                                                    ))}
                                                    {Array.from({
                                                        length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(),
                                                    }).map((_, i) => {
                                                        const day = i + 1
                                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                                        const isSelected =
                                                            departDate &&
                                                            departDate.getDate() === day &&
                                                            departDate.getMonth() === currentMonth.getMonth() &&
                                                            departDate.getFullYear() === currentMonth.getFullYear()

                                                        const isDisabled = date < new Date(new Date().setHours(0, 0, 0, 0))

                                                        return (
                                                            <button
                                                                key={day}
                                                                className={`calendarDay ${isSelected ? "calendarDaySelected" : ""} ${
                                                                    isDisabled ? "calendarDayDisabled" : ""
                                                                }`}
                                                                onClick={() => {
                                                                    if (!isDisabled) {
                                                                        setDepartDate(date)
                                                                        setCalendarOpen(false)
                                                                    }
                                                                }}
                                                                disabled={isDisabled}
                                                            >
                                                                {day}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!departDate}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 8 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="questionIcon"
                                    >
                                        <Calendar className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHEN DO YOU WANT TO RETURN?</h2>
                                </div>
                                <div className="inputContainer" ref={returnCalendarRef}>
                                    <div className="dateButton" onClick={() => setReturnCalendarOpen(!returnCalendarOpen)}>
                                        {returnDate ? format(returnDate, "PPP") : "Select return date"}
                                        <ChevronDown size={16} />
                                    </div>

                                    {departDate && returnDate && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tripDuration">
                                            <div className="tripDurationText">Trip duration: {calculateTripDuration()} days</div>
                                        </motion.div>
                                    )}

                                    {returnCalendarOpen && (
                                        <div className="calendarPopover">
                                            <div className="calendar">
                                                <div className="calendarHeader">
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => onPrevMonth(returnMonth, setReturnMonth)}
                                                    >
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="calendarMonthTitle">{format(returnMonth, "MMMM yyyy")}</div>
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => onNextMonth(returnMonth, setReturnMonth)}
                                                    >
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                                <div className="calendarDayNames">
                                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                                        <div key={day} className="calendarDayName">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="calendarGrid">
                                                    {Array.from({
                                                        length: new Date(returnMonth.getFullYear(), returnMonth.getMonth(), 1).getDay(),
                                                    }).map((_, i) => (
                                                        <div key={`empty-${i}`}></div>
                                                    ))}
                                                    {Array.from({
                                                        length: new Date(returnMonth.getFullYear(), returnMonth.getMonth() + 1, 0).getDate(),
                                                    }).map((_, i) => {
                                                        const day = i + 1
                                                        const date = new Date(returnMonth.getFullYear(), returnMonth.getMonth(), day)
                                                        const isSelected =
                                                            returnDate &&
                                                            returnDate.getDate() === day &&
                                                            returnDate.getMonth() === returnMonth.getMonth() &&
                                                            returnDate.getFullYear() === returnMonth.getFullYear()

                                                        const isDisabled = departDate
                                                            ? date < departDate
                                                            : date < new Date(new Date().setHours(0, 0, 0, 0))

                                                        return (
                                                            <button
                                                                key={day}
                                                                className={`calendarDay ${isSelected ? "calendarDaySelected" : ""} ${
                                                                    isDisabled ? "calendarDayDisabled" : ""
                                                                }`}
                                                                onClick={() => {
                                                                    if (!isDisabled) {
                                                                        setReturnDate(date)
                                                                        setReturnCalendarOpen(false)
                                                                    }
                                                                }}
                                                                disabled={isDisabled}
                                                            >
                                                                {day}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!returnDate}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 9 && (
                            <div className="resultsPageContainer">
                                <div className="resultsHeader">
                                    <motion.h2
                                        className="resultsTitle"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        YOUR DREAM DESTINATION AWAITS
                                    </motion.h2>
                                </div>

                                <div className="resultsMainContent">
                                    {/* Left side - Destination image placeholder */}
                                    <motion.div
                                        className="destinationImageContainer"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <div className="destinationImagePlaceholder">
                                            <MapPin size={50} className="mb-4 mx-auto opacity-50" />
                                            <p>Destination image will be displayed here</p>
                                            <p className="text-sm mt-2">
                                                {selectedCity}, {selectedCountry}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Right side - Trip summary and destination description */}
                                    <motion.div
                                        className="destinationInfo"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        {/* Trip summary */}
                                        <div className="tripSummary">
                                            <h3 className="text-xl font-bold mb-4 text-gray-800">Trip Summary</h3>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Travelers:</div>
                                                <div className="summaryValue">
                                                    {travelers} {travelers === 1 ? "person" : "people"}
                                                </div>
                                            </div>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Passport:</div>
                                                <div className="summaryValue">{passport}</div>
                                            </div>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Budget:</div>
                                                <div className="summaryValue">${budget.toLocaleString()} CAD</div>
                                            </div>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Origin:</div>
                                                <div className="summaryValue">{origin}</div>
                                            </div>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Destination:</div>
                                                <div className="summaryValue">
                                                    {selectedCity}, {selectedCountry} ({selectedRegion})
                                                </div>
                                            </div>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Travel Dates:</div>
                                                <div className="summaryValue">
                                                    {departDate && format(departDate, "MMM d, yyyy")} -{" "}
                                                    {returnDate && format(returnDate, "MMM d, yyyy")}
                                                </div>
                                            </div>

                                            <div className="summaryItem">
                                                <div className="summaryLabel">Duration:</div>
                                                <div className="summaryValue">{calculateTripDuration()} days</div>
                                            </div>
                                        </div>

                                        {/* Destination description placeholder */}
                                        <div className="destinationDescription">
                                            <div className="descriptionPlaceholder">
                                                <Globe size={40} className="mb-3 mx-auto opacity-50" />
                                                <p>Destination description will be loaded here</p>
                                                <p className="text-sm mt-2">Information about {selectedCity} will be retrieved from the API</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Category tabs and content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {/* Category tabs with click handlers */}
                                    <div className="categoryTabs">
                                        {["Hotels", "Attractions", "Restaurants", "Itinerary"].map((category) => (
                                            <button
                                                key={category}
                                                className={`categoryTab ${activeCategory === category ? "categoryTabActive" : ""}`}
                                                onClick={() => setActiveCategory(category)}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content area for selected category */}
                                    <div className="categoryContent">
                                        {activeCategory === "Hotels" && (
                                            <div className="listingsContainer">
                                                {[...Array(6)].map((_, index) => (
                                                    <div key={`hotel-${index}`} className="listingCard">
                                                        <div className="listingImage">
                                                            <div className="imagePlaceholder">
                                                                <Luggage size={30} className="placeholderIcon" />
                                                            </div>
                                                        </div>
                                                        <div className="listingDetails">
                                                            <div className="listingMainInfo">
                                                                <h3 className="listingName">Hotel {index + 1}</h3>
                                                                <p className="listingAddress">123 Main Street, {selectedCity}</p>
                                                                <div className="listingRating">
                                                                    <div className="stars">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <span key={i} className={i < 4 ? "star filled" : "star"}>
                                        ★
                                      </span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="ratingText">4.0/5.0 ({80 + index * 10} reviews)</span>
                                                                </div>
                                                                <p className="listingPrice">${100 + index * 50}/night</p>
                                                                <p className="listingPhone">+1 (555) 123-45{index}0</p>
                                                            </div>
                                                            <div className="listingSecondaryInfo">
                                                                <div className="listingAbout">
                                                                    <h4>About</h4>
                                                                    <p>
                                                                        A beautiful hotel located in the heart of {selectedCity}. Offering comfortable rooms
                                                                        and excellent service.
                                                                    </p>
                                                                </div>
                                                                <div className="listingFeatures">
                                                                    <h4>Features</h4>
                                                                    <ul className="featuresList">
                                                                        <li>Free WiFi</li>
                                                                        <li>Swimming Pool</li>
                                                                        <li>Fitness Center</li>
                                                                        <li>Restaurant</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeCategory === "Attractions" && (
                                            <div className="listingsContainer">
                                                {[...Array(6)].map((_, index) => (
                                                    <div key={`attraction-${index}`} className="listingCard">
                                                        <div className="listingImage">
                                                            <div className="imagePlaceholder">
                                                                <Landmark size={30} className="placeholderIcon" />
                                                            </div>
                                                        </div>
                                                        <div className="listingDetails">
                                                            <div className="listingMainInfo">
                                                                <h3 className="listingName">
                                                                    {selectedCity} Attraction {index + 1}
                                                                </h3>
                                                                <p className="listingAddress">
                                                                    {456 + index * 10} Tourist Avenue, {selectedCity}
                                                                </p>
                                                                <div className="listingRating">
                                                                    <div className="stars">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <span key={i} className={i < 4.5 - index * 0.5 ? "star filled" : "star"}>
                                        ★
                                      </span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="ratingText">
                                    {4.5 - index * 0.5}/5.0 ({120 + index * 15} reviews)
                                  </span>
                                                                </div>
                                                                <p className="listingPrice">${15 + index * 5} per person</p>
                                                                <p className="listingPhone">+1 (555) 789-{index}123</p>
                                                            </div>
                                                            <div className="listingSecondaryInfo">
                                                                <div className="listingAbout">
                                                                    <h4>About</h4>
                                                                    <p>
                                                                        A popular tourist destination in {selectedCity}. Known for its cultural significance
                                                                        and beautiful views.
                                                                    </p>
                                                                </div>
                                                                <div className="listingFeatures">
                                                                    <h4>Features</h4>
                                                                    <ul className="featuresList">
                                                                        <li>Guided Tours</li>
                                                                        <li>Gift Shop</li>
                                                                        <li>Photo Spots</li>
                                                                        <li>Accessible</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeCategory === "Restaurants" && (
                                            <div className="listingsContainer">
                                                {[...Array(6)].map((_, index) => (
                                                    <div key={`restaurant-${index}`} className="listingCard">
                                                        <div className="listingImage">
                                                            <div className="imagePlaceholder">
                                                                <div className="placeholderIcon">🍽️</div>
                                                            </div>
                                                        </div>
                                                        <div className="listingDetails">
                                                            <div className="listingMainInfo">
                                                                <h3 className="listingName">
                                                                    {selectedCity} Restaurant {index + 1}
                                                                </h3>
                                                                <p className="listingAddress">
                                                                    {789 + index * 10} Dining Street, {selectedCity}
                                                                </p>
                                                                <div className="listingRating">
                                                                    <div className="stars">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <span key={i} className={i < 5 - index * 0.5 ? "star filled" : "star"}>
                                        ★
                                      </span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="ratingText">
                                    {5 - index * 0.5}/5.0 ({90 + index * 20} reviews)
                                  </span>
                                                                </div>
                                                                <p className="listingPrice">
                                                                    {index < 2 ? "$$$" : index < 4 ? "$$" : "$"} • {index < 3 ? "Fine Dining" : "Casual"}
                                                                </p>
                                                                <p className="listingPhone">+1 (555) 456-78{index}9</p>
                                                            </div>
                                                            <div className="listingSecondaryInfo">
                                                                <div className="listingAbout">
                                                                    <h4>About</h4>
                                                                    <p>
                                                                        A {index < 3 ? "high-end" : "cozy"} restaurant serving{" "}
                                                                        {index % 2 === 0 ? "local" : "international"} cuisine with a modern twist.
                                                                    </p>
                                                                </div>
                                                                <div className="listingFeatures">
                                                                    <h4>Features</h4>
                                                                    <ul className="featuresList">
                                                                        <li>{index % 2 === 0 ? "Outdoor" : "Indoor"} Seating</li>
                                                                        <li>Reservations {index < 4 ? "Required" : "Recommended"}</li>
                                                                        <li>{index < 3 ? "Full Bar" : "BYOB"}</li>
                                                                        <li>{index % 2 === 0 ? "Vegan Options" : "Gluten-Free Options"}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeCategory === "Itinerary" && (
                                            <div className="itineraryContainer">
                                                <div className="itineraryHeader">
                                                    <h3 className="itineraryTitle">
                                                        Your {calculateTripDuration()}-Day Trip to {selectedCity}
                                                    </h3>
                                                    <p className="itinerarySubtitle">Personalized itinerary powered by AI</p>
                                                </div>

                                                <div className="itineraryPlaceholder">
                                                    <Calendar size={40} className="mb-3 mx-auto opacity-50" />
                                                    <p className="itineraryMessage">Your personalized itinerary will be generated here</p>
                                                    <p className="itineraryDescription">
                                                        We'll create a day-by-day plan for your {calculateTripDuration()}-day trip to {selectedCity}
                                                        , including recommended hotels, attractions, restaurants, and travel tips.
                                                    </p>
                                                    <div className="itineraryGenerateButton">
                                                        <button className="generateButton">
                                                            <span>Generate Itinerary</span>
                                                            <span className="generateNote"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Action buttons */}
                                <div className="resultsActions">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={resetForm}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Start Over
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footerContent">
                    <p className="copyright">&copy; {new Date().getFullYear()} Travel Advisor. All rights reserved.</p>
                </div>
            </footer>

            {/* Floating orb with chat functionality */}
            <motion.div
                className="floatingOrb"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFloatingChatOpen(!floatingChatOpen)}
                animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                        "0 5px 15px rgba(56, 189, 248, 0.3)",
                        "0 10px 20px rgba(56, 189, 248, 0.5)",
                        "0 5px 15px rgba(56, 189, 248, 0.3)",
                    ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
                <MessageSquare className="orbIcon" />
            </motion.div>

            {/* Floating Chat Window */}
            {floatingChatOpen && (
                <div className="floatingChatWindow">
                    <div className="floatingChatHeader">
                        <div className="floatingChatTitle">
                            <Globe className="floatingChatIcon" />
                            <span>Travel Assistant</span>
                        </div>
                        <button className="floatingChatClose" onClick={() => setFloatingChatOpen(false)}>
                            &times;
                        </button>
                    </div>
                    <div className="floatingChatBody">
                        <div className="floatingChatMessages" ref={floatingChatRef}>
                            {floatingChatHistory.map((chat, index) => (
                                <div key={index} className={chat.isUser ? "floatingChatUserMessage" : "floatingChatAiMessage"}>
                                    {chat.message}
                                </div>
                            ))}
                        </div>
                        <div className="floatingChatInput">
              <textarea
                  className="floatingChatTextarea"
                  placeholder="Ask about your trip..."
                  value={floatingChatMessage}
                  onChange={(e) => setFloatingChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendFloatingChatMessage()
                      }
                  }}
              />
                            <button className="floatingChatSend" onClick={sendFloatingChatMessage}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
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