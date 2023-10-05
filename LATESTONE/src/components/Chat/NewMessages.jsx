import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import "./NewChat.css";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import { chatUser, fetchMoreChatUsersStart } from "../../store/actions/ChatAction";
import { translate } from "react-multi-lang";
import { connect } from "react-redux";

const NewMessages = (props) => {
    const [isMessageToFans, setIsMessageToFans] = useState(false);
    const [isMessageToFollowings, setIsMessageToFollowings] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [followerChecked, setFollowerChecked] = useState(true);
    const [followingChecked, setFollowingChecked] = useState(true);

    props.profile.data.totalFollowers.forEach(follower => {
        props.profile.data.totalFollowings.forEach((following, idx) => {
        if (follower.user.user_id === following.user.user_id || follower.user.name === following.user.name) {
            delete props.profile.data.totalFollowings[idx]
        }
        });
    });
    const allUsers = props.profile.data.totalFollowers.concat(props.profile.data.totalFollowings);

    const handleMessagingToAll = () => {
        setIsMessageToFans(false);
        setIsMessageToFollowings(false);
        props.setSelectedUser([], true);
    }

    const handleMessagingToFans = () => {
        setIsMessageToFans(true);
        setIsMessageToFollowings(false);
        props.setSelectedUser(props.profile.data.totalFollowers.map(each => each.user), true);
    }

    const handleMessagingToFollowings = () => {
        setIsMessageToFollowings(true);
        setIsMessageToFans(false);
        props.setSelectedUser(props.profile.data.totalFollowings.map(each => each.user), true);
    }

    const fetchMoreUsers = () => {
        props.dispatch(fetchMoreChatUsersStart({
          skip: allUsers.length,//props.profile.data.allUsers.length
          take: 12,
          search_key: props.search,
        }));
    }

    const handleSelectAllUser = (user) => {
        setAllChecked((state) => !state);
        props.setSelectedUser([user], false);
    }

    const handleSelectFollower = (follower) => {
        setFollowerChecked((state) => !state);
        props.setSelectedUser([follower], false);
    }

    const handleSelectFollowing = (following) => {
        setFollowingChecked((state) => !state);
        props.setSelectedUser([following], false);
    }

    return (
        <>
            <div className="bulk-messaging-body">
                <div className="bulk-messaging-header">
                    <h3>SEND TO</h3>
                    <button className="bulk-messaging-header-btn" onClick={handleMessagingToAll}>View all</button>
                </div>
                <div className="bulk-messaging-content">
                    <button className="bulk-messaging-btn" onClick={handleMessagingToFans}>
                    {isMessageToFans && 
                        <span className="icon" style={{ backgroundColor: "#cfced1", marginLeft: "0", width: "10px", paddingRight: "16px" }}>
                        <i className="fa fa-check" ></i>
                        </span>
                    }
                    <span className="bulk-messaging-btn-title">Fans {props.profile.data.total_followers}</span>
                    </button>
                    <button className="bulk-messaging-btn" onClick={handleMessagingToFollowings}>
                    {isMessageToFollowings && 
                        <span className="icon" style={{ backgroundColor: "#cfced1", marginLeft: "0", width: "10px", paddingRight: "16px" }}>
                        <i className="fa fa-check"></i>
                        </span>
                    }
                    <span className="bulk-messaging-btn-title">Followings {props.profile.data.total_followings}</span>
                    </button>
                </div>
            </div>
            <>
                {!isMessageToFans && !isMessageToFollowings ? (
                    <div className="new-chat-list-wrapper-card">
            
                        {props.profile.loading ?
                            <div className="new-chat-list-box">
                                {[...Array(6)].map((val, i) =>
                                <div className="new-chat-list-card" key={i} >
                                    <div className="new-chat-list-user-msg-sec">
                                    <div className="new-chat-list-user-img-sec">
                                        <Skeleton circle={true} className="new-chat-list-user-img" />
                                    </div>
                                    <div className="new-chat-list-user-msg">
                                        <Skeleton height={50} />
                                    </div>
                                    </div>
                                </div>
                                )}
                            </div>
                
                        : allUsers && //props.profile.data.allUsers
                            allUsers.length > 0 ?  //props.profile.data.allUsers
                            <>
                            <div style={{
                                maxHeight: 'calc(100vh - 310px)',
                                overflowY: 'auto',
                                // paddingRight: '1em',
                                marginTop: '2em'
                            }} id="usersDiv">
                                {/* <InfiniteScroll
                                    dataLength={props.profile.data.allUsers.length}
                                    next={fetchMoreUsers}
                                    hasMore={props.chatUsers.data.users.length < props.chatUsers.data.total}
                                    loader={
                                        <div className="new-chat-list-box">
                                            {[...Array(6)].map((val, i) =>
                                            <div className="new-chat-list-card" key={i} >
                                                <div className="new-chat-list-user-msg-sec">
                                                    <div className="new-chat-list-user-img-sec">
                                                        <Skeleton circle={true} className="new-chat-list-user-img" />
                                                    </div>
                                                    <div className="new-chat-list-user-msg">
                                                        <Skeleton height={50} />
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    }
                                    scrollableTarget="usersDiv"
                                > */}
                                    <div className="new-chat-list-box">
                                        {/*All users  
                                            // ${user.to_user.user_id === props.chatUser?.user_id
                                            //     ? "active" : ""
                                            //     }*/}
                                        {allUsers.map((eachuser, i) =>  //props.profile.data.allUsers
                                        <div className="new-chat-list-card"
                                            key={i}
                                            onClick={() => props.dispatch(chatUser(eachuser.user.to_user))}>
                                            <div className="new-chat-list-user-msg-sec">
                                                <div className="new-chat-list-user-img-sec">
                                                    <Image
                                                        className="new-chat-list-user-img"
                                                        src={eachuser.user.picture}
                                                    />
                                                </div>
                                                <div className="new-chat-list-user-msg">
                                                    <h4>{eachuser.user.name}</h4>
                                                </div>
                                            </div>
                                            {/* <div className="new-chat-list-notify-sec">
                                                <div className="new-chat-list-time-sec">
                                                    <p>{user.time_formatted}</p>
                                                </div>
                                            </div> */}
                                            <div className="new-chat-list-check-sec">
                                                <input type="checkbox" className="new-chat-list-check-box" defaultChecked={allChecked} onChange={(e) => handleSelectAllUser(eachuser)}/>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                {/* </InfiniteScroll> */}
                            </div>
                            </>
                            : <>
                            {props.search &&
                                <Image
                                style={{ width: "100%" }}
                                alt="No user found"
                                src={window.location.origin + "/assets/images/new-chat/no-user-found.png"} />
                            }
                            </>
                        }
                    </div>
                    ) : (
                        <>
                            {isMessageToFans && 
                                <div className="new-chat-list-wrapper-card">
                    
                                {props.profile.loading ?
                                    <div className="new-chat-list-box">
                                    {[...Array(6)].map((val, i) =>
                                        <div className="new-chat-list-card" key={i} >
                                            <div className="new-chat-list-user-msg-sec">
                                                <div className="new-chat-list-user-img-sec">
                                                <Skeleton circle={true} className="new-chat-list-user-img" />
                                                </div>
                                                <div className="new-chat-list-user-msg">
                                                <Skeleton height={50} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                    
                                    : props.profile.data.totalFollowers &&
                                    props.profile.data.totalFollowers.length > 0 ?
                                    <>
                                        <div style={{
                                            maxHeight: 'calc(100vh - 190px)',
                                            overflowY: 'auto',
                                            // paddingRight: '1em',
                                            marginTop: '2em'
                                            }} id="usersDiv">
                                        {/* <InfiniteScroll
                                            dataLength={props.profile.data.totalFollowers.length}
                                            next={fetchMoreUsers}
                                            hasMore={props.profile.data.totalFollowers.length < props.chatUsers.data.total}
                                            loader={
                                                <div className="new-chat-list-box">
                                                    {[...Array(6)].map((val, i) =>
                                                    <div className="new-chat-list-card" key={i} >
                                                        <div className="new-chat-list-user-msg-sec">
                                                            <div className="new-chat-list-user-img-sec">
                                                            <Skeleton circle={true} className="new-chat-list-user-img" />
                                                            </div>
                                                            <div className="new-chat-list-user-msg">
                                                            <Skeleton height={50} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                            }
                                            scrollableTarget="usersDiv"
                                        > */}
                                            <div className="new-chat-list-box">
                                            {/*followers*/}
                                            {props.profile.data.totalFollowers.map((follower, i) =>
                                                <div className={`new-chat-list-card-bulk 
                                                    ${follower.user.user_id === props.chatUser?.user_id
                                                        ? "active" : ""
                                                    }
                                                    `}
                                                    key={i}
                                                    onClick={() => props.dispatch(chatUser(follower.user.to_user))}>
                                                <div className="new-chat-list-user-bulk-msg-sec">
                                                    <div className="new-chat-list-user-info-sec">
                                                        <div className="new-chat-list-user-img-sec">
                                                            <Image
                                                                className="new-chat-list-user-img"
                                                                src={follower.user.picture}
                                                            />
                                                        </div>
                                                        <div className="new-chat-list-user-msg">
                                                            <h4>{follower.user.name}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="new-chat-list-user-check">
                                                        <input type="checkbox" className="new-chat-list-user-check-box" defaultChecked={followerChecked} onChange={(e) => handleSelectFollower(follower.user)}/>
                                                    </div>
                                                </div>
                                                {/* <div className="new-chat-list-notify-sec">
                                                    <div className="new-chat-list-time-sec">
                                                    <p>{follower.user.time_formatted}</p>
                                                    </div>
                                                </div> */}
                                                </div>
                                            )}
                                            </div>
                                        {/* </InfiniteScroll> */}
                                        </div>
                                    </>
                                    : <>
                                        {props.search &&
                                        <Image
                                            style={{ width: "100%" }}
                                            alt="No user found"
                                            src={window.location.origin + "/assets/images/new-chat/no-user-found.png"} />
                                        }
                                    </>
                                }
                                </div>
                            }
                            {isMessageToFollowings && 
                                <div className="new-chat-list-wrapper-card">
                    
                                    {props.profile.loading ?
                                        <div className="new-chat-list-box">
                                        {[...Array(6)].map((val, i) =>
                                            <div className="new-chat-list-card" key={i} >
                                            <div className="new-chat-list-user-msg-sec">
                                                <div className="new-chat-list-user-img-sec">
                                                <Skeleton circle={true} className="new-chat-list-user-img" />
                                                </div>
                                                <div className="new-chat-list-user-msg">
                                                <Skeleton height={50} />
                                                </div>
                                            </div>
                                            </div>
                                        )}
                                        </div>
                        
                                        : props.profile.data.totalFollowings &&
                                        props.profile.data.totalFollowings.length > 0 ?
                                        <>
                                            <div style={{
                                            maxHeight: 'calc(100vh - 190px)',
                                            overflowY: 'auto',
                                            // paddingRight: '1em',
                                            marginTop: '2em'
                                            }} id="usersDiv">
                                            {/* <InfiniteScroll
                                                dataLength={props.profile.data.totalFollowings.length}
                                                next={fetchMoreUsers}
                                                hasMore={props.profile.data.totalFollowings.length < props.chatUsers.data.total}
                                                loader={<div className="new-chat-list-box">
                                                {[...Array(6)].map((val, i) =>
                                                    <div className="new-chat-list-card" key={i} >
                                                    <div className="new-chat-list-user-msg-sec">
                                                        <div className="new-chat-list-user-img-sec">
                                                        <Skeleton circle={true} className="new-chat-list-user-img" />
                                                        </div>
                                                        <div className="new-chat-list-user-msg">
                                                        <Skeleton height={50} />
                                                        </div>
                                                    </div>
                                                    </div>
                                                )}
                                                </div>
                                                }
                                                scrollableTarget="usersDiv"
                                            > */}
                                                <div className="new-chat-list-box">
                                                {/*followings*/}
                                                {props.profile.data.totalFollowings.map((following, i) =>
                                                    <div className={`new-chat-list-card 
                                                    ${following.user.user_id === props.chatUser?.user_id
                                                        ? "active" : ""
                                                    }
                                                    `}
                                                    key={i}
                                                    onClick={() => props.dispatch(chatUser(following.user.to_user))}>
                                                    <div className="new-chat-list-user-msg-sec">
                                                        <div className="new-chat-list-user-img-sec">
                                                        <Image
                                                            className="new-chat-list-user-img"
                                                            src={following.user.picture}
                                                        />
                                                        </div>
                                                        <div className="new-chat-list-user-msg">
                                                        <h4>{following.user.name}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="new-chat-list-user-check">
                                                        <input type="checkbox" className="new-chat-list-user-check-box" defaultChecked={followingChecked} onChange={(e) => handleSelectFollowing(following.user)}/>
                                                    </div>
                                                    </div>
                                                )}
                                                </div>
                                            {/* </InfiniteScroll> */}
                                            </div>
                                        </>
                                        : <>
                                            {props.search &&
                                            <Image
                                                style={{ width: "100%" }}
                                                alt="No user found"
                                                src={window.location.origin + "/assets/images/new-chat/no-user-found.png"} />
                                            }
                                        </>
                                    }
                                </div>
                            }
                        </>
                    )
                }
            </>
        </>
    );
};

const mapStateToPros = (state) => ({
    chatUsers: state.chat.chatUsers,
    chatUser: state.chat.chatUser,
    chatMessages: state.chat.chatMessages,
    profile: state.users.profile,
  });
  
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
  
  export default connect(
    mapStateToPros,
    mapDispatchToProps
  )(translate(NewMessages));