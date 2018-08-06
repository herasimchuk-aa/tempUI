
export function validateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false)
}

export function trimString(str) {
    if (!str || !str.length)
        return ""
    return str.trim()
}

export function validateName(name) {
    let letters = /^[0-9a-zA-Z]+$/;
    if (name.match(letters)) {
        return true;
    }
    else {
        return false;
    }
}

export function converter(data) {
    let arr = [];
    if (!data || !data.length)
        return arr;
    data.map((item) => {
        arr.push({ 'label': item, 'value': item })
    })
    return arr;
}