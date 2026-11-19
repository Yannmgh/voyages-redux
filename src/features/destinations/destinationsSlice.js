import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Destinations et régions réelles (voir api/apiClient.js), à la place des données
// statiques de l'ancienne version (src/data/destinations.js).

const initialState = {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,

    regions: [],
    regionsStatus: "idle",
    regionsError: null,

    current: null,
    currentStatus: "idle",
    currentError: null,

    actionStatus: "idle", // idle | loading | succeeded | failed (création / suppression)
    actionError: null,
}

export const fetchDestinations = createAsyncThunk(
    "destinations/fetchDestinations",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/destinations/index.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchRegions = createAsyncThunk(
    "destinations/fetchRegions",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/regions/index.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchDestinationBySlug = createAsyncThunk(
    "destinations/fetchDestinationBySlug",
    async (slug, { rejectWithValue }) => {
        try {
            return await apiRequest(`/destinations/show.php?slug=${encodeURIComponent(slug)}`)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchDestinationsByRegion = createAsyncThunk(
    "destinations/fetchDestinationsByRegion",
    async (region, { rejectWithValue }) => {
        try {
            return await apiRequest(`/destinations/by-region.php?region=${encodeURIComponent(region)}`)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createDestination = createAsyncThunk(
    "destinations/createDestination",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/destinations/store.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteDestination = createAsyncThunk(
    "destinations/deleteDestination",
    async (id, { rejectWithValue }) => {
        try {
            await apiRequest("/destinations/delete.php", {
                method: "POST",
                body: JSON.stringify({ id }),
            })
            return id
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const destinationsSlice = createSlice({
    name: "destinations",
    initialState,
    reducers: {
        clearActionStatus(state) {
            state.actionStatus = "idle"
            state.actionError = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDestinations.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchDestinations.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.items = action.payload
            })
            .addCase(fetchDestinations.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || "Impossible de récupérer les destinations"
            })
            .addCase(fetchRegions.pending, (state) => {
                state.regionsStatus = "loading"
                state.regionsError = null
            })
            .addCase(fetchRegions.fulfilled, (state, action) => {
                state.regionsStatus = "succeeded"
                state.regions = action.payload
            })
            .addCase(fetchRegions.rejected, (state, action) => {
                state.regionsStatus = "failed"
                state.regionsError = action.payload || "Impossible de récupérer les régions"
            })
            .addCase(fetchDestinationBySlug.pending, (state) => {
                state.currentStatus = "loading"
                state.currentError = null
                state.current = null
            })
            .addCase(fetchDestinationBySlug.fulfilled, (state, action) => {
                state.currentStatus = "succeeded"
                state.current = action.payload
            })
            .addCase(fetchDestinationBySlug.rejected, (state, action) => {
                state.currentStatus = "failed"
                state.currentError = action.payload || "Destination introuvable"
            })
            .addCase(fetchDestinationsByRegion.fulfilled, (state, action) => {
                state.items = action.payload
            })
            .addCase(createDestination.pending, (state) => {
                state.actionStatus = "loading"
                state.actionError = null
            })
            .addCase(createDestination.fulfilled, (state) => {
                // La liste est rechargée par l'appelant (dispatch(fetchDestinations()))
                // plutôt que de deviner la forme exacte de la réponse de l'API.
                state.actionStatus = "succeeded"
            })
            .addCase(createDestination.rejected, (state, action) => {
                state.actionStatus = "failed"
                state.actionError = action.payload || "Impossible de créer la destination"
            })
            .addCase(deleteDestination.pending, (state) => {
                state.actionStatus = "loading"
                state.actionError = null
            })
            .addCase(deleteDestination.fulfilled, (state, action) => {
                state.actionStatus = "succeeded"
                state.items = state.items.filter((item) => item.id !== action.payload)
            })
            .addCase(deleteDestination.rejected, (state, action) => {
                state.actionStatus = "failed"
                state.actionError = action.payload || "Impossible de supprimer la destination"
            })
    },
})

export const { clearActionStatus } = destinationsSlice.actions
export default destinationsSlice.reducer
