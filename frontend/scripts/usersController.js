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
window.onload = loadUsers();
var usernames = [];

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
    if (modalID == "addModal") {
        addModalOpen = true;
        clearFields();
    } else if (modalID == "editModal") {
        editModalOpen = true;
    }
    document.getElementById(modalID).style.display = "block";
}
function closeModal(x) {
    if (x == "addModal") {
        addModalOpen = false;
    } else if (x == "editModal") {
        editModalOpen = false;
    }
    document.getElementById(x).style.display = "none";
}

/**
 * Create user table on html
 * @param {Array} users Array of users object
 */
function _loadUsers(users) {
    var usersTable = document.getElementById('usersTable');
    for (let i = 0; i < users.length; i++) {
        usernames.push(users[i].username);
        // Create table row 
        var tableRow = document.createElement('tr');
        // set id attribute to tableRow
        tableRow.setAttribute('id', 'tr_' + users[i].id);
        // crate table data and image element
        var avatarTD = document.createElement('td');
        var fnameTD = document.createElement('td');
        var lnameTD = document.createElement('td');
        var unameTD = document.createElement('td');
        var pwdTD = document.createElement('td');
        var roleTD = document.createElement('td');
        var manageTD = document.createElement('td');
        var editImg = document.createElement('img');
        var deleteImg = document.createElement('img');
        var avatar = document.createElement('img');
        // Create attributes for edit img
        editImg.setAttribute('id', 'id_' + i + 1);
        editImg.setAttribute('onmouseover', 'eChangeRed(this)');
        editImg.setAttribute('onmouseout', 'eChangeGrey(this)');
        editImg.setAttribute('onclick', 'editUser(' + users[i].id + ')');
        editImg.setAttribute('class', 'editIcon');
        editImg.setAttribute('alt', 'Edit');
        editImg.setAttribute('src', '../images/edit.png');
        // Create attributes for delete img
        deleteImg.setAttribute('id', 'id_' + i + 1);
        deleteImg.setAttribute('onmouseover', 'dChangeRed(this)');
        deleteImg.setAttribute('onmouseout', 'dChangeGrey(this)');
        deleteImg.setAttribute('onclick', 'deleteUser(' + users[i].id + ')');
        deleteImg.setAttribute('class', 'deleteIcon');
        deleteImg.setAttribute('alt', 'Delete');
        deleteImg.setAttribute('src', '../images/delete.png');
        // Atributes for avatar
        if (users[i].avatar) {
            avatar.setAttribute('src', '/api/user/image/' + users[i].avatar);
        } else {
            avatar.setAttribute('src', '../images/noimage.jpg');
        }
        avatar.setAttribute('class', 'avatarImage');
        // Create text nodes
        var firstName = document.createTextNode(users[i].fname);
        var lastName = document.createTextNode(users[i].lname);
        var userName = document.createTextNode(users[i].username);
        var userPassword = document.createTextNode(users[i].password);
        var userRole = document.createTextNode(users[i].role);
        // Append text nodes to table data
        avatarTD.appendChild(avatar);
        fnameTD.appendChild(firstName);
        lnameTD.appendChild(lastName);
        unameTD.appendChild(userName);
        pwdTD.appendChild(userPassword);
        roleTD.appendChild(userRole);
        // Append child (img tags) to manage table data
        manageTD.appendChild(editImg);
        manageTD.appendChild(deleteImg);
        // Append table data to table row
        tableRow.appendChild(avatarTD);
        tableRow.appendChild(fnameTD);
        tableRow.appendChild(lnameTD);
        tableRow.appendChild(unameTD);
        tableRow.appendChild(pwdTD);
        tableRow.appendChild(roleTD);
        tableRow.appendChild(manageTD);
        // Append table row to table element
        usersTable.appendChild(tableRow);
    }
}

function checkBefore() {
    if (decodeURIComponent(document.cookie).startsWith('seller')) {
        return 1;
    } else if (decodeURIComponent(document.cookie).startsWith('manager')) {
        return 0;
    }
}
/**
 * Create user
 */
function addUser() {
    if (checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    var usersTable = document.getElementById('usersTable');
    var fname = document.getElementById('firstName').value;
    var lname = document.getElementById('lastName').value;
    var username = document.getElementById('usrName').value;
    var password = document.getElementById('password').value;
    var role = document.getElementById('addUserRole').value;
    var avatar = document.getElementById('addAvatar');

    if (!fname || !lname || !username || !password) {
        alert('Sva polja moraju biti popunjena. Popunite polja i pokušajte ponovo.');
    } else if (usernames.includes(username)) {
        alert("Korisničko ime je zauzeto. Izaberite drugo korisničko ime i pokušajte ponovo.");
    } else {
        uploadImage(avatar.files, function (imageName) {
            if (!imageName) {
                alert('Slika nije učitana. Korisnik će biti dodat bez slike.');
            }
            var newUser = {
                "fname": fname,
                "lname": lname,
                "username": username,
                "password": password,
                "role": role,
                "avatar": imageName
            }

            fetch('/api/user', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(newUser)
            }).then(function (response) {
                if (response.status === 200) {
                    response.json().then(function (data) {
                        alert('Uspešno ste dodali novog korisnika.');
                        location.reload();
                    });

                } else {
                    alert('Greška prilikom dodavanja novog korisnika. Molimo vas pokušajte kasnije.')
                }
            });
        });
    }
}

/**
 * Retrive users
 */
function loadUsers() {
    fetch('/api/users', function () {
        method: "GET"
    }).then(function (response) {
        if (response.status != 200) {
            print_error_message('Greška u čitanju korisnika. Molimo Vas pokušajte kasnije.');
        }
        response.json().then(function (data) {
            if (data.length > 0) {
                _loadUsers(data);
            } else {
                document.getElementById('userSearch').disabled = true;
                print_error_message('Greška u čitanju korisnika. Molimo Vas pokušajte kasnije.')
            }
        });
    });
}

/**
 * Get user and open edit modal
 * @param {Integer} userId 
 */
function editUser(userId) {
    fetch('/api/user/' + userId, function () {
        method: "GET"
    }).then(function (response) {
        if (response.status === 200) {
            response.json().then(function (data) {
                document.getElementById('editButton').value = data.id;
                document.getElementById('editFname').value = data.fname;
                document.getElementById('editLname').value = data.lname;
                document.getElementById('editUsrname').value = data.username;
                document.getElementById('editPassword').value = data.password;
                document.getElementById('editUserRole').value = data.role;
                openModal('editModal');
            });
        } else {
            alert('Greška prilikom traženja korisnika. Molimo Vas pokušajte kasnije.')
        }
    });
}

/**
 * Update user
 */
function edit() {
    if (checkBefore()) {
        alert('Nemate odredjena prava za ovu opciju!');
        window.open('401.html', '_self');
        return;
    }
    var usersTable = document.getElementById('usersTable');
    var fname = document.getElementById('editFname').value;
    var lname = document.getElementById('editLname').value;
    var username = document.getElementById('editUsrname').value;
    var password = document.getElementById('editPassword').value;
    var role = document.getElementById('editUserRole').value;
    var userID = document.getElementById('editButton').value;
    var avatar = document.getElementById('editAvatar');
    if (!fname || !lname || !username || !password) {
        alert('Sva polja moraju biti popunjena. Popunite polja i pokušajte ponovo.');
    } else {
        uploadImage(avatar.files, function (imageName) {
            if (!imageName) {
                alert('Slika nije učitana. Korisnik ce zadrzati prethodnu sliku ukoliko postoji.')
            }
            var user = {
                "fname": fname,
                "lname": lname,
                "username": username,
                "password": password,
                "role": role,
                "avatar": imageName
            }
            fetch('/api/user/' + userID, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(user)
            }).then(function (response) {
                if (response.status === 200) {
                    var parent = document.getElementById('tr_' + userID);
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                    location.reload();
                    closeModal('editModal');
                    alert('Uspešno ste izmjenili informacije o korisniku.');
                } else {
                    alert('Greška prilikom izmjene informacija o korisniku. Molimo vas pokušajte kasnije.')
                }
            });
        });
    }
}

/**
 * Delete user 
 * @param {Integer} userID 
 */
function deleteUser(userID) {
    var yes = confirm("Da li ste sigurni da želite da obrišete korisnika?");
    if (yes) {
        fetch('/api/user/' + userID, {
            method: "DELETE",
        }).then(function (response) {
            if (response.status === 404 || response.status === 500) {
                alert('Greška prilikom brisanja korisnika. Molimo Vas pokušajte kasnije.');
            } else {
                location.reload();
                alert('Uspešno ste obrisali korisnika.');
            }
        });
    }
}

/**
 * Display error message
 * @param {String} message Error message 
 */
function print_error_message(message) {
    var contentDIV = document.getElementById('content');
    var expectedTable = document.getElementById('usersTable');
    expectedTable.remove();
    var pElement = document.createElement('p');
    var errorText = document.createTextNode(message);

    pElement.setAttribute('class', 'errorMsg');
    pElement.appendChild(errorText);
    contentDIV.appendChild(pElement);
}

// Clear fields
function clearFields() {
    document.getElementById('firstName').value = "";
    document.getElementById('lastName').value = "";
    document.getElementById('usrName').value = "";
    document.getElementById('password').value = "";
}

function search() {
    var input, filter, table, tr, td1, i, td2, td3, td4;
    input = document.getElementById("userSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("usersTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        td3 = tr[i].getElementsByTagName("td")[2];
        td4 = tr[i].getElementsByTagName("td")[4];
        if (td1 || td2 || td3 || td4) {
            if (td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1 || td3.innerHTML.toUpperCase().indexOf(filter) > -1 || td4.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function uploadImage(image, cb) {
    var formData = new FormData();
    formData.append('sampleFile', image[0]);
    fetch('/api/user/upload', {
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

function checkKey(e) {
    if (addModalOpen) {
        if (e.key === "Enter") {
            addUser();
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
