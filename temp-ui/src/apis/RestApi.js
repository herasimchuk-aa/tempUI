import { invaderServerAddress } from "../config";

export function getRequest(url) {
    let sourceURL = invaderServerAddress + url;
    return fetch(sourceURL, {
        method: "GET",
        headers: {
            //"Content-Type": "application/json; charset=utf-8",
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .catch(error => console.error(`Fetch Error =\n`, error));
}

export function postRequest(url, params) {
    let sourceURL = invaderServerAddress + url;
    return fetch(sourceURL, {
        method: "POST",
        headers: {
            //"Content-Type": "application/json; charset=utf-8",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(params), // body data type must match "Content-Type" header
    })
        .then(response => response.json()) // parses response to JSON
        .catch(error => console.error(`Fetch Error =\n`, error));
}