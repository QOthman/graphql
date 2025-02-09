import { app, initializeApp } from "./index.js";


export function handleLogin(e) {
    const errorMessage = document.getElementById("errorMessage")

    e.preventDefault();
    const credentials = document.getElementById('credentials').value;
    const password = document.getElementById('password').value;

    fetch('https://learn.zone01oujda.ma/api/auth/signin', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`${credentials}:${password}`)}`
        }
    })
        .then(res => {
            if (!res.ok) {
                throw 'Invalid credentials'
            }
            return res.json();
        })
        .then(data => {

            localStorage.setItem('jwt', data)
            app.innerHTML = ""

            initializeApp();

        })
        .catch(err => {
            errorMessage.textContent = err
        })

}

export function createLoginElement() {
    let div = document.createElement("div")
    div.className = "loginContainer"
    div.innerHTML = `
          <form id="loginForm">
              <h2>Login</h2>
              <input type="text" id="credentials" placeholder="Username or Email" required>
              <input type="password" id="password" placeholder="Password" required>
              <div id="errorMessage" class="error-message"></div>
              <button type="submit">Login</button>
          </form>
      `
    return div
}
