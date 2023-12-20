// const Frontendserver = `https://chat-app-backend-nine-peach.vercel.app/`
const Frontendserver = `https://chat-app-backend-ecru.vercel.app/`


//user APIs
export const registrationApi = `${Frontendserver}/api/user/register`;
export const loginApi = `${Frontendserver}/api/user/login`;
export const pushChats = `${Frontendserver}/api/user/login/chats`;
export const searchUser = `${Frontendserver}/api/user`;

// chat APIs 
export const createChat = `${Frontendserver}/api/chat`;
export const fetchChats = `${Frontendserver}/api/chat/`
export const createGroupChat = `${Frontendserver}/api/chat/group`
export const removeGroupUser = `${Frontendserver}/api/chat/groupRemove`
export const updateGroupName = `${Frontendserver}/api/chat/rename`
export const addUsersInGroup = `${Frontendserver}/api/chat/groupAdd`


// message APIs
export const sendMessageAPI = `${Frontendserver}/api/message`;
export const fetchAllChats = `${Frontendserver}/api/message`;


// socket connection
export const END_POINT = `${Frontendserver}`;