import { Container } from "react-bootstrap"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

// La Navbar est commune à toutes les pages
// <Outlet /> représente le contenu enfant (les pages qui seront appelées depuis MainLayout)

function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="app-shell">
      <Navbar />
      <main className={isHome ? "app-main app-main-flush" : "app-main"}>
        {isHome ? <Outlet /> : <Container className="py-4"><Outlet /></Container>}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
