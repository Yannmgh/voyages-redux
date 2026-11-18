// Client HTTP pour l'API réelle du projet (remplace l'ancienne intégration DummyJSON).
const API_URL = "https://qyklv804.webmo.me/api"

/*
Endpoints disponibles :
    POST    /auth/register.php
    POST    /auth/login.php
    GET     /auth/me.php
    POST    /contact/store.php
    GET     /contact/index.php
    GET     /favorites/index.php
    POST    /favorites/store.php
    POST    /favorites/delete.php
*/

export async function apiRequest(endpoint, options = {}) {
    // Le token est stocké après la connexion (voir authSlice.js).
    const token = localStorage.getItem("token")

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    }

    if (token) {
        // Authorization standard : certains hébergements le bloquent, l'API
        // attend donc le token via ce header personnalisé.
        headers["X-Auth-Token"] = token
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.message || "Une erreur est survenue")
    }

    return data
}
