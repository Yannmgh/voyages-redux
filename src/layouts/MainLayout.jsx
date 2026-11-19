import { useEffect } from "react"
import { Container } from "react-bootstrap"
import { Outlet, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { clearFavorites, fetchFavorites } from "../features/favorites/favoritesSlice"

// La Navbar est commune à toutes les pages
// <Outlet /> représente le contenu enfant (les pages qui seront appelées depuis MainLayout)

function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === "/"
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites())
    } else {
      dispatch(clearFavorites())
    }
  }, [dispatch, user])

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
