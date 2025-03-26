"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import {
    Globe,
    Home,
    ArrowRight,
    ArrowLeft,
    Users,
    StampIcon as Passport,
    ChevronDown,
    DollarSign,
    Plane,
    Calendar,
} from "lucide-react"
import "./App.css"

// Simple date formatter function
const formatDate = (date) => {
    if (!date) return ""
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
}

// Format month and year for calendar header
const formatMonthYear = (date) => {
    const options = { month: "long", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
}

function App() {
    const [step, setStep] = useState(0)
    const [travelers, setTravelers] = useState(2)
    const [samePassport, setSamePassport] = useState(null)
    const [passport, setPassport] = useState("")
    const [budget, setBudget] = useState(2000)
    const [origin, setOrigin] = useState("")
    const [departDate, setDepartDate] = useState(undefined)
    const [returnDate, setReturnDate] = useState(undefined)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [returnCalendarOpen, setReturnCalendarOpen] = useState(false)

    // Custom select states
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
    const [originDropdownOpen, setOriginDropdownOpen] = useState(false)

    // Refs for click outside detection
    const countryDropdownRef = useRef(null)
    const originDropdownRef = useRef(null)
    const calendarRef = useRef(null)
    const returnCalendarRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setCountryDropdownOpen(false)
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

    const totalSteps = 8 // Total number of steps in the final project

    const resetForm = () => {
        setStep(0)
        setTravelers(2)
        setSamePassport(null)
        setPassport("")
        setBudget(2000)
        setOrigin("")
        setDepartDate(undefined)
        setReturnDate(undefined)
        setCurrentMonth(new Date())
    }

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

    const countries = [
        "Canada",
        "United States",
        "United Kingdom",
        "France",
        "Germany",
        "Japan",
        "Australia",
        "Brazil",
        "India",
        "South Africa",
    ]

    // Calendar helper functions
    const onPrevMonth = () => {
        const newDate = new Date(currentMonth)
        newDate.setMonth(newDate.getMonth() - 1)
        setCurrentMonth(newDate)
    }

    const onNextMonth = () => {
        const newDate = new Date(currentMonth)
        newDate.setMonth(newDate.getMonth() + 1)
        setCurrentMonth(newDate)
    }

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    return (
        <div className="container">
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

            {/* Progress indicator - More compact */}
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
                                whileHover={{ scale: 1.2 }}
                            >
                                <span className="progressNumber">{i + 1}</span>
                            </motion.div>
                            {i < totalSteps && <div className={`progressLine ${i < step ? "progressLineActive" : ""}`} />}
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
                                    <Button
                                        onClick={nextStep}
                                        className="startButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
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
                                            whileHover={{ scale: 1.2, rotate: 10 }}
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
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant={samePassport === true ? "default" : "outline"}
                                            onClick={() => setSamePassport(true)}
                                            className={`optionButton ${samePassport === true ? "optionButtonActive" : ""}`}
                                        >
                                            Yes
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                                    <div className="customSelect" ref={countryDropdownRef}>
                                        <div className="customSelectTrigger" onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}>
                                            {passport || "Select a country"}
                                            <ChevronDown size={16} />
                                        </div>
                                        {countryDropdownOpen && (
                                            <div className="customSelectDropdown">
                                                {countries.map((country) => (
                                                    <div
                                                        key={country}
                                                        className={`customSelectOption ${passport === country ? "customSelectOptionSelected" : ""}`}
                                                        onClick={() => {
                                                            setPassport(country)
                                                            setCountryDropdownOpen(false)
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
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            ${budget}
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
                                        {departDate ? formatDate(departDate) : "Select departure date"}
                                        <ChevronDown size={16} />
                                    </div>
                                    {calendarOpen && (
                                        <div className="calendarPopover">
                                            <div className="calendar">
                                                <div className="calendarHeader">
                                                    <button className="calendarNavButton" onClick={onPrevMonth}>
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="calendarMonthTitle">{formatMonthYear(currentMonth)}</div>
                                                    <button className="calendarNavButton" onClick={onNextMonth}>
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
                                                    {/* Empty cells for days before the first day of the month */}
                                                    {Array.from({
                                                        length: getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
                                                    }).map((_, i) => (
                                                        <div key={`empty-${i}`}></div>
                                                    ))}

                                                    {/* Calendar days */}
                                                    {Array.from({
                                                        length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
                                                    }).map((_, i) => {
                                                        const day = i + 1
                                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

                                                        // Check if this date is the selected departure date
                                                        const isSelected =
                                                            departDate &&
                                                            departDate.getDate() === day &&
                                                            departDate.getMonth() === currentMonth.getMonth() &&
                                                            departDate.getFullYear() === currentMonth.getFullYear()

                                                        // Disable dates in the past
                                                        const today = new Date()
                                                        today.setHours(0, 0, 0, 0)
                                                        const isDisabled = date < today

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
                                    <h2 className="questionText">WHEN DO YOU WANT TO RETURN?</h2>
                                </div>
                                <div className="inputContainer" ref={returnCalendarRef}>
                                    <div className="dateButton" onClick={() => setReturnCalendarOpen(!returnCalendarOpen)}>
                                        {returnDate ? formatDate(returnDate) : "Select return date"}
                                        <ChevronDown size={16} />
                                    </div>
                                    {returnCalendarOpen && (
                                        <div className="calendarPopover">
                                            <div className="calendar">
                                                <div className="calendarHeader">
                                                    <button className="calendarNavButton" onClick={onPrevMonth}>
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="calendarMonthTitle">{formatMonthYear(currentMonth)}</div>
                                                    <button className="calendarNavButton" onClick={onNextMonth}>
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
                                                    {/* Empty cells for days before the first day of the month */}
                                                    {Array.from({
                                                        length: getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
                                                    }).map((_, i) => (
                                                        <div key={`empty-${i}`}></div>
                                                    ))}

                                                    {/* Calendar days */}
                                                    {Array.from({
                                                        length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
                                                    }).map((_, i) => {
                                                        const day = i + 1
                                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

                                                        // Check if this date is the selected return date
                                                        const isSelected =
                                                            returnDate &&
                                                            returnDate.getDate() === day &&
                                                            returnDate.getMonth() === currentMonth.getMonth() &&
                                                            returnDate.getFullYear() === currentMonth.getFullYear()

                                                        // Disable dates before departure date
                                                        const isDisabled = departDate && date < departDate

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
                                <div className="tripDuration">
                                    {departDate && returnDate && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="tripDurationText"
                                        >
                                            Trip duration: {Math.ceil((returnDate - departDate) / (1000 * 60 * 60 * 24))} days
                                        </motion.div>
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
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footerContent">
                    <p className="copyright">&copy; {new Date().getFullYear()} Travel Advisor. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default App