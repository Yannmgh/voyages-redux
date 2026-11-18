import { useEffect, useState } from "react"
import { Navbar as BootstrapNavbar, Nav, Container, Button } from "react-bootstrap"
import { NavLink, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth/authSlice"
import { useTheme } from "../context/ThemeContext"

function Navbar() {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const { theme, toggleTheme } = useTheme()
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
                <BootstrapNavbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" onClick={closeMenu} end>
                            Accueil
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/destinations" onClick={closeMenu}>
                            Destinations
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/contact" onClick={closeMenu}>
                            Contact
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" onClick={closeMenu}>
                            A propos
                        </Nav.Link>
                        {user && (
                            <Nav.Link as={NavLink} to="/favorites" onClick={closeMenu}>
                                Favoris
                            </Nav.Link>
                        )}
                        {user?.role === "admin" && (
                            <Nav.Link as={NavLink} to="/admin" onClick={closeMenu}>
                                Administration
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-lg-center gap-2">
                        <button
                            type="button"
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
                            title={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
                        >
                            {theme === "dark" ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>
                        {user ? (
                            <>
                                <Nav.Link as={NavLink} to="/profile" onClick={closeMenu}>
                                    {user.username}
                                </Nav.Link>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() => { dispatch(logout()); closeMenu() }}
                                    className="align-self-start"
                                >
                                    Déconnexion
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
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    )
}

export default Navbar
