const popup = document.getElementById('popup');
const popupMessage = document.getElementById('notification');

const popupContainer = document.getElementById('popup-container');

const token = localStorage.getItem('token');

fetch ('http://127.0.0.1:5000/Dashboard', {
 method: 'POST',
 headers: {
  'Authorization': 'Bearer ' + token
 }
})
.then(res => res.json())
.then(data => {
 let message = data.message;
 if (message == 'token expired' || message == 'Invalid token') {
  console.log('hello')
  popupContainer.classList.add('active');
  popupMessage.innerHTML = '<p>Not Logged In</p>'
 } else {

  data.forEach(user => {
   for (let u in user) {
    let credits = user[u]
    let board = `
    <tr>
    <td>${credits.name}</td>
    <td>${credits.email}</td>
    <td>${credits.age}</td>
    </tr>
    `
    document.getElementById('tbody').innerHTML = board;
   }
  })
 }
})
.catch(error => {
 console.log(error)
})