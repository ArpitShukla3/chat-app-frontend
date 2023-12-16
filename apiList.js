const Frontendserver = `http://localhost:5000`

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