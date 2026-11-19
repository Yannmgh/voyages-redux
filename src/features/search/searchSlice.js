import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Recherche serveur sur les destinations (mot-clé et/ou région), à la place du
// filtrage client-side sur les données locales.

const initialState = {
    results: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
}

export const searchDestinations = createAsyncThunk(
    "search/searchDestinations",
    async ({ keyword, region }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams()
            if (keyword) {
                params.set("keyword", keyword)
            }
            if (region) {
                params.set("region", region)
            }

            return await apiRequest(`/destinations/search.php?${params.toString()}`)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchDestinations.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(searchDestinations.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.results = action.payload
            })
            .addCase(searchDestinations.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || "Impossible d'effectuer la recherche"
            })
    },
})

export default searchSlice.reducer
