import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Envoi d'une demande de contact (publique, liée au compte si l'utilisateur est
// connecté - voir apiClient.js) et consultation des demandes, réservée aux admins.

const initialState = {
    submitStatus: "idle", // idle | loading | succeeded | failed
    submitError: null,
    messages: [],
    messagesStatus: "idle", // idle | loading | succeeded | failed
    messagesError: null,
}

export const submitContactMessage = createAsyncThunk(
    "contact/submitContactMessage",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/contact/store.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchContactMessages = createAsyncThunk(
    "contact/fetchContactMessages",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/contact/index.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        resetContactStatus(state) {
            state.submitStatus = "idle"
            state.submitError = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitContactMessage.pending, (state) => {
                state.submitStatus = "loading"
                state.submitError = null
            })
            .addCase(submitContactMessage.fulfilled, (state) => {
                state.submitStatus = "succeeded"
            })
            .addCase(submitContactMessage.rejected, (state, action) => {
                state.submitStatus = "failed"
                state.submitError = action.payload || "Impossible d'envoyer votre message"
            })
            .addCase(fetchContactMessages.pending, (state) => {
                state.messagesStatus = "loading"
                state.messagesError = null
            })
            .addCase(fetchContactMessages.fulfilled, (state, action) => {
                state.messagesStatus = "succeeded"
                state.messages = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.data ?? []
            })
            .addCase(fetchContactMessages.rejected, (state, action) => {
                state.messagesStatus = "failed"
                state.messagesError = action.payload || "Impossible de récupérer les demandes de contact"
            })
    },
})

export const { resetContactStatus } = contactSlice.actions
export default contactSlice.reducer
