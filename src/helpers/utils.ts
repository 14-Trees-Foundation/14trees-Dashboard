import moment from "moment";

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

export function getFormattedDate(dateStr: string) { 
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const isValidDate = !isNaN(date.getDate()) && date.getTime() > 0;
        return isValidDate ? `${day}-${month}-${year}` : ''
}

export function getHumanReadableDate(dateStr: string) { 
    const date = new Date(dateStr);
    const isValidDate = !isNaN(date.getDate()) && date.getTime() > 0;
    return isValidDate ? moment(date).format('MMMM DD, YYYY') : '';
}