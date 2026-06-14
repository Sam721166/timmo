export const APP_TIME_ZONE = process.env.APP_TIME_ZONE || "Asia/Kolkata"

// YYYY-MM-DD in the app timezone (not UTC/server timezone)
export const localDateKey = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: APP_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date)

    const values = Object.fromEntries(
        parts
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value])
    )

    return `${values.year}-${values.month}-${values.day}`
}

// Build { date, time } for the last N days (inclusive of today)
export const buildDailySeries = (days, dateMap) => {
    const series = []
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = localDateKey(date)
        series.push({
            date: dateStr,
            time: dateMap.get(dateStr) || 0
        })
    }
    return series
}
