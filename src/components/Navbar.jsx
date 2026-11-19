import { useEffect, useState } from "react"
import { Navbar as BootstrapNavbar, Nav, Container, Button, Offcanvas } from "react-bootstrap"
import { NavLink, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
    FiHome,
    FiMapPin,
    FiMail,
    FiInfo,
    FiHeart,
    FiGrid,
    FiUser,
    FiLogOut,
    FiSun,
    FiMoon,
} from "react-icons/fi"
import { logout } from "../features/auth/authSlice"
import { toggleTheme } from "../features/theme/themeSlice"

function Navbar() {
    const user = useSelector((state) => state.auth.user)
    const theme = useSelector((state) => state.theme.theme)
    const dispatch = useDispatch()
    const [expanded, setExpanded] = useState(false)
    const [scrollY, setScrollY] = useState(() => window.scrollY)
    const location = useLocation()
    const isHome = location.pathname === "/"

    const closeMenu = () => setExpanded(false)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme)
    }, [theme])

    const transparent = isHome && scrollY <= 60 && !expanded

    return (
        <BootstrapNavbar
            className={`vy-navbar${transparent ? " vy-navbar-transparent" : ""}`}
            variant="dark"
            expand="lg"
            fixed="top"
            expanded={expanded}
            onToggle={setExpanded}
        >
            <Container>
                <BootstrapNavbar.Brand as={NavLink} to="/" onClick={closeMenu}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2.5 2v1.5l4-1 4 1V20l-2.5-2v-4.5l8 2.5z"
                            fill="url(#vy-plane-gradient)"
                        />
                        <defs>
                            <linearGradient id="vy-plane-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#fb923c" />
                                <stop offset="55%" stopColor="#fb7185" />
                                <stop offset="100%" stopColor="#be185d" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="brand-text">Voyages</span>
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="main-navbar" />
                <BootstrapNavbar.Offcanvas id="main-navbar" placement="end" className="vy-offcanvas">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="font-display fw-bold">Voyages</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" onClick={closeMenu} end>
                                <FiHome className="nav-link-icon" /> Accueil
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/destinations" onClick={closeMenu}>
                                <FiMapPin className="nav-link-icon" /> Destinations
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/contact" onClick={closeMenu}>
                                <FiMail className="nav-link-icon" /> Contact
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/about" onClick={closeMenu}>
                                <FiInfo className="nav-link-icon" /> A propos
                            </Nav.Link>
                            {user && (
                                <Nav.Link as={NavLink} to="/favorites" onClick={closeMenu}>
                                    <FiHeart className="nav-link-icon" /> Favoris
                                </Nav.Link>
                            )}
                            {user?.role === "admin" && (
                                <Nav.Link as={NavLink} to="/admin" onClick={closeMenu}>
                                    <FiGrid className="nav-link-icon" /> Administration
                                </Nav.Link>
                            )}
                        </Nav>
                        <Nav className="align-items-lg-center gap-2">
                            <button
                                type="button"
                                className="theme-toggle-btn"
                                onClick={() => dispatch(toggleTheme())}
                                aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
                                title={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
                            >
                                {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </button>
                            {user ? (
                                <>
                                    <Nav.Link as={NavLink} to="/profile" onClick={closeMenu}>
                                        <FiUser className="nav-link-icon" /> {user.username}
                                    </Nav.Link>
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => { dispatch(logout()); closeMenu() }}
                                        className="align-self-start"
                                    >
                                        <FiLogOut className="mb-1 me-1" /> Déconnexion
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/login" onClick={closeMenu}>
                                        Connexion
                                    </Nav.Link>
                                    <Button
                                        as={NavLink}
                                        to="/register"
                                        onClick={closeMenu}
                                        size="sm"
                                        className="btn-gradient align-self-start"
                                    >
                                        Inscription
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Offcanvas.Body>
                </BootstrapNavbar.Offcanvas>
            </Container>
        </BootstrapNavbar>
    )
}

export default Navbar
