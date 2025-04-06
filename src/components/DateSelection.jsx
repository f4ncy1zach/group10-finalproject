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

/**
 * DateSelection Component
 * Allows users to select departure or return dates using a calendar
 *
 * @param {Object} props - Component props
 * @param {Date|undefined} props.departDate - Selected departure date
 * @param {Function} props.setDepartDate - Function to update departure date
 * @param {Date|undefined} props.returnDate - Selected return date
 * @param {Function} props.setReturnDate - Function to update return date
 * @param {boolean} props.calendarOpen - Whether departure calendar is open
 * @param {Function} props.setCalendarOpen - Function to toggle departure calendar
 * @param {boolean} props.returnCalendarOpen - Whether return calendar is open
 * @param {Function} props.setReturnCalendarOpen - Function to toggle return calendar
 * @param {Date} props.currentMonth - Current month displayed in departure calendar
 * @param {Function} props.setCurrentMonth - Function to update departure calendar month
 * @param {Date} props.returnMonth - Current month displayed in return calendar
 * @param {Function} props.setReturnMonth - Function to update return calendar month
 * @param {Function} props.calculateTripDuration - Function to calculate trip duration
 * @param {React.RefObject} props.calendarRef - Ref for departure calendar container
 * @param {React.RefObject} props.returnCalendarRef - Ref for return calendar container
 * @param {Function} props.nextStep - Function to advance to next step
 * @param {Function} props.prevStep - Function to go back to previous step
 * @param {boolean} props.isReturn - Whether this is for return date selection
 * @param {string} props.title - Title text for the component
 * @returns {JSX.Element} The date selection component
 */
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
    /**
     * Get the current date values based on whether this is for departure or return
     * This allows the component to be reused for both date selections
     */
    const currentDate = isReturn ? returnDate : departDate
    const setCurrentDate = isReturn ? setReturnDate : setDepartDate
    const isCalendarOpen = isReturn ? returnCalendarOpen : calendarOpen
    const setIsCalendarOpen = isReturn ? setReturnCalendarOpen : setCalendarOpen
    const monthToDisplay = isReturn ? returnMonth : currentMonth
    const setMonthToDisplay = isReturn ? setReturnMonth : setCurrentMonth
    const currentRef = isReturn ? returnCalendarRef : calendarRef

    /**
     * Gets all days in the current month for the calendar
     *
     * @param {Date} date - Date within the month to display
     * @returns {Date[]} Array of dates for each day in the month
     */
    const getDaysInMonth = (date) => {
        const start = startOfMonth(date)
        const end = endOfMonth(date)
        return eachDayOfInterval({ start, end })
    }

    // Day names for calendar header
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Get days in the current month
    const daysInMonth = getDaysInMonth(monthToDisplay)

    // Get the day of the week for the first day of the month (0-6)
    const firstDayOfMonth = startOfMonth(monthToDisplay).getDay()

    /**
     * Handles navigation to previous month
     */
    const handlePrevMonth = () => {
        setMonthToDisplay(subMonths(monthToDisplay, 1))
    }

    /**
     * Handles navigation to next month
     */
    const handleNextMonth = () => {
        setMonthToDisplay(addMonths(monthToDisplay, 1))
    }

    /**
     * Checks if a date should be disabled in the calendar
     * Prevents selecting dates in the past or return dates before departure
     *
     * @param {Date} date - Date to check
     * @returns {boolean} Whether the date should be disabled
     */
    const isDateDisabled = (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isReturn) {
            // For return dates, disable dates before departure date or today
            return departDate ? isBefore(date, departDate) : isBefore(date, today)
        } else {
            // For departure dates, disable dates before today
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
                    {/* Date selection button */}
                    <div className="dateButton" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                        {currentDate ? format(currentDate, "PPP") : `Select ${isReturn ? "return" : "departure"} date`}
                        <ChevronDown size={16} />
                    </div>

                    {/* Trip duration display (only shown for return date when both dates are selected) */}
                    {isReturn && departDate && returnDate && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tripDuration">
                            <div className="tripDurationText">Trip duration: {calculateTripDuration()} days</div>
                        </motion.div>
                    )}

                    {/* Calendar popover */}
                    {isCalendarOpen && (
                        <div className="calendarPopover">
                            <div className="calendar">
                                {/* Calendar header with month navigation */}
                                <div className="calendarHeader">
                                    <button className="calendarNavButton" onClick={handlePrevMonth} aria-label="Previous month">
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="calendarMonthTitle">{format(monthToDisplay, "MMMM yyyy")}</div>
                                    <button className="calendarNavButton" onClick={handleNextMonth} aria-label="Next month">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>

                                <div className="calendarBody">
                                    {/* Day name headers */}
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
                                                    aria-label={format(date, "PPP")}
                                                    aria-selected={isSelected}
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

                {/* Navigation buttons */}
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