/* eslint-disable react-refresh/only-export-components -- fichier de contexte : Provider + hook useTheme */
import { createContext, useCallback, useContext, useEffect, useState } from "react"

// Gère le thème graphique (clair / sombre) pour l'accessibilité.
// Le choix de l'utilisateur est mémorisé dans le localStorage, sinon on
// respecte la préférence système (prefers-color-scheme).

const ThemeContext = createContext(null)
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

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getPreferredTheme)

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme)

        try {
            localStorage.setItem(THEME_KEY, theme)
        } catch {
            // localStorage indisponible : le thème reste actif pour la session en cours
        }
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === "dark" ? "light" : "dark"))
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider")
    }

    return context
}
