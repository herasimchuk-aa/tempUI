
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
    if (/^[a-zA-Z\-]+$/.test(name)) {
        return (true)
    }
    return (false)
}

export function validateEmail(email) {
    if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return (true)
    }
    return (false)
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