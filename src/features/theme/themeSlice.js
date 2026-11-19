import { createSlice } from "@reduxjs/toolkit"

// Thème clair / sombre (accessibilité), à la place de l'ancien ThemeContext.
// Le choix de l'utilisateur est mémorisé dans le localStorage, sinon on
// respecte la préférence système (prefers-color-scheme).

const THEME_KEY = "voyages_theme"

function getPreferredTheme() {
    try {
        const stored = localStorage.getItem(THEME_KEY)
        if (stored === "light" || stored === "dark") {
            return stored
        }
    } catch {
        // localStorage indisponible : on ignore et on retombe sur la préférence système
    }

    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return "dark"
    }

    return "light"
}

const initialState = {
    theme: getPreferredTheme(),
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload

            try {
                localStorage.setItem(THEME_KEY, action.payload)
            } catch {
                // localStorage indisponible : le thème reste actif pour la session en cours
            }
        },
        toggleTheme(state) {
            state.theme = state.theme === "dark" ? "light" : "dark"

            try {
                localStorage.setItem(THEME_KEY, state.theme)
            } catch {
                // localStorage indisponible : le thème reste actif pour la session en cours
            }
        },
    },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
