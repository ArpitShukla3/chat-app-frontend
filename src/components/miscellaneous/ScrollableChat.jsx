import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { getMeMarginBottom, isUser, islastMessageFromReceiver } from '../../Config/ChatLogic';
function ScrollableChat({ messages }) {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (<div key={m._id} style={{ display: "flex" }} >
                {(islastMessageFromReceiver(messages, i, m, user._id)) && (<Tooltip
                    label={m.sender.name}
                    placement='bottom'
                    hasArrow
                >
                    <Avatar
                        mt={"7px"}
                        mr={1}
                        size={"sm"}
                        cursor={"pointer"}
                        name={m.sender.name}
                        src={m.sender.pic}
                    />
                </Tooltip>)}
                <span
                    style={{
                        backgroundColor: `${(m.sender._id !== user._id) ? "#BEE3F8" : "#B9F5D0"
                            }`,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                        marginBottom: `${getMeMarginBottom(messages, i, m, user._id)}`,
                        marginLeft: `${isUser(messages, i, m, user._id) ? "auto" : "2px"}`,
                    }}
                >{m.content}</span>
            </div>))}
        </ScrollableFeed>
    )
}
export default ScrollableChat;