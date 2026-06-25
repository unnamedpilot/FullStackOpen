const Notification = ({ message }) => {
    // When a component return null, it doesn't render.
    // This is a trick to make dissapear the component.
    if (message === null) {
        return null
    }

    return(
        <div className="error">
            {message}
        </div>
    )    
    
}

export default Notification