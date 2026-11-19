import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import contactReducer from "../features/contact/contactSlice"
import commentsReducer from "../features/comments/commentsSlice"
import destinationsReducer from "../features/destinations/destinationsSlice"
import favoritesReducer from "../features/favorites/favoritesSlice"
import searchReducer from "../features/search/searchSlice"
import themeReducer from "../features/theme/themeSlice"
import usersReducer from "../features/users/usersSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contact: contactReducer,
        destinations: destinationsReducer,
        favorites: favoritesReducer,
        users: usersReducer,
        comments: commentsReducer,
        search: searchReducer,
        theme: themeReducer,
    },
})
