import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  Media,
} from "react-bootstrap";
import "./NewHome.css";
import { Link, useHistory } from "react-router-dom";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import ReactPlayer from "react-player";
import SendTipModal from "../helper/SendTipModal";
import { savePostLikeStart } from "../../store/actions/PostLikesAction";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import SendTipPaymentModal from "../Model/PaymentModal/SendTipPaymentModal";
import { getSuccessNotificationMessage } from "../helper/NotificationMessage";
import { createNotification } from "react-redux-notify";
import CopyToClipboard from "react-copy-to-clipboard";
import ReportModeModal from "../helper/ReportModeModal";
import { saveBlockUserStart } from "../../store/actions/UserAction";
import { saveBookmarkStart } from "../../store/actions/BookmarkAction";
import url from "socket.io-client/lib/url";

const NewFeedDisplayCard = (props) => {
  const history = useHistory();
  const { post } = props;
  const [files, setFiles] = useState(
    post.postFiles.map((file) => ({ playing: false }))
  );

  const [sendTip, setSendTip] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [playing, setPlaying] = useState(false);

  const closeSendTipModal = () => {
    setSendTip(false);
  };

  const closeReportModeModal = () => {
    setReportMode(false);
  };

  const handleLike = () => {
    props.dispatch(savePostLikeStart({ post_id: post.post_id }));
  };

  const onCopy = (event) => {
    const notificationMessage = getSuccessNotificationMessage(
      t("profile_link_copied")
    );
    props.dispatch(createNotification(notificationMessage));
  };

  const handleBlockUser = (event, post) => {
    event.preventDefault();
    // setPostDisplayStatus(false);
    props.dispatch(saveBlockUserStart({ user_id: post.user_id }));
  };

  const handleBookmark = () => {
    props.dispatch(saveBookmarkStart({ post_id: post.post_id }));
  };

  const AutoplaySlider = withAutoplay(AwesomeSlider);

  useEffect(() => {
    console.log("props.post", post);
  }, [post]);

  return (
    <>
      <div className="new-feed-display-card">
        <div className="new-feed-header-sec">
          <div className="new-feed-user-info">
            <div className="live-streaming-user-img-sec">
              <Image className="new-feed-user-img" src={post.user_picture} />
            </div>
            <div className="new-feed-user-details">
              <h4>
                {post.user_displayname}
                {post.is_verified_badge === 1 ? (
                  <span>
                    <Image
                      className="sidebar-verified-icon"
                      src={
                        window.location.origin +
                        "/assets/images/new-home/verified-icon.svg"
                      }
                    />
                  </span>
                ) : null}
              </h4>
              <Link to={`/${post.user_unique_id}`}>@{post.username}</Link>
            </div>
          </div>
          <div className="new-feed-user-btn-sec">
            <div className="new-feed-post-time-sec">
              <p>{post.created}</p>
            </div>
            <Button className="sent-tip-btn" onClick={() => setSendTip(true)}>
              <Image
                className="sent-tip-icon"
                src={
                  window.location.origin +
                  "/assets/images/feed-story/sent-tip-1.svg"
                }
              />
              <span>Tips</span>
            </Button>
            <Dropdown className="feed-post-dropdown">
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="feed-post-dropdown-btn"
              >
                <Image
                  className="three-dots-icon"
                  src={
                    window.location.origin +
                    "/assets/images/feed-story/3-vertical-dots.svg"
                  }
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <CopyToClipboard text={post.share_link} onCopy={onCopy}>
                  <Media as="li">
                    <Link to="#" className="dropdown-a">
                      {" "}
                      {t("copy_link_to_post")}{" "}
                    </Link>
                  </Media>
                </CopyToClipboard>
                <Media as="li" className="divider"></Media>
                <Media as="li">
                  <Link
                    to="#"
                    // onClick={(event) => handleReportPost(event, post)}
                    onClick={() => setReportMode(true)}
                    className="dropdown-a"
                  >
                    {t("report")}
                  </Link>
                </Media>
                <Media as="li">
                  <Link
                    to="#"
                    onClick={(event) => handleBlockUser(event, post)}
                    className="dropdown-a"
                  >
                    {" "}
                    {t("add_to_blocklist_para")}
                  </Link>
                </Media>
                {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="new-feed-post-description-sec">
          <p
            dangerouslySetInnerHTML={{
              __html: post.content_formatted,
            }}
          ></p>
        </div>
        {/* <Link to={`/post/${post.post_unique_id}`}> */}
        <div className="new-feed-body-sec">
          <AutoplaySlider
            organicArrows={false}
            bullets={true}
            play={false}
            cancelOnInteraction={false}
            interval={6000}
            mobileTouch={true}
          >
            {post.postFiles &&
              post.postFiles.map((file, i) => (
                <div>
                  {file.file_type === "image" ? (
                    <div style={{ height: "100%" }}>
                      <Image
                        className="new-feed-post-img"
                        src={file.post_file}
                      />
                    </div>
                  ) : file.file_type === "video" ? (
                    <div style={{ height: "100%" }}>
                      <ReactPlayer
                        // light={postFile.preview_file}
                        url={file.post_file}
                        controls={true}
                        // width="100%"
                        height="100%"
                        playing={files[i].playing}
                        muted={false}
                        autoplay={false}
                        config={{
                          file: {
                            attributes: { controlsList: "nodownload" },
                          },
                        }}
                        className="post-video-size"
                      />
                      {/* {!files[i].playing && (
                        <div
                          className="profile-video-icon-sec"
                          onClick={() =>
                            setFiles((prevFiles) =>
                              prevFiles.map((item, idx) =>
                                i === idx ? { ...item, playing: true } : item
                              )
                            )
                          }
                        >
                          <Image
                            className="profile-video-icon"
                            src={
                              window.location.origin +
                              "/assets/images/new-home/icon/video-icon.png"
                            }
                          />
                        </div>
                      )} */}
                    </div>
                  ) : file.file_type === "audio" ? (
                    <div>
                      <Image
                        src={
                          window.location.origin +
                          "/assets/images/new-home/icon/audio-icon.png"
                        }
                        className="post-view-image"
                      />
                      {/* <div className="profile-video-icon-sec">
                            <Image
                              className="profile-audio-icon"
                              src={
                                window.location.origin + "/assets/images/new-home/icon/audio-icon.png"
                              }
                            />
                          </div> */}
                      {/* <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' /> */}
                    </div>
                  ) : null}
                </div>
              ))}
          </AutoplaySlider>
        </div>
        {/* </Link> */}
        <div className="new-feed-footer-sec">
          <div className="new-feed-footer-action-btn-sec">
            <div className="new-feed-footer-action-left-sec">
              <Button
                className="new-feed-wishlist-btn"
                onClick={(event) => handleLike()}
              >
                {post.is_user_liked ? (
                  <Image
                    className="new-feed-wishlist-icon"
                    src={
                      window.location.origin +
                      "/assets/images/feed-story/heart.svg"
                    }
                  />
                ) : (
                  <Image
                    className="new-feed-wishlist-icon"
                    src={
                      window.location.origin +
                      "/assets/images/feed-story/heart-outline.svg"
                    }
                  />
                )}
                <span>{post.like_count}</span>
              </Button>

              <Button
                className="new-feed-wishlist-btn"
                onClick={() => history.push(`/story/${post.post_unique_id}`)}
              >
                <Image
                  className="new-feed-wishlist-icon"
                  src={
                    window.location.origin +
                    "/assets/images/feed-story/comments.svg"
                  }
                />
                <span>{post.total_comments}</span>
              </Button>
            </div>
            <div className="new-feed-footer-action-right-sec">
              <Button
                className="new-feed-bookmark-btn"
                onClick={() => handleBookmark()}
              >
                {post.is_user_bookmarked === 1 ? (
                  <Image
                    className="new-feed-bookmark-icon"
                    src={
                      window.location.origin +
                      "/assets/images/feed-story/bookmark-fill.svg"
                    }
                  />
                ) : (
                  <Image
                    className="new-feed-bookmark-icon"
                    src={
                      window.location.origin +
                      "/assets/images/feed-story/bookmark-outline.svg"
                    }
                  />
                )}
              </Button>
            </div>
          </div>
          <div className="new-feeds-liked-by-users">
            {/* <h5>Liked by <span>Elvin</span> and <span>102 others</span></h5> */}
            <h5>{post.liked_by_formatted}</h5>
            {post.recent_likes && post.recent_likes.length > 0 ? (
              <div className="new-feeds-liked-users-img-sec">
                {post.recent_likes.map((likedUser, i) => (
                  <Image
                    key={i}
                    className="new-feeds-liked-users-img"
                    src={likedUser.picture}
                  />
                ))}
              </div>
            ) : null}
          </div>
          {/* <div className="new-feed-post-description-sec">
          <p
            dangerouslySetInnerHTML={{
              __html:
               post.content_formatted,
            }}
          ></p>
          </div> */}
          {post.total_comments > 0 ? (
            <div className="new-feed-view-link-sec">
              <Link to={`/story/${post.post_unique_id}`}>
                {t("view_all")}
                <span> {post.total_comments}</span> {t("comments")}
              </Link>
            </div>
          ) : (
            <div className="new-feed-view-link-sec">
              <Link to={`/story/${post.post_unique_id}`}>
                {t("add_comments")}
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* {
        sendTip ? <SendTipModal
          sendTip={sendTip}
          closeSendTipModal={closeSendTipModal}
          username={post.username}
          userPicture={post.user_picture}
          name={post.user_displayname}
          post_id={post.post_id}
          user_id={post.user_id}
        />
          : null
      } */}
      {sendTip ? (
        <SendTipPaymentModal
          paymentsModal={sendTip}
          closepaymentsModal={closeSendTipModal}
          post_id={post.post_id}
          user_id={post.user_id}
        />
      ) : null}
      {reportMode ? (
        <ReportModeModal
          reportMode={reportMode}
          closeReportModeModal={closeReportModeModal}
          post={post}
        />
      ) : null}
    </>
  );
};

const mapStateToPros = (state) => ({
  posts: state.home.homePost,
  searchUser: state.home.searchUser,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(NewFeedDisplayCard));
