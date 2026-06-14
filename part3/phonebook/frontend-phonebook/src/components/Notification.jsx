const Notification = ({ message, errorStatus }) => {
    const main_color = errorStatus ? "red" : "green"

    

    const notificationStyles = {
        backgroundColor: "lightgray",
        color: main_color,
        fontSize: 24,
        padding: 12,
        borderRadius: 4,
        borderColor: main_color,
        borderStyle: "solid",
        
    }

    if (message === null) {
        return null
    }

    return (
        <div style={notificationStyles}>
            {message}
        </div>
    )
}

export default Notification