import { createSlice } from '@reduxjs/toolkit'

let timeoutId

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload
    },
    clear() {
      return ''
    }
  }
})

export const setNotification = (message, seconds) => {
    return dispatch => {
        dispatch(notificationSlice.actions.set(message))

        if(timeoutId){
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            dispatch(notificationSlice.actions.clear())
        }, seconds * 1000)
    }
}

export const { clear } = notificationSlice.actions
export default notificationSlice.reducer
