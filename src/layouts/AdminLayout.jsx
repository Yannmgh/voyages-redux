import { Suspense } from "react"
import { Nav } from "react-bootstrap"
import { Link, NavLink, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import {
    FiGrid,
    FiMapPin,
    FiMessageSquare,
    FiUsers,
    FiMail,
    FiArrowLeft,
} from "react-icons/fi"
import RouteLoader from "../components/RouteLoader"

const NAV_ITEMS = [
    { to: "/admin", label: "Vue d'ensemble", icon: <FiGrid />, end: true },
    { to: "/admin/destinations", label: "Destinations", icon: <FiMapPin /> },
    { to: "/admin/comments", label: "Commentaires", icon: <FiMessageSquare /> },
    { to: "/admin/users", label: "Utilisateurs", icon: <FiUsers /> },
    { to: "/admin/contacts", label: "Messages", icon: <FiMail /> },
]

// Layout commun aux sous-pages d'administration (/admin/*). <AdminRoute>
// protège déjà /admin au niveau du router.
function AdminLayout() {
    const user = useSelector((state) => state.auth.user)
    const initial = user?.username?.charAt(0).toUpperCase() ?? "A"

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar d-none d-lg-block">
                <div className="admin-sidebar-header">
                    <span className="admin-sidebar-avatar">{initial}</span>
                    <div>
                        <div className="admin-sidebar-name">{user?.username}</div>
                        <div className="admin-sidebar-role">Administration</div>
                    </div>
                </div>

                <nav>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `admin-sidebar-link${isActive ? " active" : ""}`}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-sidebar-link">
                        <FiArrowLeft />
                        Retour au site
                    </Link>
                </div>
            </aside>

            <div className="admin-content">
                <Nav variant="pills" className="admin-mobile-nav mb-4 flex-nowrap overflow-auto d-lg-none pb-1">
                    {NAV_ITEMS.map((item) => (
                        <Nav.Item key={item.to}>
                            <Nav.Link as={NavLink} to={item.to} end={item.end}>
                                {item.icon} {item.label}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                <Suspense fallback={<RouteLoader />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    )
}

export default AdminLayout
