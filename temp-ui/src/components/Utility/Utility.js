
var urlProtocolRegex = /^((http|https):\/\/)/
var urlRegex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}))(:0{0}(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/

export function validateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false)
}

/**
 * Remove protocol from given url
 * @param url The url
 * @returns {*} The url without protocol
 */
export function trimUrlProtocol(url) {
    return urlHasProtocol(url) ? url.replace(/(^\w+:|^)\/\//, '') : url
}

/**
 * Return true if the given url contains protocol
 * @param url The url
 * @returns {boolean} True if given url contains protocol
 */
export function urlHasProtocol(url){
    return urlProtocolRegex.test(url)
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

export function validateUrl(url) {
    let urlWithoutProtocol = trimUrlProtocol(url);
    if (urlRegex.test(urlWithoutProtocol)) {
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

export function getNameById(ids, data) {
    let arr = []
    if (ids && ids.length) {
        ids.map((item) => {
            data.find((key) => {
                if (item == key.Id) {
                    arr.push(key.Name)
                }
            })

        })
    }
    return arr
}

/**
 * Updates server URL globalle
 * @param url The new server url
 */
export function updateServerURL(url){
    if(!urlHasProtocol(url)){
        url = "http://"+url
    }
    if(validateUrl(url)) {
        Window.invaderServerAddress = url;
    }
}

/**
 * Given an URL it returns the base
 * Example: http://localhost:8080/endpoint => http://localhost:8080
 */
export function getUrlBase(url){
    return url.split("/#")[0]+"/#"
}

/**
 * Return function to sort array according to multiple keys
 * @param keys The keys to use to sort the array
 * @returns {Function} The sort function
 */
export function sortByMultipleKey(keys) {
    return function(a, b) {
        if (keys.length == 0) return 0; // force to equal if values run out
        var key = keys[0]; // take out the first key
        if (a[key] < b[key]) return -1; // will be 1 if DESC
        else if (a[key] > b[key]) return 1; // will be -1 if DESC
        else return sortByMultipleKey(keys.slice(1))(a, b);
    }
}