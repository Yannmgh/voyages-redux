import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Commentaires sur les destinations : affichage public, ajout par un utilisateur
// connecté, suppression réservée aux admins (modération).

const initialState = {
    byDestination: [],
    byDestinationStatus: "idle", // idle | loading | succeeded | failed
    byDestinationError: null,

    mine: [],
    mineStatus: "idle",
    mineError: null,

    createStatus: "idle", // idle | loading | succeeded | failed
    createError: null,

    deleteStatus: "idle",
    deleteError: null,

    all: [],
    allStatus: "idle", // idle | loading | succeeded | failed
    allError: null,
}

export const fetchCommentsByDestination = createAsyncThunk(
    "comments/fetchCommentsByDestination",
    async (destinationId, { rejectWithValue }) => {
        try {
            return await apiRequest(`/comments/by-destination.php?destination_id=${destinationId}`)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchMyComments = createAsyncThunk(
    "comments/fetchMyComments",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/comments/by-user.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createComment = createAsyncThunk(
    "comments/createComment",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/comments/store.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Il n'existe pas d'endpoint "liste tous les commentaires" côté API (seulement
// by-destination et by-user) : pour la modération admin, on agrège les
// commentaires de chaque destination, en y attachant son nom pour l'affichage.
export const fetchAllComments = createAsyncThunk(
    "comments/fetchAllComments",
    async (destinations, { rejectWithValue }) => {
        try {
            const results = await Promise.all(
                destinations.map(async (destination) => {
                    const comments = await apiRequest(`/comments/by-destination.php?destination_id=${destination.id}`)
                    return comments.map((comment) => ({ ...comment, destination_name: destination.name }))
                })
            )

            return results.flat()
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (id, { rejectWithValue }) => {
        try {
            await apiRequest("/comments/delete.php", {
                method: "POST",
                body: JSON.stringify({ id }),
            })
            return id
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        clearCreateStatus(state) {
            state.createStatus = "idle"
            state.createError = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsByDestination.pending, (state) => {
                state.byDestinationStatus = "loading"
                state.byDestinationError = null
            })
            .addCase(fetchCommentsByDestination.fulfilled, (state, action) => {
                state.byDestinationStatus = "succeeded"
                state.byDestination = action.payload
            })
            .addCase(fetchCommentsByDestination.rejected, (state, action) => {
                state.byDestinationStatus = "failed"
                state.byDestinationError = action.payload || "Impossible de récupérer les commentaires"
            })
            .addCase(fetchMyComments.pending, (state) => {
                state.mineStatus = "loading"
                state.mineError = null
            })
            .addCase(fetchMyComments.fulfilled, (state, action) => {
                state.mineStatus = "succeeded"
                state.mine = action.payload
            })
            .addCase(fetchMyComments.rejected, (state, action) => {
                state.mineStatus = "failed"
                state.mineError = action.payload || "Impossible de récupérer vos commentaires"
            })
            .addCase(createComment.pending, (state) => {
                state.createStatus = "loading"
                state.createError = null
            })
            .addCase(createComment.fulfilled, (state) => {
                // La liste est rechargée par l'appelant (dispatch(fetchCommentsByDestination(...)))
                state.createStatus = "succeeded"
            })
            .addCase(createComment.rejected, (state, action) => {
                state.createStatus = "failed"
                state.createError = action.payload || "Impossible d'ajouter votre commentaire"
            })
            .addCase(deleteComment.pending, (state) => {
                state.deleteStatus = "loading"
                state.deleteError = null
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded"
                state.byDestination = state.byDestination.filter((item) => item.id !== action.payload)
                state.all = state.all.filter((item) => item.id !== action.payload)
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.deleteStatus = "failed"
                state.deleteError = action.payload || "Impossible de supprimer ce commentaire"
            })
            .addCase(fetchAllComments.pending, (state) => {
                state.allStatus = "loading"
                state.allError = null
            })
            .addCase(fetchAllComments.fulfilled, (state, action) => {
                state.allStatus = "succeeded"
                state.all = action.payload
            })
            .addCase(fetchAllComments.rejected, (state, action) => {
                state.allStatus = "failed"
                state.allError = action.payload || "Impossible de récupérer les commentaires"
            })
    },
})

export const { clearCreateStatus } = commentsSlice.actions
export default commentsSlice.reducer
