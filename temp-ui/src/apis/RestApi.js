export function getRequest(url) {
    let sourceURL = Window.invaderServerAddress + url;
    return fetch(sourceURL, {
        method: "GET",
        headers: getHeader()
    })
        .then(function (response) {
            // console.log(response)
            return response.json()
        })
        .catch(error => console.error(`Fetch Error =\n`, error));
}

export function postRequest(url, params) {
    let sourceURL = Window.invaderServerAddress + url;

    return fetch(sourceURL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(params), // body data type must match "Content-Type" header
    })
        .then(response => response.json()) // parses response to JSON
        .catch(error => console.error(`Fetch Error =\n`, error));
}

export function putRequest(url, params) {
    let sourceURL = Window.invaderServerAddress + url;
    return fetch(sourceURL, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(params), // body data type must match "Content-Type" header
    })
        .then(response => response.json()) // parses response to JSON
        .catch(error => console.error(`Fetch Error =\n`, error));
}

export function getHeader(){
    let header = {
        "Content-Type": "application/json; charset=utf-8"
    };
    if(window.sessionStorage.accessToken!=undefined && window.sessionStorage.accessToken!=""){
        header["Authorization"]="Bearer " + window.sessionStorage.accessToken
    }
    return header
}