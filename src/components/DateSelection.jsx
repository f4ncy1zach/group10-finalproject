// Date selection by implementing calendar functionality
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Calendar, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isBefore,
    addMonths,
    subMonths,
} from "date-fns"

export default function DateSelection({
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
                                          calculateTripDuration,
                                          calendarRef,
                                          returnCalendarRef,
                                          nextStep,
                                          prevStep,
                                          isReturn,
                                          title,
                                      }) {
    // Get the current date values based on whether this is for departure or return
    const currentDate = isReturn ? returnDate : departDate
    const setCurrentDate = isReturn ? setReturnDate : setDepartDate
    const isCalendarOpen = isReturn ? returnCalendarOpen : calendarOpen
    const setIsCalendarOpen = isReturn ? setReturnCalendarOpen : setCalendarOpen
    const monthToDisplay = isReturn ? returnMonth : currentMonth
    const setMonthToDisplay = isReturn ? setReturnMonth : setCurrentMonth
    const currentRef = isReturn ? returnCalendarRef : calendarRef

    // Get days for the current month
    const getDaysInMonth = (date) => {
        const start = startOfMonth(date)
        const end = endOfMonth(date)
        return eachDayOfInterval({ start, end })
    }

    // Get day names
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Get days in the current month
    const daysInMonth = getDaysInMonth(monthToDisplay)

    // Get the day of the week for the first day of the month (0-6)
    const firstDayOfMonth = startOfMonth(monthToDisplay).getDay()

    // Handle previous month
    const handlePrevMonth = () => {
        setMonthToDisplay(subMonths(monthToDisplay, 1))
    }

    // Handle next month
    const handleNextMonth = () => {
        setMonthToDisplay(addMonths(monthToDisplay, 1))
    }

    // Check if a date is disabled
    const isDateDisabled = (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isReturn) {
            return departDate ? isBefore(date, departDate) : isBefore(date, today)
        } else {
            return isBefore(date, today)
        }
    }

    return (
        <motion.div
            key={`date-selection-${isReturn ? "return" : "depart"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glassCard"
            whileHover={{
                boxShadow: "0 10px 25px rgba(56, 189, 248, 0.3)",
                y: -5,
            }}
            style={{ minHeight: "600px" }} /* Added to ensure enough vertical space */
        >
            <div className="formStep">
                <div className="questionHeader">
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="questionIcon"
                    >
                        <Calendar className="stepIcon" />
                    </motion.div>
                    <h2 className="questionText">{title}</h2>
                </div>

                <div className="inputContainer" ref={currentRef}>
                    <div className="dateButton" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                        {currentDate ? format(currentDate, "PPP") : `Select ${isReturn ? "return" : "departure"} date`}
                        <ChevronDown size={16} />
                    </div>

                    {isReturn && departDate && returnDate && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tripDuration">
                            <div className="tripDurationText">Trip duration: {calculateTripDuration()} days</div>
                        </motion.div>
                    )}

                    {isCalendarOpen && (
                        <div className="calendarPopover">
                            <div className="calendar">
                                <div className="calendarHeader">
                                    <button className="calendarNavButton" onClick={handlePrevMonth}>
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="calendarMonthTitle">{format(monthToDisplay, "MMMM yyyy")}</div>
                                    <button className="calendarNavButton" onClick={handleNextMonth}>
                                        <ArrowRight size={18} />
                                    </button>
                                </div>

                                <div className="calendarBody">
                                    <div className="calendarDayNames">
                                        {dayNames.map((day) => (
                                            <div key={day} className="calendarDayName">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="calendarDays">
                                        {/* Empty cells for days before the first of the month */}
                                        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                                            <div key={`empty-start-${index}`} className="calendarDayEmpty"></div>
                                        ))}

                                        {/* Calendar days */}
                                        {daysInMonth.map((date) => {
                                            const day = date.getDate()
                                            const isSelected = currentDate && isSameDay(date, currentDate)
                                            const disabled = isDateDisabled(date)

                                            return (
                                                <button
                                                    key={day}
                                                    className={`calendarDay ${isSelected ? "calendarDaySelected" : ""} ${
                                                        disabled ? "calendarDayDisabled" : ""
                                                    }`}
                                                    onClick={() => {
                                                        if (!disabled) {
                                                            setCurrentDate(date)
                                                            setIsCalendarOpen(false)
                                                        }
                                                    }}
                                                    disabled={disabled}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
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
                        disabled={!currentDate}
                        className="nextButton"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Next
                        <ArrowRight className="buttonIcon" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}