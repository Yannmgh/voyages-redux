import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Gestion des utilisateurs : édition de son propre profil / mot de passe,
// et consultation + changement de mot de passe par un administrateur.

const initialState = {
    list: [],
    listStatus: "idle", // idle | loading | succeeded | failed
    listError: null,

    updateStatus: "idle", // idle | loading | succeeded | failed
    updateError: null,

    passwordStatus: "idle", // idle | loading | succeeded | failed
    passwordError: null,
}

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/users/index.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    "users/updateProfile",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/profile/update.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const changePassword = createAsyncThunk(
    "users/changePassword",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/profile/change-password.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const changeUserPassword = createAsyncThunk(
    "users/changeUserPassword",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/users/change-password.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearUpdateStatus(state) {
            state.updateStatus = "idle"
            state.updateError = null
        },
        clearPasswordStatus(state) {
            state.passwordStatus = "idle"
            state.passwordError = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.listStatus = "loading"
                state.listError = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.listStatus = "succeeded"
                state.list = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.listStatus = "failed"
                state.listError = action.payload || "Impossible de récupérer les utilisateurs"
            })
            .addCase(updateProfile.pending, (state) => {
                state.updateStatus = "loading"
                state.updateError = null
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.updateStatus = "succeeded"
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateStatus = "failed"
                state.updateError = action.payload || "Impossible de mettre à jour le profil"
            })
            .addCase(changePassword.pending, (state) => {
                state.passwordStatus = "loading"
                state.passwordError = null
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.passwordStatus = "succeeded"
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.passwordStatus = "failed"
                state.passwordError = action.payload || "Impossible de changer le mot de passe"
            })
            .addCase(changeUserPassword.pending, (state) => {
                state.passwordStatus = "loading"
                state.passwordError = null
            })
            .addCase(changeUserPassword.fulfilled, (state) => {
                state.passwordStatus = "succeeded"
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.passwordStatus = "failed"
                state.passwordError = action.payload || "Impossible de changer le mot de passe de cet utilisateur"
            })
    },
})

export const { clearUpdateStatus, clearPasswordStatus } = usersSlice.actions
export default usersSlice.reducer
