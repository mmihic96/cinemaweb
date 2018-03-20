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
var addModalOpen = false;
var editModalOpen = false;
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
function openModal(modalID) {
    if (modalID === 'addModal') {
        addModalOpen = true;
    } else if (modalID === 'editModal') {
        editModalOpen = true;
    }
    document.getElementById(modalID).style.display = "block";
}
function closeModal(x) {
    if (x === 'addModal') {
        clearFields();
        addModalOpen = false;
    } else if (x === 'editModal') {
        editModalOpen = false;
    }
    document.getElementById(x).style.display = "none";
}

function clearFields() {
    document.getElementById('addMovieName').value = '';
    document.getElementById('addMovieType').value = '';
    document.getElementById('addMovieDuration').value = '';
    document.getElementById('addMovieTrailer').value = '';
}

function add() {
    if (checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    let moviename = document.getElementById('addMovieName').value;
    let movietype = document.getElementById('addMovieType').value;
    let movieduration = document.getElementById('addMovieDuration').value;
    let movietrailer = document.getElementById('addMovieTrailer').value;
    if (Number(movieduration) < 1) {
        alert('Duzina filma mora biti veca od 0!');
        return;
    }
    if (moviename && movietype && movieduration && movietrailer) {
        let newMovie = {
            "name": moviename,
            "type": movietype,
            "duration": Number(movieduration),
            "ytID": movietrailer
        }
        fetch('/api/movie', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(newMovie)
        }).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (data) {
                    alert('Uspešno ste dodali novi film.');
                    location.reload();
                });

            } else {
                alert('Greška prilikom dodavanja novog filma. Molimo vas pokušajte kasnije.')
            }
        });

    } else {
        alert('Sva polja moraju biti popunjena!')
    }
}

function getAllMovies() {
    fetch('/api/movies', function () {
        method: 'GET'
    }).then(function (response) {
        response.json().then(function (data) {
            if (data.length > 0) {
                _loadMovies(data);
            } else {
                document.getElementById('movieSearch').disabled = true;
                print_error_message('Trenutno ne postoji nijedan film.')
            }
        });
    });
}

function _loadMovies(movies) {
    var moviesTable = document.getElementById('moviesTable');
    for (let i = 0; i < movies.length; i++) {
        // Create table row 
        var tableRow = document.createElement('tr');
        // set id attribute to tableRow
        tableRow.setAttribute('id', 'tr_' + movies[i].id);
        // crate table data and image element
        var movieName = document.createElement('td');
        var movieType = document.createElement('td');
        var movieDuration = document.createElement('td');
        var youtubeID = document.createElement('td');
        var manageTD = document.createElement('td');
        var editImg = document.createElement('img');
        var deleteImg = document.createElement('img');
        // Create attributes for edit img
        editImg.setAttribute('id', 'id_' + i + 1);
        editImg.setAttribute('onmouseover', 'eChangeRed(this)');
        editImg.setAttribute('onmouseout', 'eChangeGrey(this)');
        editImg.setAttribute('onclick', 'editMovie(' + movies[i].id + ')');
        editImg.setAttribute('class', 'editIcon');
        editImg.setAttribute('alt', 'Edit');
        editImg.setAttribute('src', '../images/edit.png');
        // Create attributes for delete img
        deleteImg.setAttribute('id', 'id_' + i + 1);
        deleteImg.setAttribute('onmouseover', 'dChangeRed(this)');
        deleteImg.setAttribute('onmouseout', 'dChangeGrey(this)');
        deleteImg.setAttribute('onclick', 'deleteMovie(' + movies[i].id + ')');
        deleteImg.setAttribute('class', 'deleteIcon');
        deleteImg.setAttribute('alt', 'Delete');
        deleteImg.setAttribute('src', '../images/delete.png');
        // Create text nodes
        var name = document.createTextNode(movies[i].name);
        var type = document.createTextNode(movies[i].type);
        var duration = document.createTextNode(movies[i].duration);
        var ytid = document.createTextNode(movies[i].ytID);
        // Append text nodes to table data
        movieName.appendChild(name);
        movieType.appendChild(type);
        movieDuration.appendChild(duration);
        youtubeID.appendChild(ytid);
        // Append child (img tags) to manage table data
        manageTD.appendChild(editImg);
        manageTD.appendChild(deleteImg);
        // Append table data to table row
        tableRow.appendChild(movieName);
        tableRow.appendChild(movieType);
        tableRow.appendChild(movieDuration);
        tableRow.appendChild(youtubeID)
        tableRow.appendChild(manageTD);
        // Append table row to table element
        moviesTable.appendChild(tableRow);
    }
}


function deleteMovie(movieID) {
    var yes = confirm("Da li ste sigurni da želite da obrišete film?");
    if (yes) {
        fetch('/api/movie/' + movieID, {
            method: "DELETE",
        }).then(function (response) {
            if (response.status === 404 || response.status === 500) {
                alert('Greška prilikom brisanja filma. Molimo Vas pokušajte kasnije.');
            } else {
                var elementToRemove = document.getElementById("tr_" + movieID);
                elementToRemove.remove();
                alert('Uspešno ste obrisali film.');
            }
        });
    }
}

function editMovie(movieID) {
    fetch('/api/movie/' + movieID, function () {
        method: "GET"
    }).then(function (response) {
        if (response.status === 200) {
            response.json().then(function (data) {
                document.getElementById('editButton').value = data.id;
                document.getElementById('editMovieName').value = data.name;
                document.getElementById('editMovieType').value = data.type;
                document.getElementById('editMovieDuration').value = data.duration;
                document.getElementById('editMovieTrailer').value = data.ytID;
                openModal('editModal');
            });
        } else {
            alert('Greška prilikom traženja filma. Molimo Vas pokušajte kasnije.')
        }
    });
}
function checkBefore() {
    if (decodeURIComponent(document.cookie).startsWith('seller')) {
        return 1;
    } else if (decodeURIComponent(document.cookie).startsWith('manager')) {
        return 0;
    }
}
function edit() {
    if (checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    var name = document.getElementById('editMovieName').value;
    var type = document.getElementById('editMovieType').value;
    var duration = document.getElementById('editMovieDuration').value;
    var ytID = document.getElementById('editMovieTrailer').value;
    var movieID = document.getElementById('editButton').value;
    if (!name || !type || !duration || !ytID) {
        alert('Sva polja moraju biti popunjena. Popunite polja i pokušajte ponovo.');
    } else {
        var movie = {
            "id": movieID,
            "name": name,
            "type": type,
            "duration": Number(duration),
            "ytID": ytID
        }
        fetch('/api/movie/' + movieID, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(movie)
        }).then(function (response) {
            if (response.status === 200) {
                closeModal('editModal');
                location.reload();
                alert('Uspešno ste izmenili informacije o filmu.');
            } else {
                alert('Greška prilikom izmena informacija o filmu. Molimo vas pokušajte kasnije.');
            }
        });
    }
}
window.onload = getAllMovies();

function search() {
    var input, filter, table, tr, td1, i, td2;
    input = document.getElementById("movieSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("moviesTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        if (td1 || td2) {
            if (td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
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
    var expectedTable = document.getElementById('moviesTable');
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
