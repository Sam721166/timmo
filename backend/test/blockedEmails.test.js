import assert from "node:assert/strict";
import test from "node:test";
import { isBlockedEmail } from "../utils/blockedEmails.js";

test("isBlockedEmail returns false when BLOCKED_EMAILS is not set or empty", () => {
    const originalBlocked = process.env.BLOCKED_EMAILS;
    
    process.env.BLOCKED_EMAILS = "";
    assert.equal(isBlockedEmail("test@example.com"), false);
    
    delete process.env.BLOCKED_EMAILS;
    assert.equal(isBlockedEmail("test@example.com"), false);
    
    process.env.BLOCKED_EMAILS = originalBlocked;
});

test("isBlockedEmail returns true if email is in blocked list", () => {
    const originalBlocked = process.env.BLOCKED_EMAILS;
    
    // Test normal comma-separated list
    process.env.BLOCKED_EMAILS = "blocked1@example.com,blocked2@example.com, blocked3@example.com ";
    assert.equal(isBlockedEmail("blocked1@example.com"), true);
    assert.equal(isBlockedEmail("BLOCKED2@EXAMPLE.COM"), true);
    assert.equal(isBlockedEmail(" blocked3@example.com "), true);
    assert.equal(isBlockedEmail("allowed@example.com"), false);
    
    // Test list formatted with quotes around individual emails, e.g. "email1", "email2"
    process.env.BLOCKED_EMAILS = '"sam.de.721166@gmail.com"';
    assert.equal(isBlockedEmail("allowed@example.com"), false);
    
    // Empty email input
    assert.equal(isBlockedEmail(""), false);
    assert.equal(isBlockedEmail(null), false);

    process.env.BLOCKED_EMAILS = originalBlocked;
});
