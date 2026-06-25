/**
 * Helper utility to check if an email is blocked.
 * Reads comma-separated blocked emails from the process.env.BLOCKED_EMAILS environment variable.
 */
export const isBlockedEmail = (email) => {
    if (!email) return false;
    
    const blockedEmailsEnv = process.env.BLOCKED_EMAILS;
    if (!blockedEmailsEnv) return false;
    
    const blockedList = blockedEmailsEnv
        .split(",")
        .map(e => e.trim().replace(/^["']|["']$/g, "").toLowerCase())
        .filter(Boolean);
        
    return blockedList.includes(email.trim().toLowerCase());
};
