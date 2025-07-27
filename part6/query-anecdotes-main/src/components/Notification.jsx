import { useNotificationDispatch, useNotificationValue } from "./NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor: notification ? (notification.includes('Error') ? '#f8d7da' : '#d4edda') : 'transparent',
    opacity: notification ? 1 : 0,
  }
  
  if (!notification) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
