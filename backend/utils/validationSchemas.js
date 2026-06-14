import { z } from "zod";

export const MAX_TIMER_SAVE_SECONDS = 6 * 60 * 60;

export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be 100 characters or less"),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email")
        .max(100, "Email must be 100 characters or less"),
    password: z
        .string()
        .min(3, "Password must be at least 3 characters")
        .max(72, "Password must be 72 characters or less")
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email"),
    password: z
        .string()
        .min(1, "Password is required")
});

export const timerSaveSchema = z.object({
    totalTime: z.coerce
        .number()
        .int("Time must be a whole number of seconds")
        .positive("Time must be greater than 0")
        .max(MAX_TIMER_SAVE_SECONDS, "Saved time cannot be more than 6 hours")
});

export const getValidationMessage = (error) =>
    error.issues?.[0]?.message || "Invalid input";
