let submit = document.getElementById('submit');
let formation = document.getElementById('formSignup');

submit.addEventListener('click', SendName)

function SendName(e) {

 e.preventDefault()
 /*
 const form = formation;
 const formData = new FormData(form);
*/
 let name = document.getElementById('name').value;
 let email = document.getElementById('email').value;
 let age = document.getElementById('age').value;
 let password = document.getElementById('password').value;
 let confirm = document.getElementById('confirm').value;

 const user = {
  'name': name,
  'email': email,
  'age': age,
  'password': password
 }

 console.log(user)

 if (password == confirm) {
  alert('yee ha!')
  fetch(`http://127.0.0.1:5000/signup`, {
   method: 'POST',
   headers:{
    'Content-Type':'application/json'
   },
   body: JSON.stringify(user)
  })
  .then(res => res.json())
  .then(data => {
   localStorage.setItem('token', data.token)
   console.log(data.token)
  })
  .catch(error => {
   console.log('error: ', error)})
 }else {
  alert('passwords donot match')
  document.getElementById('password').value = '';
  document.getElementById('confirm').value = '';
 }

}

let retrieve = document.getElementById('fetch');

retrieve.addEventListener('click', (e) => {
 e.preventDefault();

 fetch('http://127.0.0.1:5000/signup')
 .then(res => res.json())
 .then(data => {
  console.log(data)
 })
 .catch(error => {
  console.log('errror: ', error)
 })
})