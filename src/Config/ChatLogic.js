export const getSender = (loggedUser, chatUsers) => {
    return (chatUsers[0]._id === loggedUser._id) ? chatUsers[1].name : chatUsers[0].name;
}
export const getSenderFull = (loggedUser, chatUsers) => {
    return (chatUsers[0]._id === loggedUser._id) ? chatUsers[1] : chatUsers[0];
}
export const isSameSender = (messages, u, i, userId) => {
    return (i < messages.length - 1 && (messages[i + 1].sender._id !== messages[i].sender._id || messages[i + 1].sender._id === undefined) && messages[i].senderId !== userId)
}
export const isLastMessage = (messages, i, userId) => {
    return (
        i < messages.length - 1 && messages[messages.length - 1] && messages[messages.length - 1].sender._id !== userId
    )
}
export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};
export const getMeMarginBottom = (messages, i, m, userId) => {
    //is sender is user
    if (i < messages.length - 1 && messages[i].sender._id !== messages[i + 1].sender._id) {
        return "10px"
    }
    else {
        return "2px"
    }
}
export const getMeMarginLeft = (messages, i, m, userId) => {
    //messages are continuos
}
export const isUser = (messages, i, m, userId) => {
    return (messages[i].sender._id === userId);
}
export const islastMessageFromReceiver = (messages, i, m, userId) => {
    if (i == messages.length - 1 && m.sender._id !== userId) {
        return true;
    }
    else if (i < messages.length - 1 && messages[i].sender._id !== messages[i + 1].sender._id && messages[i + 1].sender._id === userId) {
        return true;
    }
    return false;
}