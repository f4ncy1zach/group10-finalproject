"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    StampIcon as Passport,
    DollarSign,
    Plane,
    MapPin,
    Calendar,
    ArrowRight,
    ArrowLeft,
    ChevronDown,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Slider } from "../components/ui/slider"
import { format } from "date-fns"

export default function QuestionFlow({
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
                                     }) {
    return (
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
                            <Button onClick={nextStep} className="nextButton" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                            <Button onClick={nextStep} className="nextButton" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                                            <button className="calendarNavButton" onClick={() => onPrevMonth(currentMonth, setCurrentMonth)}>
                                                <ArrowLeft size={18} />
                                            </button>
                                            <div className="calendarMonthTitle">{format(currentMonth, "MMMM yyyy")}</div>
                                            <button className="calendarNavButton" onClick={() => onNextMonth(currentMonth, setCurrentMonth)}>
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
                                            <button className="calendarNavButton" onClick={() => onPrevMonth(returnMonth, setReturnMonth)}>
                                                <ArrowLeft size={18} />
                                            </button>
                                            <div className="calendarMonthTitle">{format(returnMonth, "MMMM yyyy")}</div>
                                            <button className="calendarNavButton" onClick={() => onNextMonth(returnMonth, setReturnMonth)}>
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
            </motion.div>
        </AnimatePresence>
    )
}