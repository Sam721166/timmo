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

// Get year, month, day, hour, minute, second components in the target timezone
export const getLocalDateComponents = (date, timeZone = APP_TIME_ZONE) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });
    const parts = formatter.formatToParts(date);
    const values = {};
    for (const part of parts) {
        if (part.type !== "literal") {
            values[part.type] = part.value;
        }
    }
    return {
        year: parseInt(values.year, 10),
        month: parseInt(values.month, 10),
        day: parseInt(values.day, 10),
        hour: parseInt(values.hour, 10),
        minute: parseInt(values.minute, 10),
        second: parseInt(values.second, 10)
    };
};

// Convert local time components in target timezone back to UTC Date
export const localTimeToDate = (year, month, day, hour, minute, second, timeZone = APP_TIME_ZONE) => {
    const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
    const components = getLocalDateComponents(new Date(utcGuess), timeZone);
    
    const utcGuessFormatted = Date.UTC(
        components.year,
        components.month - 1,
        components.day,
        components.hour,
        components.minute,
        components.second
    );
    const offset = utcGuessFormatted - utcGuess;
    return new Date(utcGuess - offset);
};

// Split totalSeconds into daily date keys (YYYY-MM-DD) and seconds spent on that day
export const splitTimeIntervalByDay = (totalSeconds, endTime = new Date(), timeZone = APP_TIME_ZONE) => {
    const startTime = new Date(endTime.getTime() - totalSeconds * 1000);
    const intervals = [];
    
    let currentStart = startTime;
    
    while (currentStart < endTime) {
        const startComponents = getLocalDateComponents(currentStart, timeZone);
        
        // Find 00:00:00 of the next day in the local timezone
        const nextDayMidnight = localTimeToDate(
            startComponents.year,
            startComponents.month,
            startComponents.day + 1,
            0,
            0,
            0,
            timeZone
        );
        
        const currentEnd = nextDayMidnight < endTime ? nextDayMidnight : endTime;
        const durationSeconds = Math.round((currentEnd.getTime() - currentStart.getTime()) / 1000);
        
        if (durationSeconds > 0) {
            intervals.push({
                date: localDateKey(currentStart),
                time: durationSeconds
            });
        }
        
        currentStart = currentEnd;
    }
    
    return intervals;
};
