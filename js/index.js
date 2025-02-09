import { createLoginElement, handleLogin } from "./login.js";
import { fetchProfileData } from "./fetchData.js";
import { createGraphElement } from "./graphs.js";
import { calculateAuditStats, createCardsElement } from "./cards.js";


export const app = document.getElementById("app")


async function isLogin() {
    let jwt = localStorage.getItem('jwt');
    if (!jwt) {
        return false;
    }
    const res = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
        {
            user {
                id
            }
        }
    ` })
    })
    const data = await res.json()

    if (data.errors == null) {
        return true
    } else {
        return false
    }
}

function handleLogout() {
    localStorage.removeItem('jwt');
    app.innerHTML = ''
    app.append(createLoginElement())
    let loginForm = document.getElementById("loginForm")
    loginForm.addEventListener('submit', handleLogin);
}

function createHeaderElement() {
    const div = document.createElement('div');
    div.className = 'header';

    div.innerHTML = `
        <h1 id="title">Graphql</h1>
        <button id="logoutButton">Logout</button>
      `
    return div
}

export async function initializeApp() {
    const data = await fetchProfileData();

    const totalXP = data.xpTransactions.reduce((sum, t) => sum + t.amount, 0);
    const completedProjects = data.progress.filter(p => p.isDone).length;
    const notCompletedProjects = data.progress.filter(p => !p.isDone);
    const auditStats = calculateAuditStats(data.upDownTransactions);
    const xpProjects = data.xpTransactions.filter(transaction => transaction.object.type === "project");

    const HeaderElement = createHeaderElement()
    app.append(HeaderElement)

    const CardsElement = createCardsElement(auditStats, data.user[0], totalXP, completedProjects, notCompletedProjects)
    app.append(CardsElement)
    
    createGraphElement(xpProjects, data.skillsTransactions)

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', handleLogout);
}

document.addEventListener("DOMContentLoaded", async function () {
    let tf = await isLogin()

    if (tf == true) {
        initializeApp()
    } else {
        app.append(createLoginElement())
        let loginForm = document.getElementById("loginForm")
        loginForm.addEventListener('submit', handleLogin);
    }
});
