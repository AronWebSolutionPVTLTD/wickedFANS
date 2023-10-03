import React, { useEffect, useState } from "react";
import { Modal, Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import "./NewChat.css";
import { Link, useHistory } from "react-router-dom";
import NewChatList from "./NewChatList";
import NewChatRoom from "./NewChatRoom";
import NewChatUserInfo from "./NewChatUserInfo";
import { connect } from "react-redux";
import { changeChatAudio, chatUser } from "../../store/actions/ChatAction";
import useWindowDimensions from "../helper/WindowHelper";

const NewChatIndex = (props) => {
  const history = useHistory();
  const [showContent, setShowContent] = useState(true);
  const [skipRender, setSkipRender] = useState(true);
  const [selectedUser, setSelectedUser] = useState([]);
  const { height, width } = useWindowDimensions();
  const [isNewMessage, setIsNewMessage] = useState(false);

  useEffect(() => {
    if (props.chatUser) {
      props.dispatch(changeChatAudio({ src: "" }));
      setTimeout(() => {
        setSelectedUser([props.chatUser]);
        if (!skipRender && width < 768) {
          history.push("/chat-room");
        }
      }, 100);
    }
    setSkipRender(false);
  }, [props.chatUser]);

  const handleSelectUser = (sUsers, isGroupSelect) => {
    if (isGroupSelect) {
      setSelectedUser([...sUsers]);
    } else {
      const selectedIndex = selectedUser.findIndex(each => each.user_id == sUsers[0]?.user_id)
      if (selectedIndex !== -1) {
        const newUsers = [...selectedUser];
        newUsers.splice(selectedIndex, 1);
        setSelectedUser([...newUsers]);
      } else {
        setSelectedUser([...selectedUser, ...sUsers]);
      }
    }
  }
  // useEffect(() => {
  //   if (selectedUser) {
  //     props.dispatch(chatUser(selectedUser));
  //   }
  // }, [selectedUser]);

  return (
    <>
      <div className="new-chat-sec">
        {showContent
          ? <div className="new-chat-box">
            <NewChatList
              setShowContent={setShowContent}
              setSelectedUser={handleSelectUser}
              isNewMessage={isNewMessage}
              setIsNewMessage={setIsNewMessage}
            />
            {isNewMessage ?
              <>
                <div className="new-chat-room-sec mobile-hide">
                  <NewChatRoom selectedUser={selectedUser || []} setShowContent={setShowContent} isNewMessage={isNewMessage} setIsNewMessage={setIsNewMessage} />
                </div>
                {/* <div className="new-chat-user-info">
                  <NewChatUserInfo selectedUser={selectedUser} />
                </div> */}
              </>
              : 
              <>
                {selectedUser.length > 0 ? 
                  <>
                    <div className="new-chat-room-sec mobile-hide">
                      <NewChatRoom selectedUser={selectedUser[0]} setShowContent={setShowContent} />
                    </div>
                    <div className="new-chat-user-info">
                      <NewChatUserInfo selectedUser={selectedUser[0]} />
                    </div>
                  </> : <div className="new-chat-room-sec start-conversation-container mobile-hide">
                    <Image
                      className="start-conversation"
                      src={window.location.origin + "/assets/images/new-chat/start-new-conversation.png"}
                    />
                  </div>
                }
              </>
            }
          </div>
          : <div className="chat-something-went-wrong">
            <Image
              src={window.location.origin + "/assets/images/new-chat/something-went-wrong.png"}
            />
            <button
              className="btn gradient-btn gradientcolor btn btn-primary retry-btn"
              onClick={() => {
                setSelectedUser([]);
                setShowContent(true)
              }}
            >Retry</button>
            <Link to="/home">Home</Link>
          </div>
        }
      </div>
    </>
  );
};

const mapStateToPros = (state) => ({
  chatUser: state.chat.chatUser,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(NewChatIndex);
