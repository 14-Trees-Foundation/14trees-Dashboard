export function strEquals(s1: string, s2: string) {

    if (s1 == null && s2 !== null) {
        return false
    }

    if (s1 !== null && s2 == null) {
        return false
    }

    if (s1 == null && s2 == null) {
        return true
    }

    const a = s1.trim(), b = s2.trim()

    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}