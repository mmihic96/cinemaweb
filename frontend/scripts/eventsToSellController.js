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

var events = [];
var ticketModal = false;
function openMovieDetail(movieDetailID) {
    var movieTraile = document.getElementById(movieDetailID);
    if (movieTraile.style.display == 'flex') {
        movieTraile.style.display = 'none';
        document.getElementById('b_' + movieDetailID).blur();
    } else {
        movieTraile.style.display = "flex";
    }

}
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

function validate() {
    if (user["role"] != "seller") {
        document.getElementById('bills').style.display = "none";
        for (let i = 0; i < events.length; i++) {
            document.getElementById('buyBtn_' + events[i]).style.display = "none";
        }
    } else {
        document.getElementById('allEvents').style.display = "none";
        document.getElementById('movies').style.display = "none";
        document.getElementById('users').style.display = "none";
    }

}

function openModal(data) {
    buyModal(JSON.parse(data.value));
    document.getElementById('ticketModal').style.display = "block";
    ticketModalOpen = true;

}
function closeModal(x) {
    document.getElementById(x).style.display = "none";
    ticketModalOpen = false;
}

function getEvents() {
    fetch('/api/events', {
        method: 'GET'
    }).then(function (response) {
        if (response.status == 200) {
            response.json().then(function (data) {
                if (data.length < 1) {
                    print_error_message('Trenutno ne postoji nijedna projekcija.')
                    document.getElementById('eventsToSellSearch').disabled = true;
                }
                _loadData(data, function () {
                    validate();
                });
            });
        } else {
            alert('Greška prilikom učitavanja događaja.')
        }
    });
}


function _loadData(data, cb) {
    var ul = document.getElementById('eventsToSell');
    for (let i = 0; i < data.length; i++) {
        if (data[i].deleted) {
            continue;
        }
        events.push(data[i].id);
        // Create elements
        var li = document.createElement('li');
        //inside li
        var eventDIV = document.createElement('div');
        var movieTrailer = document.createElement('div');
        // inside eventDIV
        var eventImage = document.createElement('img');
        var eventDesc = document.createElement('div');
        // inside eventDESC
        var pName = document.createElement('p');
        var pType = document.createElement('p');
        var pHall = document.createElement('p');
        var pDate = document.createElement('p');
        var pTime = document.createElement('p');
        var pPrice = document.createElement('p');
        var bOpenTrailer = document.createElement('button');
        var bBuyTicket = document.createElement('button');
        //inside movieTrailer
        var iframe = document.createElement('iframe');
        // Attributes for elements
        li.setAttribute('class', 'eventLI');
        eventDIV.setAttribute('class', 'event');
        movieTrailer.setAttribute('class', 'movieDetail');
        movieTrailer.setAttribute('id', 'movieDetail_id' + data[i].id);
        if (data[i].imageName) {
            eventImage.setAttribute('src', '/api/event/image/' + data[i].imageName);
        } else {
            eventImage.setAttribute('src', '../images/noimage.jpg');
        }


        eventDesc.setAttribute('class', 'eventDesc');
        bOpenTrailer.setAttribute('onclick', 'openMovieDetail("movieDetail_id' + data[i].id + '")');
        bOpenTrailer.setAttribute('id', 'b_movieDetail_id' + data[i].id);
        bBuyTicket.setAttribute('id', 'buyBtn_' + data[i].id);
        bBuyTicket.setAttribute('class', 'buyTicketBtn');
        bBuyTicket.setAttribute('onclick', 'openModal(' + 'buyBtn_' + data[i].id + ')');
        bBuyTicket.setAttribute('value', JSON.stringify(data[i]));
        iframe.setAttribute('width', '99.5%');
        iframe.setAttribute('height', '99.5%');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + data[i].movieTrailer);
        iframe.allowFullscreen = true;
        // Create TEXT NODES
        var name = document.createTextNode('Ime: ' + data[i].movieName);
        var type = document.createTextNode('Žanr: ' + data[i].movieType);
        var hall = document.createTextNode('Sala: ' + data[i].hallID);
        var date = document.createTextNode('Datum: ' + data[i].dateTime.split(' ')[0]);
        var time = document.createTextNode('Vreme: ' + data[i].dateTime.split(' ')[1]);
        var price = document.createTextNode('Cena: ' + data[i].price + ' RSD');
        var buttonOpen = document.createTextNode('Trailer');
        var buttonBuy = document.createTextNode('Kupi');
        //append all
        pName.appendChild(name);
        pType.appendChild(type);
        pHall.appendChild(hall);
        pDate.appendChild(date);
        pTime.appendChild(time);
        pPrice.appendChild(price);
        bOpenTrailer.appendChild(buttonOpen);
        bBuyTicket.appendChild(buttonBuy);
        pName.setAttribute('style', 'font-family:Alexandria;font-size: 17px;')
        pType.setAttribute('style', 'font-family:Alexandria;font-size: 17px;')
        pHall.setAttribute('style', 'font-family:Alexandria;font-size: 17px;')
        pDate.setAttribute('style', 'font-family:Alexandria;font-size: 17px;')
        pTime.setAttribute('style', 'font-family:Alexandria;font-size: 17px;')
        pPrice.setAttribute('style', 'font-family:Alexandria;font-size: 17px;')
        //event desc
        eventDesc.appendChild(pName);
        eventDesc.appendChild(pType);
        eventDesc.appendChild(pHall);
        eventDesc.appendChild(pDate);
        eventDesc.appendChild(pTime);
        eventDesc.appendChild(pPrice);
        eventDesc.appendChild(bOpenTrailer);
        eventDesc.appendChild(bBuyTicket);
        // event div
        eventDIV.appendChild(eventImage);
        eventDIV.appendChild(eventDesc);
        // movieTrailer div
        movieTrailer.appendChild(iframe);
        // li
        li.appendChild(eventDIV);
        li.appendChild(movieTrailer);
        //finall
        ul.appendChild(li);
    }
    return cb();
}

function buyModal(data) {
    document.getElementById('buyTickets').value = JSON.stringify(data);
    document.getElementById('eventName').innerHTML = "Kupujete kartu za film '" + data.movieName + "'";
    document.getElementById('eventHall').innerHTML = "U sali - " + data.hallID;
    document.getElementById('eventDateTime').innerHTML = "Za vreme - " + data.dateTime;
    document.getElementById('eventPrice').innerHTML = " x " + data.price;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
};
function checkBefore() {
    if (decodeURIComponent(document.cookie).startsWith('seller')) {
        return 1;
    } else if (decodeURIComponent(document.cookie).startsWith('manager')) {
        return 0;
    }
}
function buy() {
    if (!checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    var event = JSON.parse(document.getElementById('buyTickets').value);
    var seatNumbers = document.getElementById('numberOfTickets').value;
    if (Number.isInteger(Number(seatNumbers))) {
        if (!seatNumbers || Number(seatNumbers) < 1) {
            alert('Morate uneti neki broj veći od 0.')
        } else if (event.seat_number >= Number(seatNumbers)) {

            var newBill = {
                "dateTime": getDateTime(),
                "eventID": event.id,
                "seats": seatNumbers,
                "sumPrice": roundToTwo(Number(seatNumbers) * Number(event.price)),
                "seller": user.username
            }
            fetch('/api/bill', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBill)
            }).then(function (response) {
                if (response.status == 200) {
                    _updateEvent(seatNumbers, event);
                    alert('Uspešno ste kupili karte.')
                } else {
                    alert('Došlo je do greške. Pokušajte kasinje.')
                }
            });
            closeModal('ticketModal');
        } else {
            alert('Žao nam je nema toliko slobodnih mesta. Pokušajte sa manje.');
        }
    } else {
        alert('Za broj mesta(karata) dozvoljeni su samo celi brojevi.');
    }
}

function _updateEvent(seatNumbers, event) {
    let newEvent = {
        'eventID': event.id,
        'hallID': event.hallID,
        'movieID': event.movieID,
        'dateTime': event.dateTime,
        'price': event.price,
        'deleted': false,
        'imageName': event.imageName,
        'seat_available': Number(event.seat_number) - Number(seatNumbers)
    }
    fetch('/api/event/' + event.id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(newEvent)
    });
}
function getDateTime() {
    var current = new Date();
    var datetime = current.getDate() + "/"
        + current.getMonth() + 1 + "/"
        + current.getFullYear() + "  "
        + current.getHours() + ":"
        + current.getMinutes();
    return datetime;
}


function search() {
    var input, filter, ul, li, p1, p2, p3, i;
    input = document.getElementById("eventsToSellSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("eventsToSell");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        p1 = li[i].getElementsByTagName("p")[0];
        p2 = li[i].getElementsByTagName("p")[1];
        p3 = li[i].getElementsByTagName("p")[2];
        if (p1.innerHTML.toUpperCase().indexOf(filter) > -1 || p2.innerHTML.toUpperCase().indexOf(filter) > -1 || p3.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}

window.onload = getEvents();

function checkKey(e) {
    if (e.key === "Enter") {
        buy();
    } else if (e.key === "Escape") {
        closeModal('ticketModal');
    }
}

function print_error_message(message) {
    var contentDIV = document.getElementById('pageContent');
    var pElement = document.createElement('p');
    var errorText = document.createTextNode(message);

    pElement.setAttribute('class', 'errorMsg');
    pElement.appendChild(errorText);
    contentDIV.appendChild(pElement);
}