const notificationReducer = (state = null, action) => {
    switch(action.type){
        case 'SET_NOTIFICATION':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return null
        default:
            return state
    }
}

export const setNotification = (message, timeout) => {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            payload: message,
        })

        setTimeout(() => {
            dispatch({
                type: 'CLEAR_NOTIFICATION',
            })
        }, timeout * 1000)
    }
}

export const clearNotification = () => {
    return {
        type: 'CLEAR_NOTIFICATION'
    }
}

export default notificationReducer