import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import * as bootstrap from 'bootstrap';
import '@popperjs/core';
import data from "bootstrap/js/src/dom/data";

document.getElementById("all-content").style.display = "block"

/* 
  Add your JavaScript for all exercises Below or in separate js-files, which you must the import above
*/

/* JS For Exercise-1 below */

let editModalElement = document.getElementById("editmodal")
let editModal = new bootstrap.Modal(editModalElement)

document.getElementById("tables").addEventListener('click', e => {
    e.preventDefault();
    const node = e.target
    const name = node.getAttribute("name")
    const id = node.getAttribute("id")
    switch (name){
        case "Edit": editPerson(id); break;
        case "Delete": deletePerson(id); break;

    }
})

function editPerson(id) {

    fetch(`https://abefisk.dk/ca/api/ca/person/` + id)
        .then(handleHttpErrors)
        .then(data =>
        {
            console.log(data)
            let phoneNumber = "Intet Telefonummer"
            if(typeof data.phones.at(0) !== "undefined"){
                phoneNumber = data.phones.at(0).number
            }
            let hobbies1 = "Ingen Hobby"
            if(typeof data.hobbies.at(0) !== "undefined"){
                hobbies1 = data.hobbies.at(0).name
            }
            document.getElementById("edit_id").value = data.id
            document.getElementById("fName").value = data.first_name
            document.getElementById("lName").value = data.last_name
            document.getElementById("Email").value = data.email
            document.getElementById("phone").value = phoneNumber
            document.getElementById("Hobby").value = hobbies1

            editModal.toggle()
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.msg))
            } else {
                console.log(err);
            }
        });
}

document.getElementById("modal-edit-save-btn").addEventListener('click', updatePerson)

function updatePerson() {
    const id = document.getElementById("edit_id").value

    const personObject = {
        id: id,
        fName: document.getElementById("fName").value,
        lName: document.getElementById("lName").value,
        Email: document.getElementById("Email").value,
        phone: document.getElementById("phone").value,
        Hobby: document.getElementById("Hobby").value
    }
    const options = makeOptions('PUT', personObject)

    fetch(`https://abefisk.dk/ca/api/ca/person/` + id, options)
        .then(handleHttpErrors)
        .then(data => {
            editModal.toggle()
            getAllPersons()
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => console.log(e.msg))
            } else {
                console.log(err);
            }
        });
}

    function deletePerson(id) {
        alert('deletePerson: ' + id)
    }



    function getAllPersons() {

        fetch('https://abefisk.dk/ca/api/ca/all_persons')
            .then(handleHttpErrors)
            .then(data => {
                const allRows = data.map(p => getPersonTableRow(p))
                document.getElementById("tables").innerHTML = allRows.join("")
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.msg))
                } else {
                    console.log(err);
                }
            });
    }


    function getPersonTableRow(p) {
        console.log(p)
        let phoneNumber = "Intet Telefonummer"
        if (typeof p.phones.at(0) !== "undefined") {
            phoneNumber = p.phones.at(0).number
        }
        let hobbies1 = "Ingen Hobby"
        if (typeof p.hobbies.at(0) !== "undefined") {
            hobbies1 = p.hobbies.at(0).name
        }
        return `<tr> 
      <td>${p.id}</td>
      <td>${p.first_name}</td>
      <td>${p.last_name}</td>
      <td>${phoneNumber}</td>
      <td>${p.email}</td>
      <td>${hobbies1}</td>
      <td><input id="${p.id}" type="button" name="Edit" value="Edit"/>\n
          <input id="${p.id}" type="button" name="Delete" value="Delete"/></td>
      </tr>`
    }


    /* JS For Exercise-2 below */


    function getAllZipcode() {

        fetch('https://abefisk.dk/ca/api/ca/get_all_zipcodes')
            .then(handleHttpErrors)
            .then(data => {
                const allRows = data.map(p => getAllZipCodes(p))
                document.getElementById("allZipCodes1").innerHTML = allRows.join("")
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.msg))
                } else {
                    console.log(err);
                }
            });
    }

    function getAllZipCodes(p) {
        console.log(p)
        return `<tr> 
      <td>${p.zipCode}</td>
      <td>${p.city}</td>
      </tr>`
    }


    /* JS For Exercise-3 below */

    function makeOptions(method, body) {
        var opts = {
            method: method,
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        }
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    }


    function handleHttpErrors(res) {
        if (!res.ok) {
            return Promise.reject({status: res.status, fullError: res.json()})
        }
        return res.json();
    }


    /*
    Do NOT focus on the code below, UNLESS you want to use this code for something different than
    the Period2-week2-day3 Exercises
    */

    function hideAllShowOne(idToShow) {
        document.getElementById("about_html").style = "display:none"
        document.getElementById("ex1_html").style = "display:none"
        document.getElementById("ex2_html").style = "display:none"
        document.getElementById("ex3_html").style = "display:none"
        document.getElementById(idToShow).style = "display:block"
    }

    function menuItemClicked(evt) {
        const id = evt.target.id;
        switch (id) {
            case "ex1":
                hideAllShowOne("ex1_html");
                getAllPersons();
                break
            case "ex2":
                hideAllShowOne("ex2_html");
                break
            case "ex3":
                hideAllShowOne("ex3_html");
                break
            default:
                hideAllShowOne("about_html");
                getAllZipcode();
                break
        }
        evt.preventDefault();
    }

    function submitAction(evt) {
        const id = evt.target.id;
        switch (id) {
            case "hobby_name_submit_button":
                displayPersonByData("get_person_by_hobby");
                break;
        }
        evt.preventDefault();
    }

    function displayPersonByData(type) {
        let input_block;
        let url;
        switch (type) {
            case "get_person_by_phone":
                input_block = document.getElementById("person_by_phone_body");
                url = `https://abefisk.dk/ca/api/ca/person_by_number/` + document.getElementById("phone_number").value;
                break;
            case "get_person_by_hobby":
                input_block = document.getElementById("person_by_hobby_body");
                url = `https://abefisk.dk/ca/api/ca/person_by_hobby/` + document.getElementById("hobby_name").value;
                break;
            case "get_all_persons":
                input_block = document.getElementById("person_input");
                url = `https://abefisk.dk/ca/api/ca/all_persons`;
                break;
            case "get_person_by_zipcode":
                input_block = document.getElementById("person_by_zipcode_body");
                url = `https://abefisk.dk/ca/api/ca/person_by_city/` + document.getElementById("zipcode").value;
                break
        }

        fetch(url)
            .then(handleHttpErrors)
            .then(data => {
                const allRows = data.map(n => getPersonTableRow(n));
                input_block.innerHTML = allRows;
            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.msg))
                } else {
                    console.log(err);
                }
            });
    }

    document.getElementById("menu").onclick = menuItemClicked;
    document.getElementById("hobby_name_submit_button").onclick = submitAction;
    hideAllShowOne("about_html");




