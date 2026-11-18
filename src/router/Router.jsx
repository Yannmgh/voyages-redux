// Avec react router, il est possible de déplacer la logique de navigation dans un fichier dédié.
import { createBrowserRouter, Navigate } from "react-router-dom"
// createBrowserRouter permet de créer un router selon les url du navigateur

import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "../components/ProtectedRoute"
import GuestRoute from "../components/GuestRoute"
import AdminRoute from "../components/AdminRoute"
import AboutPage from "../pages/AboutPage"
import AdminPage from "../pages/AdminPage"
import DestinationDetailsPage from "../pages/DestinationDetailsPage"
import DestinationsPage from "../pages/DestinationsPage"
import FavoritesPage from "../pages/FavoritesPage"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import NotFoundPage from "../pages/NotFoundPage"
import ProfilePage from "../pages/ProfilePage"
import RegisterPage from "../pages/RegisterPage"
import ContactPage from "../pages/ContactPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        // Toutes les pages passent par MainLayout
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                // c'est la page par défaut
                element: <HomePage />
            }, 
            {
                path: "destinations",
                element: <DestinationsPage />
            },
            {
                path: "destinations/:slug",
                element: <DestinationDetailsPage />
            },
            {
                path: "search",
                // La recherche a été intégrée directement à la page Destinations.
                element: <Navigate to="/destinations" replace />
            },
            {
                path: "contact",
                element: <ContactPage />
            },
            {
                path: "about",
                element: <AboutPage />
            },
            {
                path: "login",
                element: (
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                )
            },
            {
                path: "register",
                element: (
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                )
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "favorites",
                element: (
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "admin",
                element: (
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                )
            },
            {
                path: "*",
                element: <NotFoundPage />
            },
        ]
    }
], { basename: import.meta.env.BASE_URL })

export default router