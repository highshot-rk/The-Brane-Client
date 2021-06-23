import { injectReducer } from 'redux-injectors'
import { createSlice } from '@reduxjs/toolkit'
import { getUser, deleteUser, updateUser } from 'api/users'
import { logout } from 'containers/Auth/reducer'

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
  },
  reducers: {
    loadingStarted (state, action) {
      const {
        _id,
      } = action.payload
      state[_id] = {
        loading: true,
      }
    },
    profileLoaded (state, action) {
      const {
        _id,
        firstName,
        lastName,
        email,
      } = action.payload

      state[_id].loading = false
      state[_id].firstName = firstName
      state[_id].lastName = lastName
      state[_id].email = email
    },

    // removes a user's profile from memory
    // probably not wanted for the current user
    // but can be used to reduce memory usage
    // when visiting many other people's profiles
    profileUnloaded (state, action) {
      const {
        _id,
      } = action.payload

      delete state[_id]
    },
  },
})

export default profileSlice

export const {
  loadingStarted,
  profileLoaded,
  profileUnloaded,
} = profileSlice.actions

export function loadProfile (userId) {
  return async function (dispatch) {
    dispatch(loadingStarted({ _id: userId }))
    const result = await getUser()
    dispatch(profileLoaded({
      firstName: result.first_name,
      lastName: result.last_name,
      email: result.email,
      _id: result.id,
    }))
  }
}

export function removeAccount (userId) {
  return async function (dispatch) {
    dispatch(loadingStarted({ _id: userId }))
    await deleteUser(userId)
    dispatch(profileUnloaded(userId))
    dispatch(logout())
  }
}

export function updateProfile (userId, profile) {
  return async function (dispatch) {
    dispatch(loadingStarted({ _id: userId }))
    await updateUser(userId, profile)
    dispatch(loadProfile(userId))
  }
}

export const composeProfileReducer = [
  injectReducer({ key: 'profile', reducer: profileSlice.reducer }),
]
