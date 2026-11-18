import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

// Protège une route : redirige vers /login si personne n'est connecté,
// et vers l'accueil si l'utilisateur connecté n'a pas le rôle "admin".
function AdminRoute({ children }) {
    const user = useSelector((state) => state.auth.user)
    const location = useLocation()

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute
