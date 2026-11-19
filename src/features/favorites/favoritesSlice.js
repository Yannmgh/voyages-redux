import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Favoris stockés côté API (par utilisateur connecté), à la place de l'ancienne
// version en localStorage (src/context/FavoritesContext.jsx).

const initialState = {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    actionStatus: "idle", // idle | loading | succeeded | failed
    actionError: null,
}

export const fetchFavorites = createAsyncThunk(
    "favorites/fetchFavorites",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/favorites/index.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addFavorite = createAsyncThunk(
    "favorites/addFavorite",
    async ({ destinationId, title, image }, { rejectWithValue }) => {
        try {
            await apiRequest("/favorites/store.php", {
                method: "POST",
                body: JSON.stringify({ destinationId, title, image }),
            })
            return { destinationId, title, image }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeFavorite = createAsyncThunk(
    "favorites/removeFavorite",
    async (destinationId, { rejectWithValue }) => {
        try {
            await apiRequest("/favorites/delete.php", {
                method: "POST",
                body: JSON.stringify({ destinationId }),
            })
            return destinationId
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        clearFavorites(state) {
            state.items = []
            state.status = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.items = action.payload
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || "Impossible de récupérer vos favoris"
            })
            .addCase(addFavorite.pending, (state) => {
                state.actionStatus = "loading"
                state.actionError = null
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.actionStatus = "succeeded"
                state.items.push({
                    destination_id: action.payload.destinationId,
                    destination_title: action.payload.title,
                    destination_image: action.payload.image,
                })
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.actionStatus = "failed"
                state.actionError = action.payload || "Impossible d'ajouter ce favori"
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (item) => String(item.destination_id) !== String(action.payload)
                )
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                state.actionStatus = "failed"
                state.actionError = action.payload || "Impossible de retirer ce favori"
            })
    },
})

export const { clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
