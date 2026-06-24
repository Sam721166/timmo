import assert from "node:assert/strict";
import test from "node:test";

import {
    getCreditedSessionSeconds,
    MAX_SESSION_DURATION_MS
} from "../utils/sessionDuration.js";

test("does not credit a forged grace period", () => {
    const result = getCreditedSessionSeconds({
        reportedSeconds: 60,
        startTime: new Date(0),
        endTime: new Date(10)
    });

    assert.equal(result.creditedSeconds, 0);
});

test("caps client-reported time at server-observed elapsed time", () => {
    const result = getCreditedSessionSeconds({
        reportedSeconds: 60,
        startTime: new Date(0),
        endTime: new Date(5_900)
    });

    assert.equal(result.creditedSeconds, 5);
});

test("preserves lower active time when a timer was paused", () => {
    const result = getCreditedSessionSeconds({
        reportedSeconds: 5,
        startTime: new Date(0),
        endTime: new Date(60_000)
    });

    assert.equal(result.creditedSeconds, 5);
});

test("credits an honest completed session", () => {
    const result = getCreditedSessionSeconds({
        reportedSeconds: 60,
        startTime: new Date(0),
        endTime: new Date(60_000)
    });

    assert.equal(result.creditedSeconds, 60);
    assert.equal(result.expired, false);
});

test("marks sessions beyond the maximum duration as expired", () => {
    const result = getCreditedSessionSeconds({
        reportedSeconds: 1,
        startTime: new Date(0),
        endTime: new Date(MAX_SESSION_DURATION_MS + 1)
    });

    assert.equal(result.expired, true);
});
