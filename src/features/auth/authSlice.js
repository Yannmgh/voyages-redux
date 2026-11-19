import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../../api/apiClient"

// Auth branchée sur l'API réelle (voir api/apiClient.js) : login et inscription
// utilisent désormais le même compte, à la différence de l'ancienne version qui
// combinait un register() local de démo et un login() DummyJSON.

const USER_KEY = "user"
const TOKEN_KEY = "token"

function readStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
        return null
    }
}

const initialState = {
    user: readStoredUser(),
    token: localStorage.getItem(TOKEN_KEY) || null,
    profile: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
}

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            return await apiRequest("/auth/login.php", {
                method: "POST",
                body: JSON.stringify(credentials),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            return await apiRequest("/auth/register.php", {
                method: "POST",
                body: JSON.stringify(formData),
            })
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            return await apiRequest("/auth/me.php")
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null
            state.token = null
            state.profile = null
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(TOKEN_KEY)
        },
        clearAuthError(state) {
            state.error = null
        },
        patchUser(state, action) {
            if (!state.user) {
                return
            }

            state.user = { ...state.user, ...action.payload }
            localStorage.setItem(USER_KEY, JSON.stringify(state.user))
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.user = action.payload
                state.token = action.payload.accessToken
                localStorage.setItem(USER_KEY, JSON.stringify(action.payload))
                localStorage.setItem(TOKEN_KEY, action.payload.accessToken)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || "Nom d'utilisateur ou mot de passe incorrect"
            })
            .addCase(registerUser.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = "succeeded"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || "Impossible de créer le compte"
            })
            .addCase(fetchProfile.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.profile = action.payload
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || "Impossible de récupérer votre profil"
            })
    },
})

export const { logout, clearAuthError, patchUser } = authSlice.actions
export default authSlice.reducer
