const ChatMessage = ({message:{text, sender}, currentUser}) => {
    const sentByCurentUser = (currentUser === message.user)

    return (
        sentByCurrentUser ?
        (
            <div className="flex justify-end rounded bg-thyme-200">
                <p className="text-thyme-700">{message.sender}</p>
                <div>
                    <p className="text-thyme-900">{message.text}</p>
                </div>
            </div>
        ) 
        : (
            <div className="flex justify-start rounded bg-thyme-100">
                <p className="text-thyme-800">{message.sender}</p>
                <div>
                    <p className="text-thyme-900">{message.text}</p>
                </div>
            </div>
        )
    )
}

export default ChatMessage
