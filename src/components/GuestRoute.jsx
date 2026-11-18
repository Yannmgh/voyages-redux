import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

// Empêche un utilisateur déjà connecté de retourner sur les pages de connexion/inscription.
function GuestRoute({ children }) {
    const user = useSelector((state) => state.auth.user)

    if (user) {
        return <Navigate to="/profile" replace />
    }

    return children
}

export default GuestRoute
