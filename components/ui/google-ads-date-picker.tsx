"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface DateRange {
  start: Date | undefined
  end: Date | undefined
}

interface GoogleAdsDatePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  onCompareChange?: (enabled: boolean, compareRange?: DateRange) => void
  onCancel?: () => void
  className?: string
}

type PresetKey =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "last7Days"
  | "lastWeek"
  | "last14Days"
  | "thisMonth"
  | "last30Days"
  | "lastMonth"
  | "allTime"

interface Preset {
  key: PresetKey
  label: string
  hasArrow?: boolean
  getDateRange: () => DateRange
}

// Date calculation utilities
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day // Adjust to Sunday
  return new Date(d.setDate(diff))
}

const getEndOfWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() + (6 - day) // Adjust to Saturday
  return new Date(d.setDate(diff))
}

const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const isSameDay = (date1: Date | undefined, date2: Date | undefined): boolean => {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isInRange = (date: Date, start: Date | undefined, end: Date | undefined): boolean => {
  if (!start || !end) return false
  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}

export function GoogleAdsDatePicker({
  value,
  onChange,
  onCompareChange,
  onCancel,
  className
}: GoogleAdsDatePickerProps) {
  const today = new Date()

  // Default to Last 7 days if no value provided
  const defaultRange = value || {
    start: addDays(today, -6),
    end: today
  }

  const [selectedRange, setSelectedRange] = React.useState<DateRange>(defaultRange)
  const [tempRange, setTempRange] = React.useState<DateRange>(defaultRange)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [activePreset, setActivePreset] = React.useState<PresetKey | null>("last7Days")
  const [compareEnabled, setCompareEnabled] = React.useState(false)
  const [compareOption, setCompareOption] = React.useState<"yesterday" | "previousYear" | "custom">("yesterday")
  const [compareRange, setCompareRange] = React.useState<DateRange>({ start: undefined, end: undefined })
  const [customDaysToday, setCustomDaysToday] = React.useState("30")
  const [customDaysYesterday, setCustomDaysYesterday] = React.useState("30")
  const [selectingStart, setSelectingStart] = React.useState(true)
  const [selectingCompareStart, setSelectingCompareStart] = React.useState(true)

  // Define presets
  const presets: Preset[] = [
    {
      key: "today",
      label: "Today",
      getDateRange: () => ({ start: today, end: today })
    },
    {
      key: "yesterday",
      label: "Yesterday",
      getDateRange: () => {
        const yesterday = addDays(today, -1)
        return { start: yesterday, end: yesterday }
      }
    },
    {
      key: "thisWeek",
      label: "This week (Sun – Today)",
      hasArrow: true,
      getDateRange: () => ({
        start: getStartOfWeek(today),
        end: today
      })
    },
    {
      key: "last7Days",
      label: "Last 7 days",
      getDateRange: () => ({
        start: addDays(today, -6),
        end: today
      })
    },
    {
      key: "lastWeek",
      label: "Last week (Sun – Sat)",
      hasArrow: true,
      getDateRange: () => {
        const lastWeekEnd = addDays(getStartOfWeek(today), -1)
        const lastWeekStart = getStartOfWeek(lastWeekEnd)
        return { start: lastWeekStart, end: lastWeekEnd }
      }
    },
    {
      key: "last14Days",
      label: "Last 14 days",
      getDateRange: () => ({
        start: addDays(today, -13),
        end: today
      })
    },
    {
      key: "thisMonth",
      label: "This month",
      getDateRange: () => ({
        start: getStartOfMonth(today),
        end: today
      })
    },
    {
      key: "last30Days",
      label: "Last 30 days",
      getDateRange: () => ({
        start: addDays(today, -29),
        end: today
      })
    },
    {
      key: "lastMonth",
      label: "Last month",
      getDateRange: () => {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        return {
          start: getStartOfMonth(lastMonth),
          end: getEndOfMonth(lastMonth)
        }
      }
    },
    {
      key: "allTime",
      label: "All time",
      getDateRange: () => ({
        start: new Date(2020, 0, 1),
        end: today
      })
    }
  ]

  const handlePresetClick = (preset: Preset) => {
    const range = preset.getDateRange()
    setTempRange(range)
    setActivePreset(preset.key)
    setSelectingStart(true)

    // Auto-calculate compare range if compare is enabled
    if (compareEnabled && range.start && range.end) {
      const compareRangeResult = calculateCompareRange(range, compareOption)
      setCompareRange(compareRangeResult)
    }
  }

  // Calculate compare range based on option
  const calculateCompareRange = (mainRange: DateRange, option: "yesterday" | "previousYear" | "custom"): DateRange => {
    if (!mainRange.start || !mainRange.end) return { start: undefined, end: undefined }

    const daysDiff = Math.ceil((mainRange.end.getTime() - mainRange.start.getTime()) / (1000 * 60 * 60 * 24))

    if (option === "yesterday") {
      const end = addDays(mainRange.end, -1)
      const start = addDays(end, -daysDiff)
      return { start, end }
    } else if (option === "previousYear") {
      const start = new Date(mainRange.start)
      start.setFullYear(start.getFullYear() - 1)
      const end = new Date(mainRange.end)
      end.setFullYear(end.getFullYear() - 1)
      return { start, end }
    }

    return { start: undefined, end: undefined }
  }

  // Navigate date range backward/forward
  const shiftDateRange = (direction: "prev" | "next") => {
    if (!tempRange.start || !tempRange.end) return

    const daysDiff = Math.ceil((tempRange.end.getTime() - tempRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const shift = direction === "prev" ? -daysDiff : daysDiff

    const newStart = addDays(tempRange.start, shift)
    const newEnd = addDays(tempRange.end, shift)

    setTempRange({ start: newStart, end: newEnd })

    if (compareEnabled) {
      const compareRangeResult = calculateCompareRange({ start: newStart, end: newEnd }, compareOption)
      setCompareRange(compareRangeResult)
    }
  }

  const handleDateClick = (date: Date) => {
    // If compare is enabled and custom mode is selected, allow clicking for compare range
    if (compareEnabled && compareOption === "custom") {
      if (selectingCompareStart) {
        setCompareRange({ start: date, end: undefined })
        setSelectingCompareStart(false)
      } else {
        if (compareRange.start && date < compareRange.start) {
          setCompareRange({ start: date, end: compareRange.start })
        } else {
          setCompareRange({ start: compareRange.start, end: date })
        }
        setSelectingCompareStart(true)
      }
    } else {
      // Normal date selection for main range
      if (selectingStart) {
        setTempRange({ start: date, end: undefined })
        setSelectingStart(false)
        setActivePreset(null)
      } else {
        if (tempRange.start && date < tempRange.start) {
          setTempRange({ start: date, end: tempRange.start })
        } else {
          setTempRange({ start: tempRange.start, end: date })
        }
        setSelectingStart(true)
        setActivePreset(null)
      }
    }
  }

  const handleApply = () => {
    setSelectedRange(tempRange)
    onChange?.(tempRange)
    if (compareEnabled) {
      onCompareChange?.(true, compareRange)
    }
  }

  const handleCancel = () => {
    setTempRange(selectedRange)
    onCancel?.() // Close the dropdown
  }

  const handleCustomDaysApply = (daysAgo: number, includeToday: boolean) => {
    const endDate = includeToday ? today : addDays(today, -1)
    const startDate = addDays(endDate, -(daysAgo - 1))
    const range = { start: startDate, end: endDate }
    setSelectedRange(range)
    setActivePreset(null)
    onChange?.(range)
  }

  const formatDate = (date: Date | undefined, format: "input" | "display" = "display"): string => {
    if (!date) return ""
    if (format === "input") {
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const generateCalendarDays = (month: Date) => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, monthIndex, -(startingDayOfWeek - i - 1))
      days.push(prevMonthDay)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, monthIndex, day))
    }

    // Add days from next month to complete the grid
    const remainingCells = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push(new Date(year, monthIndex + 1, i))
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
  }

  const renderCalendar = (monthOffset: number) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1)
    const days = generateCalendarDays(month)
    const monthYear = month.getMonth()

    return (
      <div className="w-full mb-6">
        <div className="text-center font-semibold text-base mb-4 text-gray-800">
          {getMonthName(month)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs font-semibold text-gray-600 py-2 h-8 flex items-center justify-center">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) return <div key={index} className="h-10" />

            const isCurrentMonth = day.getMonth() === monthYear
            const isToday = isSameDay(day, today)
            const isStart = isSameDay(day, tempRange.start)
            const isEnd = isSameDay(day, tempRange.end)
            const inRange = isInRange(day, tempRange.start, tempRange.end)

            // Compare range highlighting
            const isCompareStart = compareEnabled && isSameDay(day, compareRange.start)
            const isCompareEnd = compareEnabled && isSameDay(day, compareRange.end)
            const inCompareRange = compareEnabled && isInRange(day, compareRange.start, compareRange.end)

            return (
              <button
                key={index}
                onClick={() => isCurrentMonth && handleDateClick(day)}
                disabled={!isCurrentMonth}
                className={cn(
                  "h-10 w-full text-sm relative rounded flex items-center justify-center min-w-[40px]",
                  "hover:bg-blue-50 transition-colors",
                  !isCurrentMonth && "text-gray-300 cursor-not-allowed",
                  isCurrentMonth && "text-gray-900 font-medium",
                  inRange && !inCompareRange && "bg-blue-50",
                  inCompareRange && !inRange && "bg-blue-100 border border-blue-300",
                  (isStart || isEnd) && "bg-blue-500 text-white hover:bg-blue-600 font-semibold",
                  (isCompareStart || isCompareEnd) && "bg-blue-400 text-white hover:bg-blue-500 font-semibold border-2 border-blue-600",
                  isToday && !isStart && !isEnd && !isCompareStart && !isCompareEnd && "relative"
                )}
              >
                {isToday && !isStart && !isEnd && !isCompareStart && !isCompareEnd && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{day.getDate()}</span>
                    </div>
                  </div>
                )}
                {(!isToday || isStart || isEnd || isCompareStart || isCompareEnd) && (
                  <span className="text-sm">{day.getDate()}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex bg-white rounded-lg shadow-lg border", className)}>
      {/* Left Sidebar - Presets */}
      <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
        <div className="text-sm text-gray-500 mb-4">Custom</div>

        <div className="space-y-1">
          {presets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between",
                activePreset === preset.key
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <span>{preset.label}</span>
              {preset.hasArrow && <ChevronRight className="h-3 w-3" />}
            </button>
          ))}
        </div>

        {/* Custom Days Input */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={customDaysToday}
              onChange={(e) => setCustomDaysToday(e.target.value)}
              className="w-16 h-8 text-sm"
              min="1"
            />
            <button
              onClick={() => handleCustomDaysApply(parseInt(customDaysToday), true)}
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              days up to today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={customDaysYesterday}
              onChange={(e) => setCustomDaysYesterday(e.target.value)}
              className="w-16 h-8 text-sm"
              min="1"
            />
            <button
              onClick={() => handleCustomDaysApply(parseInt(customDaysYesterday), false)}
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              days up to yesterday
            </button>
          </div>
        </div>

        {/* Compare Toggle */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-3">
            <Switch
              checked={compareEnabled}
              onCheckedChange={(checked) => {
                setCompareEnabled(checked)
                if (checked && tempRange.start && tempRange.end) {
                  const compareRangeResult = calculateCompareRange(tempRange, compareOption)
                  setCompareRange(compareRangeResult)
                }
                onCompareChange?.(checked)
              }}
            />
            <span className="text-sm text-gray-700">Compare</span>
          </div>

          {/* Compare Period Options */}
          {compareEnabled && (
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setCompareOption("yesterday")
                  if (tempRange.start && tempRange.end) {
                    const compareRangeResult = calculateCompareRange(tempRange, "yesterday")
                    setCompareRange(compareRangeResult)
                  }
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded transition-colors",
                  compareOption === "yesterday"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                Previous period
              </button>
              <button
                onClick={() => {
                  setCompareOption("previousYear")
                  if (tempRange.start && tempRange.end) {
                    const compareRangeResult = calculateCompareRange(tempRange, "previousYear")
                    setCompareRange(compareRangeResult)
                  }
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded transition-colors",
                  compareOption === "previousYear"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                Previous year
              </button>
              <button
                onClick={() => {
                  setCompareOption("custom")
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded transition-colors",
                  compareOption === "custom"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                Custom
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Calendar */}
      <div className="flex-1 p-6 flex flex-col overflow-hidden" style={{ maxHeight: '600px' }}>
        {/* Date Inputs */}
        <div className="space-y-4 mb-6 flex-shrink-0">
          {/* Main Date Range */}
          <div className="flex items-center gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Start date *</label>
              <Input
                type="text"
                value={formatDate(tempRange.start, "input")}
                className="w-32 h-9 text-sm"
                readOnly
              />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div>
              <label className="text-xs text-gray-600 block mb-1">End date *</label>
              <Input
                type="text"
                value={formatDate(tempRange.end, "display")}
                className="w-36 h-9 text-sm"
                readOnly
              />
            </div>
          </div>

          {/* Compare Date Range */}
          {compareEnabled && (
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs text-blue-600 block mb-1">Compare start *</label>
                <Input
                  type="text"
                  value={formatDate(compareRange.start, "input")}
                  className="w-32 h-9 text-sm border-blue-300 bg-blue-50"
                  readOnly
                />
              </div>
              <span className="text-blue-400 mt-5">–</span>
              <div>
                <label className="text-xs text-blue-600 block mb-1">Compare end *</label>
                <Input
                  type="text"
                  value={formatDate(compareRange.end, "display")}
                  className="w-36 h-9 text-sm border-blue-300 bg-blue-50"
                  readOnly
                />
              </div>
              {compareOption === "custom" && (
                <div className="text-xs text-gray-500 ml-2">
                  (Click calendar to select)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date Range Navigation */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => shiftDateRange("prev")}
              className="h-8 w-8 p-0"
              disabled={!tempRange.start || !tempRange.end}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-sm">
              <span className="font-medium">{activePreset ? presets.find(p => p.key === activePreset)?.label : "Custom"}</span>
              {tempRange.start && tempRange.end && (
                <span className="text-gray-600 ml-2">
                  {formatDate(tempRange.start, "display")} – {formatDate(tempRange.end, "display")}
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => shiftDateRange("next")}
              className="h-8 w-8 p-0"
              disabled={!tempRange.start || !tempRange.end}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid - Vertical Scroll */}
        <div
          className="overflow-y-auto pr-2 scroll-smooth"
          style={{
            maxHeight: '400px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          <div className="space-y-6">
            {renderCalendar(-1)}
            {renderCalendar(0)}
            {renderCalendar(1)}
            {renderCalendar(2)}
            {renderCalendar(3)}
          </div>
        </div>

        {/* Apply/Cancel Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t mt-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="h-9 px-6 bg-blue-600 hover:bg-blue-700"
            disabled={!tempRange.start || !tempRange.end}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
