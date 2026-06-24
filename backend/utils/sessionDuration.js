export const MAX_SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

export const getCreditedSessionSeconds = ({
    reportedSeconds,
    startTime,
    endTime = new Date()
}) => {
    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();

    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
        throw new TypeError("Invalid session timestamps");
    }

    const elapsedMs = endMs - startMs;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    return {
        expired: elapsedMs > MAX_SESSION_DURATION_MS,
        elapsedSeconds,
        creditedSeconds: Math.min(reportedSeconds, elapsedSeconds)
    };
};
