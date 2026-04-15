/**
 * Validates a date from text input in French format (DD/MM/YYYY or DD-MM-YYYY) 
 * and converts it to a Date object.
 * @param dateString - The date string in French format
 * @returns Date object if valid, null if invalid
 */
export function validateDate(dateString: string): Date | null {
    if (!dateString || typeof dateString !== 'string') {
        return null;
    }

    // Remove any extra whitespace
    const trimmed = dateString.trim();

    // French date formats: DD/MM/YYYY or DD-MM-YYYY
    const frenchDateRegex = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
    const match = trimmed.match(frenchDateRegex);

    if (!match) {
        return null;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Basic validation
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
        return null;
    }

    // Create date object (month is 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day);

    // Validate that the date is actually valid (handles leap years, month lengths, etc.)
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

/**
 * Validates a date and throws an error if invalid
 * @param dateString - The date string in French format
 * @returns Date object if valid
 * @throws Error if invalid
 */
export function validateDateStrict(dateString: string): Date {
    const date = validateDate(dateString);
    if (!date) {
        throw new Error(`Invalid French date format: "${dateString}". Expected DD/MM/YYYY or DD-MM-YYYY`);
    }
    return date;
}

/**
 * Validates the format of a GUID string.
 * Accepts GUIDs with or without curly braces.
 * @param guidString - The GUID string to validate
 * @returns true if valid GUID format, false otherwise
 */
export function validateGuid(guidString: string): boolean {
    if (!guidString || typeof guidString !== 'string') {
        return false;
    }

    // Remove any extra whitespace
    const trimmed = guidString.trim();

    // GUID regex pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    // With optional curly braces: {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
    const guidRegex = /^(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?$/;

    const match = trimmed.match(guidRegex);
    if (!match) {
        return false;
    }

    // If it starts with {, it must end with }
    const hasOpenBrace = match[1] === '{';
    const hasCloseBrace = match[2] === '}';

    return hasOpenBrace === hasCloseBrace;
}

/**
 * Validates a GUID and throws an error if invalid
 * @param guidString - The GUID string to validate
 * @returns the original GUID string if valid
 * @throws Error if invalid
 */
export function validateGuidStrict(guidString: string): string {
    if (!validateGuid(guidString)) {
        throw new Error(`Invalid GUID format: "${guidString}". Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`);
    }
    return guidString.trim();
}

/**
 * Validates the format of an IPv6 address string.
 * Supports standard, compressed, and IPv4-embedded IPv6 formats.
 * @param ipv6String - The IPv6 address string to validate
 * @returns true if valid IPv6 format, false otherwise
 */
export function validateIPV6(ipv6String: string): boolean {
    if (!ipv6String || typeof ipv6String !== 'string') {
        return false;
    }

    const trimmed = ipv6String.trim();

    // Check for IPv4-embedded IPv6 (mixed format)
    const mixedRegex = /^(([0-9a-fA-F]{1,4}:){6,6})([0-9]{1,3}\.){3,3}[0-9]{1,3}$/;
    const compressedMixedRegex = /^(([0-9a-fA-F]{1,4}:){0,4}::([0-9a-fA-F]{1,4}:){0,4})([0-9]{1,3}\.){3,3}[0-9]{1,3}$/;

    if (mixedRegex.test(trimmed) || compressedMixedRegex.test(trimmed)) {
        return validateMixedIPv6(trimmed);
    }

    // Check for compressed format (contains ::)
    if (trimmed.includes('::')) {
        return validateCompressedIPv6(trimmed);
    }

    // Check for standard format (8 groups of hex digits)
    const standardRegex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return standardRegex.test(trimmed);
}

/**
 * Helper function to validate compressed IPv6 format
 */
function validateCompressedIPv6(ipv6: string): boolean {
    const parts = ipv6.split('::');

    // :: can only appear once
    if (parts.length !== 2) {
        return false;
    }

    const [left, right] = parts;
    const leftGroups = left ? left.split(':') : [];
    const rightGroups = right ? right.split(':') : [];

    // Total groups after expansion should be <= 8
    const totalGroups = leftGroups.length + rightGroups.length;
    if (totalGroups >= 8) {
        return false;
    }

    // Validate each group
    const hexGroupRegex = /^[0-9a-fA-F]{1,4}$/;

    for (const group of leftGroups) {
        if (group && !hexGroupRegex.test(group)) {
            return false;
        }
    }

    for (const group of rightGroups) {
        if (group && !hexGroupRegex.test(group)) {
            return false;
        }
    }

    return true;
}

/**
 * Helper function to validate IPv4-embedded IPv6 format
 */
function validateMixedIPv6(ipv6: string): boolean {
    const parts = ipv6.split(':');
    const lastPart = parts[parts.length - 1];

    // Validate IPv4 part
    const ipv4Parts = lastPart.split('.');
    if (ipv4Parts.length !== 4) {
        return false;
    }

    for (const part of ipv4Parts) {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 0 || num > 255) {
            return false;
        }
    }

    // Validate IPv6 part (excluding the last IPv4 part)
    const ipv6Part = parts.slice(0, -1).join(':');
    if (ipv6Part.includes('::')) {
        return validateCompressedIPv6(ipv6Part + '::0');
    } else {
        const hexGroupRegex = /^[0-9a-fA-F]{1,4}$/;
        for (const group of parts.slice(0, -1)) {
            if (!hexGroupRegex.test(group)) {
                return false;
            }
        }
        return parts.length === 7; // 6 IPv6 groups + 1 IPv4 group
    }
}

