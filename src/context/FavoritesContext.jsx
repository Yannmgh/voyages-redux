/* eslint-disable react-refresh/only-export-components -- fichier de contexte : Provider + hook useFavorites */
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"

// Les favoris sont stockés dans le localStorage, dans une liste par utilisateur
// (clé basée sur le username) afin que chaque compte ait ses propres favoris.

const FavoritesContext = createContext(null)

function storageKeyFor(username) {
    return `voyages_favorites_${username}`
}

function readFavorites(username) {
    if (!username) {
        return []
    }

    try {
        return JSON.parse(localStorage.getItem(storageKeyFor(username))) ?? []
    } catch {
        return []
    }
}

export function FavoritesProvider({ children }) {
    const user = useSelector((state) => state.auth.user)
    const username = user?.username ?? null
    const [favorites, setFavorites] = useState(() => readFavorites(username))
    const [loadedUsername, setLoadedUsername] = useState(username)

    // Recharge les favoris lorsque l'utilisateur change (connexion/déconnexion).
    // On ajuste l'état pendant le rendu plutôt que dans un effet (cf. doc React
    // "Adjusting state when a prop changes") pour éviter un rendu en cascade.
    if (username !== loadedUsername) {
        setLoadedUsername(username)
        setFavorites(readFavorites(username))
    }

    useEffect(() => {
        if (username) {
            localStorage.setItem(storageKeyFor(username), JSON.stringify(favorites))
        }
    }, [favorites, username])

    const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites])

    const addFavorite = useCallback((slug) => {
        setFavorites((current) => (current.includes(slug) ? current : [...current, slug]))
    }, [])

    const removeFavorite = useCallback((slug) => {
        setFavorites((current) => current.filter((item) => item !== slug))
    }, [])

    const toggleFavorite = useCallback((slug) => {
        if (!username) {
            return
        }

        setFavorites((current) =>
            current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
        )
    }, [username])

    return (
        <FavoritesContext.Provider
            value={{ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }}
        >
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext)

    if (!context) {
        throw new Error("useFavorites doit être utilisé à l'intérieur d'un FavoritesProvider")
    }

    return context
}
