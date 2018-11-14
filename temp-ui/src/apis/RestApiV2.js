/**
 * Execute REST request
 * @param method The REST method
 * @param url The target URL
 * @param params The parameters
 * @returns {*|Promise.<T>} The request promise
 */
function doRequest(method,url,params){
    let requestData = {
        method: method,
        headers: getHeader(),
    };
    if(params){
        requestData["body"] = JSON.stringify(params)
    }
    return fetch(getUrl(url),requestData)
        .then(processResponse)
        .catch(error => console.error(`Fetch Error =\n`, error));
}

/**
 * Get request header
 * @returns {{Content-Type: string}}
 */
function getHeader(){
    let header = {
        "Content-Type": "application/json; charset=utf-8"
    };
    if(window.sessionStorage.accessToken!=undefined && window.sessionStorage.accessToken!=""){
        header["Authorization"]="Bearer " + window.sessionStorage.accessToken
    }
    return header
}

/**
 * Get destination url
 * @param url
 */
function getUrl(url){
    return Window.invaderServerAddress + url;
}

/**
 * Process response and return a promise
 * @param response The response obtained by the server
 * @returns {Promise.<{statusCode, data}>} The promise
 */
function processResponse(response) {
    const statusCode = response.status;
    var data = response.text();
    return Promise.all([statusCode, data]).then(res => ({
        statusCode: res[0],
        data: res[1]
    }));
}

/**
 * Execute a GET request on specified URL
 * @param url The target URL
 * @returns {*|Promise.<T>}
 */
export function getRequest(url) {
    return doRequest("GET",url)
}

/**
 * Execute a POST request on specified URL with given parameters
 * @param url  The target URL
 * @param params The request parameters
 * @returns {*|Promise.<T>}
 */
export function postRequest(url, params) {
    return doRequest("POST",url,params)
}

/**
 * Execute a PUT request on specified URL with given parameters
 * @param url The target URL
 * @param params The request parameters
 * @returns {*|Promise.<T>}
 */
export function putRequest(url, params) {
    return doRequest("PUT",url,params)
}