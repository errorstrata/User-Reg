let login = document.getElementById('login')

login.addEventListener('click', () => {

 let email = document.getElementById("email").value;
 let password = document.getElementById("password").value;
 
 const user = {
  "email":email,
  "password":password
 }

 fetch('http://127.0.0.1:5000/login',{
  method:'POST',
  headers:{
   'Content-Type':'application/json'
  },
  body: JSON.stringify(user)
 })
 .then(res => res.json())
 .then(data => {
   localStorage.setItem('token', data.token)
 })
 .catch(error => {
  console.log(error)
 })
})