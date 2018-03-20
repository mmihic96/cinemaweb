var user = validateUser();

function clearCookie() {
    if (user) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch('/logout', {
            method: 'POST',
            mode: 'same-origin',
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: headers,
            cookies: document.cookies
        });
    }
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) {
        document.cookie = document.cookie + '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
}

function validateUser() {
    var cookieValue = null;
    if (decodeURIComponent(document.cookie).startsWith('seller')) {
        cookieValue = decodeURIComponent(document.cookie.substring(7));
    } else if (decodeURIComponent(document.cookie).startsWith('manager')) {
        cookieValue = decodeURIComponent(document.cookie.substring(8));
    }
    if (!cookieValue) {
        return cookieValue;
    }
    var parsedCookieValue = JSON.parse('[{' + cookieValue.substring(1, cookieValue.length - 1) + '}]');
    return parsedCookieValue[0];
}

window.onload=clearCookie();