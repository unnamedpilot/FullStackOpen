import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert severity={notification.type}>{notification.text}</Alert>
  )
}

export default Notification
