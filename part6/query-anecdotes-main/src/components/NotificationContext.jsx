import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch(action.type){
        case 'SET_NOTIFICATION':
            return action.payload;
        case 'CLEAR_NOTIFCIATION':
            return null;
        default:
            return state;
    }
}

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    return useContext(NotificationContext)[0]
}

export const useNotificationDispatch = () => {
    return useContext(NotificationContext)[1]
}