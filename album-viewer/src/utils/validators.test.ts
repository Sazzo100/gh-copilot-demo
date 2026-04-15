import { describe, expect, it } from "vitest";
import { validateDate, validateIPV6 } from "./validators";

// test the validateDate function
describe("validateDate", () => {
    it("should return a Date for valid date in DD/MM/YYYY format", () => {
        expect(validateDate("01/01/2024")).toBeInstanceOf(Date);
    });

    it("should return null for invalid date format", () => {
        expect(validateDate("2024-01-01")).toBeNull();
    });

    it("should return null for non-date string", () => {
        expect(validateDate("invalid-date")).toBeNull();
    });
});

// test the validateIPV6 function
describe("validateIPV6", () => {
    it("should return true for valid IPv6 address", () => {
        expect(validateIPV6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(true);
    });

    it("should return false for invalid IPv6 address", () => {
        expect(validateIPV6("invalid-ipv6")).toBe(false);
    });
});