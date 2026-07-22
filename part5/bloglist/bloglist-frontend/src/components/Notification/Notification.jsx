import styles from './Notification.module.css'

const Notification = ({ message, options }) => {
  if (!message) {
    return null;
  }

  const type = options.type === 'error' 
    ? styles.error
    : styles.success

  const notificationStyles = `${styles.notification} ${type}`

  return (
    <>
      <div className={notificationStyles}>{message}</div>
    </>
  );
};

export default Notification
