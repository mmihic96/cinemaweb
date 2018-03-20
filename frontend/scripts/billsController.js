var user = validateUser();
var userTexNode = document.createTextNode(user.username);
document.getElementById('username').appendChild(userTexNode);
if (user.avatar) {
    document.getElementById('userAvatar').src = '/api/user/image/' + user.avatar;
} else {
    document.getElementById('userAvatar').src = '../images/noimage.jpg';
}

function validateUser() {
    var cookieValue = null;
    if (decodeURIComponent(document.cookie).startsWith('seller')) {
        cookieValue = decodeURIComponent(document.cookie.substring(7));
    } else if (decodeURIComponent(document.cookie).startsWith('manager')) {
        cookieValue = decodeURIComponent(document.cookie.substring(8));
    }
    var parsedCookieValue = JSON.parse('[{' + cookieValue.substring(1, cookieValue.length - 1) + '}]');
    return parsedCookieValue[0];
}

let events = [];
function logout() {
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
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) {
        document.cookie = document.cookie + '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
    setTimeout(function () {
        window.location = '../index.html';
    }, 100);
}

function getAllBills() {
    getEvents(function () {
        fetch('/api/bills', {
            method: "GET"
        }).then(function (response) {
            if (response.status == 200) {
                response.json().then(function (data) {
                    if (data.length > 0) {
                        _load(data);
                    } else {
                        print_error_message('Trenutno ne postoji nijedan racun.')
                    }
                });
            }
        });
    });

}

function _load(data) {
    var billsTable = document.getElementById('billsTable');
    for (let i = 0; i < data.length; i++) {
        findEvent(data[i].eventID, function (event) {
            var movieName = event.movieName;
            var hallID = event.hallID;
            var tr = document.createElement('tr');
            var time = document.createElement('td');
            var eventName = document.createElement('td');
            var hall = document.createElement('td');
            var seats = document.createElement('td');
            var price = document.createElement('td');
            var seller = document.createElement('td');
            // text nodes
            var t = document.createTextNode(data[i].dateTime);
            var e = document.createTextNode(movieName);
            var h = document.createTextNode(hallID);
            var s = document.createTextNode(data[i].seats);
            var p = document.createTextNode(data[i].sumPrice);
            var se = document.createTextNode(data[i].seller);
            //append
            time.appendChild(t);
            eventName.appendChild(e);
            hall.appendChild(h);
            seats.appendChild(s);
            price.appendChild(p);
            seller.appendChild(se);
            //tr append
            tr.appendChild(time);
            tr.appendChild(eventName);
            tr.appendChild(hall);
            tr.appendChild(seats);
            tr.appendChild(price);
            tr.appendChild(seller);
            //append on table
            billsTable.appendChild(tr);
        });
    }
}

function getEvents(cb) {
    fetch('/api/events', {
        method: "GET"
    }).then(function (response) {
        if (response.status == 200) {
            response.json().then(function (data) {
                events = data;
                return cb();
            });
        }
    });
}

function findEvent(eventID, cb) {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == eventID) {
            return cb(events[i]);
        }
    }
}

window.onload = getAllBills();


/**
 * Display error message
 * @param {String} message Error message 
 */
function print_error_message(message) {
    var contentDIV = document.getElementById('content');
    var expectedTable = document.getElementById('billsTable');
    expectedTable.remove();
    var pElement = document.createElement('p');
    var errorText = document.createTextNode(message);

    pElement.setAttribute('class', 'errorMsg');
    pElement.appendChild(errorText);
    contentDIV.appendChild(pElement);
}

function search() {
    var input, filter, table, tr, td1, i, td2, td3;
    input = document.getElementById("billsSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("billsTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[1];
        td2 = tr[i].getElementsByTagName("td")[2];
        td3 = tr[i].getElementsByTagName("td")[5];
        if (td1 || td2) {
            if (td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1 || td3.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function checkKey(e) {
    if (buyModalOpen) {
        if (e.key === "Enter") {
            buy();
        } else if (e.key === "Escape") {
            closeModal('ticketModal');
        }
    }
}