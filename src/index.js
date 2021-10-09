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
    if(typeof p.phones.at(0) !== "undefined"){
        phoneNumber = p.phones.at(0).number
    }
    let hobbies1 = "Ingen Hobby"
    if(typeof p.hobbies.at(0) !== "undefined"){
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
            hideAllShowOne("ex1_html");getAllPersons();break
        case "ex2":hideAllShowOne("ex2_html");break
        case "ex3":hideAllShowOne("ex3_html");break
        default: hideAllShowOne("about_html");getAllZipcode();break
    }
    evt.preventDefault();
}

document.getElementById("menu").onclick = menuItemClicked;
hideAllShowOne("about_html");



