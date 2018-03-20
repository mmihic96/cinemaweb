var addModalOpen = false;
var editModalOpen = false;

function dChangeRed(x) {
    x.style = "cursor:pointer";
    x.src = "../images/delete2.png";

}
function dChangeGrey(x) {
    x.src = "../images/delete.png";

}
function eChangeRed(x) {
    x.style = "cursor:pointer";
    x.src = "../images/edit2.png";

}
function eChangeGrey(x) {
    x.src = "../images/edit.png";

}
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

function checkBefore() {
    if (decodeURIComponent(document.cookie).startsWith('seller')) {
        return 1;
    } else if (decodeURIComponent(document.cookie).startsWith('manager')) {
        return 0;
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

function openModal(modalID) {
    if (modalID == 'addModal') {
        createDropDownMovie('addMovieOption', function () {
            createDropDownHall('addHallOption', function () {
                var date = new Date();

                var today = date.getFullYear() + "-" + (Number(date.getMonth()) > 10 ? date.getMonth() : "0" + (Number(date.getMonth()) + 1)) + "-" + (Number(date.getDate()) > 10 ? date.getDate() : 0 + "" + date.getDate());
                document.getElementById('addDate').min = today;
                document.getElementById(modalID).style.display = "block";
            });
        });
        addModalOpen = true;
    } else if (modalID === 'editModal') {
        var date = new Date();
        var today = date.getFullYear() + "-" + (Number(date.getMonth()) > 10 ? date.getMonth() : "0" + (Number(date.getMonth()) + 1)) + "-" + (Number(date.getDate()) > 10 ? date.getDate() : 0 + "" + date.getDate());
        document.getElementById('editDate').min = today;
        editModalOpen = true;
        document.getElementById(modalID).style.display = "block";
    }


}
function closeModal(x) {
    if (x == 'addModal') {
        addModalOpen = false;
        clearFields();
    } else if (x == 'editModal') {
        editModalOpen = false;
    }
    document.getElementById(x).style.display = "none";
}

function clearFields() {
    document.getElementById('editMovieOption').value = '';
    document.getElementById('editHallOption').value = '';
    document.getElementById('editDate').value = '';
    document.getElementById('editTime').value = '';
    document.getElementById('editPrice').value = '';
}

function edit() {
    if (checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    var tdate = new Date();
    var today = tdate.getHours() + ":" + tdate.getMinutes();
    let movieOption = document.getElementById('editMovieOption').value;
    let hallOption = document.getElementById('editHallOption').value;
    let date = document.getElementById('editDate').value;
    let time = document.getElementById('editTime').value;
    let price = document.getElementById('editPrice').value;
    let img = document.getElementById('editImage');
    var eventID = document.getElementById('editButton').value

    if (!movieOption || !hallOption || !date || !time || !price) {
        alert('Sva polja moraju biti popunjena!')
    } else {
        validateDateTime(date, tdate, today, time, function (data) {
            if (data) {
                uploadImage(img.files, function (imageName) {
                    if (!imageName) {
                        alert('Slika nije učitana. Događaj ce zadržati prethodnu sliku ukoliko postoji.')
                    }
                    let newEvent = {
                        'eventID': Number(eventID),
                        'hallID': hallOption,
                        'movieID': Number(movieOption),
                        'dateTime': changeDate(date) + ' ' + time,
                        'price': Number(price),
                        'deleted': false,
                        'imageName': imageName
                    }
                    fetch('/api/event/' + eventID, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "PUT",
                        body: JSON.stringify(newEvent)
                    }).then(function (response) {
                        if (response.status === 200) {
                            response.json().then(function (data) {
                                closeModal('editModal')
                                alert('Uspešno ste izmenili projekciju.');
                                location.reload();
                            });
                        } else if (response.status === 404) {
                            alert('Ne možete izmeniti projekciju za to vreme. Pokušajte neko drugo vreme.')
                        } else {
                            alert('Greška prilikom izmene projekcije. Molimo vas pokušajte kasnije.')
                        }
                    });
                });
            } else {
                alert('Provjerite datum i vreme. Ne mozete dodati projekciju za datum ili vreme koje je proslo.');
            }
        });

    }

}

function _loadEvents(events) {
    var eventsTable = document.getElementById('eventsTable');
    for (let i = 0; i < events.length; i++) {
        // Create table row 
        var tableRow = document.createElement('tr');
        // set id attribute to tableRow
        tableRow.setAttribute('id', 'tr_' + events[i].id);
        // crate table data and image element
        var hallID = document.createElement('td');
        var movieName = document.createElement('td');
        var dateTime = document.createElement('td');
        var movieDuration = document.createElement('td');
        var price = document.createElement('td');
        var seat_number = document.createElement('td');
        var movieType = document.createElement('td');
        var deleted = document.createElement('td');
        var manageTD = document.createElement('td');
        var editImg = document.createElement('img');
        var deleteImg = document.createElement('img');
        // Create attributes for edit img
        editImg.setAttribute('id', 'id_' + i + 1);
        editImg.setAttribute('onmouseover', 'eChangeRed(this)');
        editImg.setAttribute('onmouseout', 'eChangeGrey(this)');
        editImg.setAttribute('onclick', 'editEvent(' + events[i].id + ')');
        editImg.setAttribute('class', 'editIcon');
        editImg.setAttribute('alt', 'Edit');
        editImg.setAttribute('src', '../images/edit.png');
        // Create attributes for delete img
        deleteImg.setAttribute('id', 'id_' + i + 1);
        deleteImg.setAttribute('onmouseover', 'dChangeRed(this)');
        deleteImg.setAttribute('onmouseout', 'dChangeGrey(this)');
        deleteImg.setAttribute('onclick', 'deleteEvent(' + events[i].id + ')');
        deleteImg.setAttribute('class', 'deleteIcon');
        deleteImg.setAttribute('alt', 'Delete');
        deleteImg.setAttribute('src', '../images/delete.png');
        // Create text nodes
        var hall = document.createTextNode(events[i].hallID);
        var mname = document.createTextNode(events[i].movieName);
        var datetime = document.createTextNode(events[i].dateTime);
        var mduration = document.createTextNode(events[i].movieDuration);
        var eprice = document.createTextNode(events[i].price);
        var seatavailable = document.createTextNode(events[i].seat_number);
        var mtype = document.createTextNode(events[i].movieType);
        var edeleted = document.createTextNode(events[i].deleted);
        if (events[i].deleted) {
            deleted.setAttribute('style', 'color:green');
        } else {
            deleted.setAttribute('style', 'color:red;');
        }
        // Append text nodes to table data
        hallID.appendChild(hall);
        movieName.appendChild(mname);
        dateTime.appendChild(datetime);
        movieDuration.appendChild(mduration);
        price.appendChild(eprice);
        seat_number.appendChild(seatavailable);
        movieType.appendChild(mtype);
        deleted.appendChild(edeleted);
        // Append child (img tags) to manage table data
        manageTD.appendChild(editImg);
        manageTD.appendChild(deleteImg);
        // Append table data to table row
        tableRow.appendChild(hallID);
        tableRow.appendChild(movieName);
        tableRow.appendChild(dateTime);
        tableRow.appendChild(movieDuration);
        tableRow.appendChild(price);
        tableRow.appendChild(movieType);
        tableRow.appendChild(seat_number);
        tableRow.appendChild(deleted);
        tableRow.appendChild(manageTD);
        // Append table row to table element
        eventsTable.appendChild(tableRow);
    }
}

function getAllEvents() {
    fetch('/api/events', function () {
        method: 'GET'
    }).then(function (response) {
        response.json().then(function (data) {
            if (data.length > 0) {
                _loadEvents(data);
            } else {
                document.getElementById('eventsSearch').disabled = true;
                print_error_message("Trenutno ne postoji nijedna projekcija.");
            }
        });
    });
}

function deleteEvent(eventID) {
    var yes = confirm("Da li ste sigurni da želite da obrišete projekciju?");
    if (yes) {
        fetch('/api/event/' + eventID, {
            method: "DELETE",
        }).then(function (response) {
            if (response.status === 404 || response.status === 500) {
                alert('Greška prilikom brisanja projekcije. Molimo Vas pokušajte kasnije.');
            } else if (response.status === 302) {
                alert('Projekcija je već obrisana.');
            } else {
                location.reload();
                alert('Uspešno ste obrisali projekciju.');
            }
        });
    }
}

function validateDateTime(date, tdate, today, time, cb) {
    if (tdate.getMonth() > 11 || tdate.getMonth() < 0) {
        return cb(false);
    }
    if (tdate.getDate() < 0) {
        return cb(false);
    }
    if (date.split('-')[0] < tdate.getFullYear()) {
        return cb(false);
    } else if (date.split('-')[0] == tdate.getFullYear()) {
        if (date.split('-')[1] < tdate.getMonth() + 1) {
            return cb(false);
        } else if (Number(date.split('-')[1]) == tdate.getMonth() + 1) {
            if (date.split('-')[2] < tdate.getDate()) {
                return cb(false);
            } else if (date.split('-')[2] == tdate.getDate()) {
                if (Number(time.split(":")[0]) < Number(today.split(":")[0])) {
                    return cb(false);
                } else if (Number(time.split(":")[0]) == Number(today.split(":")[0])) {
                    if (Number(time.split(":")[1]) < Number(today.split(":")[1])) {
                        return cb(false);
                    } else {
                        return cb(true);
                    }
                } else {
                    return cb(true);
                }
            } else {
                return cb(true);
            }
        } else {
            return cb(true);
        }
    } else {
        return cb(true);
    }
}

function add() {
    if (checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    var tdate = new Date();
    var today = tdate.getHours() + ":" + tdate.getMinutes();
    let movieOption = document.getElementById('addMovieOption').value;
    let hallOption = document.getElementById('addHallOption').value;
    let date = document.getElementById('addDate').value;
    let time = document.getElementById('addTime').value;
    let price = document.getElementById('addPrice').value;
    let img = document.getElementById('addImage');
    if (!movieOption || !hallOption || !date || !time || !price) {
        alert('Sva polja moraju biti popunjena!')
    } else {
        if (Number(price) < 1) {
            alert('Cena mora biti veća od 0.');
            return;
        }
        validateDateTime(date, tdate, today, time, function (data) {
            if (data) {
                uploadImage(img.files, function (imageName) {
                    if (!imageName) {
                        alert('Slika nije ucitana. Događaj će se dodati bez slike.')
                    }
                    let newEvent = {
                        'hallID': hallOption,
                        'movieID': Number(movieOption),
                        'dateTime': changeDate(date) + ' ' + time,
                        'price': Number(price),
                        'deleted': false,
                        'imageName': imageName
                    }
                    fetch('/api/event/', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify(newEvent)
                    }).then(function (response) {
                        if (response.status === 200) {
                            response.json().then(function (data) {
                                closeModal('addModal')
                                alert('Uspešno ste dodali novu projekciju.');
                                location.reload();
                            });

                        } else if (response.status === 404) {
                            alert('Ne mozete dodati projekciju u tom vremenu. Pokušajte neko drugo vreme.');
                        } else {
                            alert('Greška prilikom dodavanja nove projekcije. Molimo vas pokušajte kasnije.')
                        }
                    });
                });
            } else {
                alert('Provjerite datum i vreme. Ne mozete dodati projekciju za datum ili vreme koje je proslo.');
            }
        });
    }
}

function createDropDownMovie(selectID, cb) {
    let movieOpton = document.getElementById(selectID);
    movieOpton.innerHTML = '';
    getMoviesList(function (moviesList) {
        if (moviesList) {
            for (var i = 0; i < moviesList.length; i++) {
                var option = document.createElement("option");
                option.value = moviesList[i].id;
                option.id = 'movie_' + moviesList[i].id;
                option.text = moviesList[i].name;
                movieOpton.appendChild(option);
            }
            return cb();
        } else {
            alert('Da biste dodali projekciju morate imati najmanje jedan film!')
        }
    });
}

function createDropDownHall(hallID, cb) {
    let hallOption = document.getElementById(hallID);
    hallOption.innerHTML = '';
    getHallList(function (hallList) {
        if (hallList) {
            for (var i = 0; i < hallList.length; i++) {
                var option = document.createElement("option");
                option.value = hallList[i].id;
                option.id = 'hall_' + hallList[i].id;
                option.text = hallList[i].id;
                hallOption.appendChild(option);
            }
            return cb();
        }
    });
}

function getMoviesList(cb) {
    fetch('/api/movies', function () {
        method: 'GET'
    }).then(function (response) {
        response.json().then(function (data) {
            if (data.length > 0) {
                return cb(data);
            } else {
                return cb(null);
            }
        });
    });
}

function getHallList(cb) {
    fetch('/api/halls', function () {
        method: 'GET'
    }).then(function (response) {
        response.json().then(function (data) {
            if (data.length > 0) {
                return cb(data);
            } else {
                return cb(null);
            }
        });
    });
}

function changeDate(date) {
    let newDate = date.split('-');
    return newDate[2] + '/' + newDate[1] + '/' + newDate[0];
}

function uploadImage(image, cb) {
    var formData = new FormData();
    formData.append('sampleFile', image[0]);
    fetch('/api/event/upload', {
        method: 'POST',
        body: formData
    }).then(function (response) {
        if (response.status === 200) {
            response.json().then(function (data) {
                return cb(data.name);
            });
        } else {
            return cb(null);
        }


    });
}

function createDate(dateTime) {
    var date = dateTime.split(' ')[0];
    var time = dateTime.split(' ')[1];
    var newDate = date.split('/');
    return [newDate[2] + '-' + newDate[1] + '-' + newDate[0], time];
}
function editEvent(eventID) {
    removeMovieOptions(function () {
        removeHallOptions(function () {
            fetch('/api/event/' + eventID, function () {
                method: "GET"
            }).then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        createDropDownHall('editHallOption', function () {
                            createDropDownMovie('editMovieOption', function () {
                                document.getElementById('editButton').value = data.id;
                                document.getElementById('movie_' + data.movieID).selected = true;
                                document.getElementById('hall_' + data.hallID).selected = true;
                                document.getElementById('editDate').value = createDate(data.dateTime)[0];
                                document.getElementById('editTime').value = createDate(data.dateTime)[1];
                                document.getElementById('editPrice').value = data.price;
                                openModal('editModal');
                            });
                        });
                    });
                } else {
                    alert('Greška prilikom traženja filma. Molimo Vas pokušajte kasnije.')
                }
            });
        });
    });

}

function removeMovieOptions(cb) {
    var myNode = document.getElementById("editMovieOption");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    return cb();
}
function removeHallOptions(cb) {
    var myNode = document.getElementById("editHallOption");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    return cb();
}
window.onload = getAllEvents();

function search() {
    var input, filter, table, tr, td1, i, td2, td3;
    input = document.getElementById("eventsSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("eventsTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
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



/**
 * Display error message
 * @param {String} message Error message 
 */
function print_error_message(message) {
    var contentDIV = document.getElementById('content');
    var expectedTable = document.getElementById('eventsTable');
    expectedTable.remove();
    var pElement = document.createElement('p');
    var errorText = document.createTextNode(message);

    pElement.setAttribute('class', 'errorMsg');
    pElement.appendChild(errorText);
    contentDIV.appendChild(pElement);
}

function checkKey(e) {
    if (addModalOpen) {
        if (e.key === "Enter") {
            add();
        } else if (e.key === "Escape") {
            closeModal('addModal');
        }
    } else if (editModalOpen) {
        if (e.key === "Enter") {
            edit();
        } else if (e.key === "Escape") {
            closeModal('editModal');
        }
    }

}
