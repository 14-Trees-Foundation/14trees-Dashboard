export function strEquals(s1: string, s2: string) {
    const a = s1.trim(), b = s2.trim()

    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}