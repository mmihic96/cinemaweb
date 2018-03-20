/**
 * Function redirect to home page if login is success
 */

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var params = '?' + encodeURIComponent('username') + '=' + encodeURIComponent(username) + '&';
    params += encodeURIComponent('password') + '=' + encodeURIComponent(password);
    if (!username && !password) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Niste uneli korisničko ime ili šifru. Unesite potrebne podatke i pokušajte ponovo.';
    } else {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch('/login', {
            method: 'POST',
            mode: 'same-origin',
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (user) {
                    if (user.avatar) {
                        document.getElementById('avatar').src = '/api/user/image/' + user.avatar;
                    } else {
                        document.getElementById('avatar').src = '../images/noimage.jpg';
                    }
                    document.getElementById('message').style.color = 'green';
                    document.getElementById('message').innerHTML = 'Uspšno ste se prijavili. Za 3 sekunde bićete preusmjereni na Vašu kontrolnu tablu.';
                    document.getElementById('loginBtn').disabled = true;
                    setTimeout(function () {
                        window.location.href = "pages/eventsToSell.html";
                    }, 3000);
                });
            } else if (response.status === 401) {
                document.getElementById('message').style.color = 'red';
                document.getElementById('message').innerHTML = 'Niste validan korisnik. Pokušajte ponovo.';
            }
        });
    }

}


function validateUser() {
    var cookieValue = decodeURIComponent(document.cookie.substring(8));
    var parsedCookieValue = JSON.parse('[{' + cookieValue.substring(1, cookieValue.length - 1) + '}]');
    return parsedCookieValue[0];
}

document.body.addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        login();
    }
});

window.onload = function () {
    var cookie = document.cookie;
    if (cookie) {
        window.location = './pages/eventsToSell.html';
    }
}