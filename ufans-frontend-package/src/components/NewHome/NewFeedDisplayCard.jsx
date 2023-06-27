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
  Modal
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
import SendCampaignPaymentModal from "../Model/PaymentModal/SendCampaignPaymentModal";
import { getSuccessNotificationMessage } from "../helper/NotificationMessage";
import { createNotification } from "react-redux-notify";
import CopyToClipboard from "react-copy-to-clipboard";
import ReportModeModal from "../helper/ReportModeModal";
import { saveBlockUserStart } from "../../store/actions/UserAction";
import { saveBookmarkStart } from "../../store/actions/BookmarkAction";

const NewFeedDisplayCard = (props) => {
  const history = useHistory();
  const { post } = props;

  const [sendTip, setSendTip] = useState(false);
  const [sendCampaign, setSendCampaign] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [campaignAmt, setCampaignAmt]  =useState();
  const [campaignOptions, setCampaignOptions] = useState([]);

  const setCampaignFxn =(val,options)=>{
    console.log('=======123',options)
    setCampaignAmt(val)
    if(options != ''){
     // options.split(',')
      console.log('=======',options)
      setCampaignOptions(options)
    } 
    setSendCampaign(true);
  }


  const closeSendTipModal = () => {
    setSendTip(false);
  };

  const closeSendCampaignModal = () => {
    setSendCampaign(false);
  };

  const closeReportModeModal = () => {
    setReportMode(false);
  };

  const handleLike = () => {
    console.log('-------------', post)
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

  const handleImageClick = (image) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  // const campaignButton = (opt) => {
  //   console.log('tttttt', opt.split(','));
  //   return (
  //       <>
  //       {['10','20','30'].map((item, i) => {
  //         return (<Button className="new-feed-campaign-btn">
  //                  <span>10</span>
  //                </Button>
  //         )
  //       })
  //       }
  //     </>

  //   )
  // }

  const feedMedia = (file) => {
    return (
      <>
        {file.file_type === "image" ? (
          <div style={{ height: "100%" }}>
            <img
              className="new-feed-post-img"
              src={file.post_file}
              onClick={() => handleImageClick(file.post_file)}
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
              playing={false}
              muted={false}
              autoPlay={false}
              config={{
                file: {
                  attributes: { controlsList: "nodownload" },
                },
              }}
              className="post-video-size"
            />
          </div>
        ) : null}
      </>
    );
  };

  return (
    <>
      <div className="new-feed-display-card">
        <div className="new-feed-header-sec">
          <div className="new-feed-user-info">
            <div className="live-streaming-user-img-sec" >
              <Link to={`/${post.user_unique_id}`}>
                <Image className="new-feed-user-img" src={post.user_picture} />
              </Link>
            </div>
            <div className="new-feed-user-details">
              <h4>
                <Link to={`/${post.user_unique_id}`}>{post.user_displayname}</Link>
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
            {/* <Button className="sent-tip-btn" onClick={() => setSendTip(true)}>
              <Image
                className="sent-tip-icon"
                src={
                  window.location.origin +
                  "/assets/images/feed-story/sent-tip-1.svg"
                }
              />
              <span>Tips</span>
            </Button> */}
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
        <div className="new-feed-body-sec">
          {post.postFiles &&
            post.postFiles.length < 2 &&
            feedMedia(post.postFiles[0])}
          {post.postFiles && post.postFiles.length >= 2 && (
            <AutoplaySlider
              organicArrows={false}
              bullets={true}
              play={false}
              cancelOnInteraction={false}
              interval={6000}
              mobileTouch={true}
            >
              {post.postFiles.map((file, i) => (
                <div key={i}>{feedMedia(file)}</div>
              ))}
            </AutoplaySlider>
          )}
        </div>
        {post.is_campaign && post.is_campaign == '1' ?
          <div className="new-feed-campaign-footer-sec">
            <div className="new-feed-footer-action-btn-sec campaign-option">
              <div className="new-feed-footer-action-left-sec campaign-option-target">
                <span> <Image
                  className="three-dots-icon"
                  src={
                    window.location.origin +
                    "/assets/images/icons/target_dollar.svg"
                  }
                /> $ {post.total_compaign_amt ? post.total_compaign_amt:0}</span>
              </div>
              <div className="new-feed-footer-action-right-sec campaign-option-target">
                <span>$ {post.campaign_goal_amt?post.campaign_goal_amt:0}</span>
              </div>
            </div>
            <div className="new-feed-footer-campaign-option-sec" >
            {post.campaign_options.split(',').map((item, i) => {
                return <Button className="new-feed-campaign-btn" key={i} onClick={() => setCampaignFxn(item,post.campaign_options)}>
                   <span>$ {item}</span>
                 </Button>
              })
            }
            </div>

          </div>
          :
          null
        }


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
                <span>{post.post_fake_likes > 0 ? post.post_fake_likes : post.like_count}</span>
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
              <Button className="new-feed-wishlist-btn send_tip_custom_button" onClick={() => setSendTip(true)}>
                <Image
                  className="new-feed-wishlist-icon"
                  src={
                    window.location.origin +
                    "/assets/images/feed-story/circuler_dollar_icon.svg"
                  }
                />
                <span>SEND TIP</span>
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
      {
        sendTip ? (
          <SendTipPaymentModal
            paymentsModal={sendTip}
            closepaymentsModal={closeSendTipModal}
            post_id={post.post_id}
            user_id={post.user_id}
          />
        ) : null
      }

      {
        sendCampaign ? (
          <SendCampaignPaymentModal
            setCampaignAmt = {setCampaignAmt}
            paymentsModal={sendCampaign}
            campaignAmount = {campaignAmt}
            campaignOptions = {campaignOptions}
            closepaymentsModal={closeSendCampaignModal}
            post_id={post.post_id}
            user_id={post.user_id}
          />
        ) : null
      }
      {
        reportMode ? (
          <ReportModeModal
            reportMode={reportMode}
            closeReportModeModal={closeReportModeModal}
            post={post}
          />
        ) : null
      }
      <Modal
        className="modal-dialog-center"
        centered
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="new-feed-image-modal-body">
          <div>
            <Image className="new-feed-post-img" src={selectedImage} />
          </div>
        </Modal.Body>
      </Modal>
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
