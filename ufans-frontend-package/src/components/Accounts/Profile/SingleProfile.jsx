import React, { useState, useEffect } from "react";
import {
  Dropdown,
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  Tab,
  Nav,
  Media,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./NewProfile.css";
import { fetchPostsStart } from "../../../store/actions/PostAction";
import {
  fetchSingleUserProfileStart,
  fetchSingleUserPostsStart,
} from "../../../store/actions/OtherUserAction";
import { connect } from "react-redux";
import {
  getSuccessNotificationMessage,
  getErrorNotificationMessage,
} from "../../helper/NotificationMessage";
import { createNotification } from "react-redux-notify/lib/modules/Notifications";
import { translate, t } from "react-multi-lang";
import configuration from "react-global-configuration";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  RedditShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
  RedditIcon,
  TelegramIcon,
} from "react-share";
import "./NewProfile.css";
import ProfileSinglePost from "../../helper/ProfileSinglePost";
import { saveChatUserStart } from "../../../store/actions/ChatAction";
import SendTipModal from "../../helper/SendTipModal";
import PaymentModal from "../../helper/PaymentModal";
import PrivateCallModal from "../../helper/PrivateCallModal";
import PrivateAudioCallModal from "../../helper/PrivateAudioCallModal";
import { subscriptionPaymentStripeStart } from "../../../store/actions/SubscriptionAction";
import { followUserStart, unFollowUserStart } from "../../../store/actions/FollowAction";
import InfiniteScroll from "react-infinite-scroll-component";
import NoDataFound from "../../NoDataFound/NoDataFound";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileLoader from "../../Loader/ProfileLoader";
import { saveBlockUserStart } from "../../../store/actions/UserAction";
import ModelProfileStoreSec from "../../Model/ModelProfileStoreSec";
import SendTipPaymentModal from "../../Model/PaymentModal/SendTipPaymentModal";
import SubscriptionPaymentModal from "../../Model/PaymentModal/SubscriptionPaymentModal";
import HomeLoader from "../../Loader/HomeLoader";
import NewFeedDisplayCard from "../../NewHome/NewFeedDisplayCard";
import NewFeedSuggestionCard from "../../NewHome/NewFeedSuggestionCard";

const SingleProfile = (props) => {
  const history = useHistory();

  const [skipRender, setSkipRender] = useState(true);
  const [badgeStatus, setBadgeStatus] = useState(0);
  const [activeSec, setActiveSec] = useState("all");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [requestVideoCall, setRequestVideoCall] = useState(false);
  const [requestAudioCall, setRequestAudioCall] = useState(false);
  const [sendTip, setSendTip] = useState(false);
  const [subscrptionPayment, setPaymentModal] = useState(false);
  const [showUnfollow, setShowUnfollow] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => { setIsReadMore(!isReadMore) };
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(12);
  const [allCount, setAllCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);

  const [subscriptionData, setSubscriptionData] = useState({
    is_free: 0,
    plan_type: "months",
    amount: 0,
    amount_formatted: 0,
  });

  const toggleVisibility = () => { };

  useEffect(() => {
    props.dispatch(
      fetchSingleUserProfileStart({
        user_unique_id: props.match.params.username,
      })
    );
    props.dispatch(
      fetchSingleUserPostsStart({
        user_unique_id: props.match.params.username,
        type: "all",
        skip: 0,
        take: take,
      })
    );
    setSkip(take); 
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {

    if (activeSec === 'all') {
      const tempImageCount = props.userPosts.data.posts.filter((post) => post.post_files.find((eachFile) => eachFile.file_type === "image")).length;
      const tempVideoCount = props.userPosts.data.posts.filter((post) => post.post_files.find((eachFile) => eachFile.file_type === "video")).length;

      setImageCount(tempImageCount)
      setVideoCount(tempVideoCount)
      setAllCount(props.userPosts.data.total)
    }
    
  }, [activeSec, props.userPosts])

  useEffect(() => {
    if (
      !skipRender &&
      !props.saveChatUser.loading &&
      Object.keys(props.saveChatUser.data).length > 0
    ) {
      history.push("/inbox");
    }
    setSkipRender(false);
  }, [props.saveChatUser]);

  const setActiveSection = (event, key) => {
    setActiveSec(key);
    if (key !== "product") {
      props.dispatch(
        fetchSingleUserPostsStart({
          type: key,
          user_unique_id: props.match.params.username,
          skip: 0,
          take: take,
        })
      );
      setSkip(take);
    }
  };

  const fetchMorePost = () => {
    props.dispatch(
      fetchSingleUserPostsStart({
        type: activeSec,
        user_unique_id: props.match.params.username,
        append: true,
        skip: skip,
        take: take,
      })
    );
    setSkip(skip + take);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onCopy = (event) => {
    const notificationMessage = getSuccessNotificationMessage(
      t("profile_link_copied")
    );
    props.dispatch(createNotification(notificationMessage));
  };

  const handleUnfollow = (event, user_id) => {
    event.preventDefault();
    props.dispatch(
      unFollowUserStart({
        user_id: user_id,
      })
    );
  };

  const handleChatUser = (event, user_id) => {
    event.preventDefault();
    if (!localStorage.getItem("userId")) {
      const notificationMessage = getErrorNotificationMessage(
        t("login_to_continue")
      );
      props.dispatch(createNotification(notificationMessage));
    } else {
      props.dispatch(
        saveChatUserStart({
          from_user_id: localStorage.getItem("userId"),
          to_user_id: user_id,
        })
      );
    }
  };

  const subscriptionPayment = (
    event,
    plan_type,
    amount,
    amount_formatted,
    is_free = 0
  ) => {
    event.preventDefault();
    if (localStorage.getItem("userId")) {
      setSubscriptionData({
        ...subscriptionData,
        is_free: is_free,
        plan_type: plan_type,
        amount: amount,
        amount_formatted: amount_formatted,
      });
      setPaymentModal(true);
    } else {
      const notificationMessage = getErrorNotificationMessage(
        t("login_to_continue")
      );
      props.dispatch(createNotification(notificationMessage));
    }
  };

  const handleBlockUser = (event, user_id) => {
    event.preventDefault();
    props.dispatch(
      saveBlockUserStart({
        user_id: user_id,
        is_other_profile: 1,
      })
    );
  };

  const handleUnfollowModalClose = () => setShowUnfollow(false);
  const handleUnfollowModalShow = () => setShowUnfollow(true);

  const { userDetails } = props;

  const closePrivateCallModal = () => {
    setRequestVideoCall(false);
    setRequestAudioCall(false);
  };

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeSendTipModal = () => {
    setSendTip(false);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  return (
    <>
      <div className="new-home-sec">
        {userDetails.loading ? (
          <HomeLoader />
        ) : (
          <div className="new-home-box">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="new-home-page-box row">
                    <div className="profile-container col-md-12 col-lg-8 col-xl-6 col-12">
                      <div className="profile-intro">
                        <div className="user-cover-img-sec">
                          <Image
                            className="profile-user-cover-img"
                            src={userDetails.data.user.cover}
                            alt={userDetails.data.user.name}
                          />
                          <div className="profile-user-cover-header">
                            <div className="profile-user-cover-header-left">
                              <Button variant="link" onClick={() => history.goBack()}>
                                <div className="back-icon" style={{ color: '#fff' }}>
                                  <i className="fas fa-chevron-left"></i>
                                </div>
                              </Button>
                              <div className="profile-user-cover-header-title">
                                <h3>{userDetails.data.user.name}</h3>
                                <div className="profile-user-cover-header-title-info">
                                  <span>
                                    {userDetails.data.user.total_posts} {t("posts")} |
                                  </span>
                                  <span>
                                    {userDetails.data.user.total_followers} {t("fans")} |
                                  </span>
                                  <span>
                                    {userDetails.data.user.total_followings} {t("following")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Dropdown className="feed-post-dropdown">
                              <Dropdown.Toggle
                                variant="success"
                                id="dropdown-basic"
                                className="feed-post-dropdown-btn"
                              >
                                {/* <Image
                                  className="three-dots-icon"
                                  src={
                                    window.location.origin +
                                    "/assets/images/icons/vertical-dots-white.svg"
                                  }
                                /> */}
                                <i class="fas fa-ellipsis-v fa-2x" aria-hidden="true"></i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <CopyToClipboard text={userDetails.data.user.share_link} onCopy={onCopy}>
                                  <Media as="li">
                                    <Link to="#" className="dropdown-a">
                                      <i className="fas fa-copy" style={{ color: '#E34498' }}></i>
                                      {" "}
                                      {t("copy_link_to_profile")}
                                    </Link>
                                  </Media>
                                </CopyToClipboard>
                                <Media as="li" className="divider"></Media>
                                <Media as="li">
                                  <Link to="#" className="dropdown-a" onClick={handleShareClick}>
                                    <span>
                                      <Image
                                        className="sidebar-links-icon"
                                        src={
                                          window.location.origin +
                                          "/assets/images/new-home/icon/share-theme.svg"
                                        }
                                      />
                                    </span>
                                    &nbsp;{t("share")}
                                  </Link>
                                </Media>
                                {/* <Media as="li">
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
                                </Media> */}
                                {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="user-avatar-container">
                          <Image
                            className="user-avatar"
                            src={userDetails.data.user.picture}
                            alt={userDetails.data.user.name}
                          />
                          {userDetails.data.user.is_user_live === 1 && (
                            <Link
                              to={`/join/${userDetails.data.user.ongoing_live_video.live_video_unique_id}`}
                              className="sidebar-live-btn"
                            >
                              Live
                            </Link>
                          )}
                          {userDetails.data.user.is_online_status === 1 &&
                            userDetails.data.user.is_user_online === 1 && (
                              <div className="dot-circle-online"></div>
                            )}
                        </div>
                        <div className="profile-description">
                          <h3>
                            {userDetails.data.user.name}
                            <span>
                              {userDetails.data.user.is_verified_badge == 1 && (
                                <Image
                                  className="sidebar-verified-icon"
                                  src={
                                    window.location.origin +
                                    "/assets/images/new-home/verified-icon.png"
                                  }
                                />
                              )}
                            </span>
                          </h3>
                          <Link to="#" className="sidebar-user-name">
                            @{userDetails.data.user.username}
                          </Link>
                          <div className="profile-description-content" style={{ marginTop: 10 }}>
                            {userDetails.data.user.about_formatted ?
                              <p>
                                {/* {userDetails.data.user.about_formatted}
                              <a href="#">Read More</a> */}
                                {isReadMore ? userDetails.data.user.about_formatted.slice(0, 300) : userDetails.data.user.about_formatted}
                                {userDetails.data.user.about_formatted.length > 150 &&
                                  <span onClick={toggleReadMore} style={{ color: '#E54296', fontSize: '14px', cursor: 'pointer' }}>
                                    {isReadMore ? '...read more' : ' ...show less'}
                                  </span>
                                }
                              </p>
                              :
                              null
                            }
                          </div>
                        </div>
                      </div>
                      <div className="profile-subscription">
                        {userDetails.data.is_block_user == 0 ? (
                          <div className="user-subscription-plans-details">
                            <h3>Subscription Plans</h3>
                            {userDetails.data.payment_info.is_user_needs_pay == 1 &&
                              userDetails.data.payment_info.unsubscribe_btn_status ==
                              0 ? (
                              userDetails.data.payment_info.is_free_account == 0 ? (
                                <div className="user-subscription-btn-sec">
                                  <div
                                    className="subscription-outline-btn"
                                    onClick={(event) =>
                                      subscriptionPayment(
                                        event,
                                        "months",
                                        userDetails.data.payment_info.subscription_info
                                          .monthly_amount,
                                        userDetails.data.payment_info.subscription_info
                                          .monthly_amount_formatted
                                      )
                                    }
                                  >
                                    {
                                      userDetails.data.payment_info.subscription_info
                                        .monthly_amount_formatted
                                    }{" "}
                                    /Month
                                  </div>
                                  <div
                                    className="subscription-btn1"
                                    onClick={(event) =>
                                      subscriptionPayment(
                                        event,
                                        "years",
                                        userDetails.data.payment_info.subscription_info
                                          .yearly_amount,
                                        userDetails.data.payment_info.subscription_info
                                          .yearly_amount_formatted
                                      )
                                    }
                                  >
                                    {
                                      userDetails.data.payment_info.subscription_info
                                        .yearly_amount_formatted
                                    }{" "}
                                    /Year
                                  </div>
                                </div>
                              ) : (
                                <div className="user-subscription-btn-sec">
                                  <div
                                    className="subscription-btn1"
                                    onClick={(event) => {
                                      if (localStorage.getItem("userId")) {
                                        props.dispatch(
                                          followUserStart({
                                            user_id: userDetails.data.user.user_id
                                          })
                                        );
                                      } else {
                                        const notificationMessage =
                                          getErrorNotificationMessage(
                                            t("login_to_continue")
                                          );
                                        props.dispatch(
                                          createNotification(notificationMessage)
                                        );
                                      }
                                    }}
                                  >
                                    Subscribe For Free
                                  </div>
                                </div>
                              )
                            ) : null}

                            {userDetails.data.payment_info.unsubscribe_btn_status ==
                              1 && (
                                <>
                                  <div className="user-subscription-btn-sec">
                                    <div
                                      className="subscription-btn1"
                                      onClick={() => handleUnfollowModalShow()}
                                    >
                                      {t("unfollow")}
                                    </div>
                                  </div>
                                  <Modal
                                    show={showUnfollow}
                                    onHide={handleUnfollowModalClose}
                                    backdrop="static"
                                    keyboard={false}
                                    centered
                                    className={`${localStorage.getItem("theme") !== "" &&
                                      localStorage.getItem("theme") !== null &&
                                      localStorage.getItem("theme") !== undefined &&
                                      localStorage.getItem("theme") === "dark"
                                      ? "dark-theme-modal"
                                      : ""
                                      }
                                    `}
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>{t("unsubscribe")}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {t("cancel_subscription_conformation")}
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={handleUnfollowModalClose}
                                      >
                                        {t("close")}
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={(event) =>
                                          handleUnfollow(
                                            event,
                                            userDetails.data.user.user_id
                                          )
                                        }
                                      >
                                        {t("yes")}
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                </>
                              )}
                          </div>
                        ) : (
                          <div className="user-subscription-plans-details">
                            <div className="user-subscription-btn-sec">
                              <div
                                className="subscription-btn1"
                                onClick={(event) =>
                                  handleBlockUser(event, userDetails.data.user.user_id)
                                }
                              >
                                {t("unblock_the_user")}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="profile-buttons">
                        {userDetails.data.is_block_user === 0 ? (
                          <div className="sidebar-links">
                            <ul className="list-unstyled">
                              <Media as="li">
                                <Link
                                  to="#"
                                  onClick={() => {
                                    if (localStorage.getItem("userId")) {
                                      setRequestVideoCall(true);
                                    } else {
                                      const notificationMessage =
                                        getErrorNotificationMessage(
                                          t("login_to_continue")
                                        );
                                      props.dispatch(
                                        createNotification(notificationMessage)
                                      );
                                    }
                                  }}
                                >
                                  <span>
                                    <Image
                                      className="sidebar-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/video-call.svg"
                                      }
                                    />
                                  </span>
                                  Video Call
                                </Link>
                              </Media>
                              <Media as="li">
                                <Link
                                  to="#"
                                  onClick={() => {
                                    if (localStorage.getItem("userId")) {
                                      setRequestAudioCall(true);
                                    } else {
                                      const notificationMessage =
                                        getErrorNotificationMessage(
                                          t("login_to_continue")
                                        );
                                      props.dispatch(
                                        createNotification(notificationMessage)
                                      );
                                    }
                                  }}
                                >
                                  <span>
                                    <Image
                                      className="sidebar-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/audio-call.svg"
                                      }
                                    />
                                  </span>
                                  Voice Call
                                </Link>
                              </Media>
                              <Media as="li">
                                <Link
                                  to="#"
                                  onClick={() => {
                                    if (localStorage.getItem("userId")) {
                                      setSendTip(true);
                                    } else {
                                      const notificationMessage =
                                        getErrorNotificationMessage(
                                          t("login_to_continue")
                                        );
                                      props.dispatch(
                                        createNotification(notificationMessage)
                                      );
                                    }
                                  }}
                                >
                                  <span>
                                    <Image
                                      className="sidebar-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/sent-tip.svg"
                                      }
                                    />
                                  </span>
                                  Tip Me
                                </Link>
                              </Media>
                              <Media as="li">
                                <Link
                                  to="#"
                                  onClick={(event) =>
                                    handleChatUser(event, userDetails.data.user.user_id)
                                  }
                                >
                                  <span>
                                    <Image
                                      className="sidebar-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/message.svg"
                                      }
                                    />
                                  </span>
                                  Message
                                </Link>
                              </Media>
                            </ul>
                          </div>
                        ) : null}
                        {userDetails.data.youtube_link ||
                          userDetails.data.pinterest_link ||
                          userDetails.data.linkedin_link ||
                          userDetails.data.snapchat_link ||
                          userDetails.data.twitter_link ||
                          userDetails.data.instagram_link ||
                          userDetails.data.amazon_wishlist ||
                          userDetails.data.facebook_link ||
                          userDetails.data.twitch_link ||
                          userDetails.data.website ? (
                          <div className="sidebar-social-links">
                            <ul className="list-unstyled">
                              {userDetails.data.youtube_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.youtube_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/you-tube.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.pinterest_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.pinterest_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/pintrest.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.linkedin_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.linkedin_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/linked-in.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.snapchat_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.snapchat_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/snap-chat.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.twitter_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.twitter_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/twitter.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.instagram_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.instagram_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/instagram.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.amazon_wishlist && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.amazon_wishlist}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/amazon.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.facebook_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.facebook_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/facebook.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.twitch_link && (
                                <Media as="li">
                                  <a
                                    href={userDetails.data.twitch_link}
                                    target="_blank"
                                  >
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/twitch.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                              {userDetails.data.website && (
                                <Media as="li">
                                  <a href={userDetails.data.website} target="_blank">
                                    <Image
                                      className="sidebar-social-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/website.png"
                                      }
                                    />
                                  </a>
                                </Media>
                              )}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                      {userDetails.data.is_block_user == 0 && (
                        <div className="profile-tab-sec" style={{ padding: 0 }}>
                          <Tab.Container id="left-tabs-example" defaultActiveKey="all">
                            <Row>
                              <Col lg={12}>
                                <Nav
                                  variant="pills"
                                  className={
                                    userDetails.data.user.is_content_creator == 2
                                      ? "grid-five-col"
                                      : "grid-four-col"
                                  }
                                >
                                  <Nav.Item>
                                    <Nav.Link
                                      eventKey="all"
                                      onClick={(event) =>
                                        setActiveSection(event, "all")
                                      }
                                    >
                                      <span>
                                        <Image
                                          className="profile-post-tab-icon"
                                          src={
                                            window.location.origin +
                                            "/assets/images/new-home/icon/all-post-1.svg"
                                          }
                                        />
                                      </span>
                                      <span className="profile-tab-counter">
                                        <span>{allCount}</span> <span className="profile-tab-counter-label">POSTS</span>
                                      </span>
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item>
                                    <Nav.Link
                                      eventKey="image"
                                      onClick={(event) =>
                                        setActiveSection(event, "image")
                                      }
                                    >
                                      <span>
                                        <Image
                                          className="profile-post-tab-icon"
                                          src={
                                            window.location.origin +
                                            "/assets/images/new-home/icon/image-post-1.svg"
                                          }
                                        />
                                      </span>
                                      <span className="profile-tab-counter">
                                        <span>{imageCount}</span> <span className="profile-tab-counter-label">IMAGES</span>
                                      </span>
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item>
                                    <Nav.Link
                                      eventKey="video"
                                      onClick={(event) =>
                                        setActiveSection(event, "video")
                                      }
                                    >
                                      <span>
                                        <Image
                                          className="profile-post-tab-icon"
                                          src={
                                            window.location.origin +
                                            "/assets/images/new-home/icon/video-post-1.svg"
                                          }
                                        />
                                      </span>
                                      <span className="profile-tab-counter">
                                        <span>{videoCount}</span> <span className="profile-tab-counter-label">VIDEOS</span>
                                      </span>
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                              </Col>

                              {userDetails.data.payment_info.is_user_needs_pay == 1 && 
                              userDetails.data.payment_info.unsubscribe_btn_status === 0 && 
                              userDetails.data.payment_info.is_free_account === 0 ? (
                                <div className="user-subscription-btn-sec" style={{display: "flex", justifyContent: "center", width: "100%", margin: "0 20px"}}>
                                  <div
                                    className="subscription-btn1"
                                    onClick={(event) =>
                                      subscriptionPayment(
                                        event,
                                        "months",
                                        userDetails.data.payment_info.subscription_info
                                          .monthly_amount,
                                        userDetails.data.payment_info.subscription_info
                                          .monthly_amount_formatted
                                      )
                                    }
                                  >
                                    SUBSCRIBE TO SEE USER'S POSTS
                                  </div>
                                </div>
                              ) : (
                                <Col lg={12}>
                                  {activeSec === "all" ? (
                                    <>
                                      {props.userPosts.data.posts.length > 0 ? (
                                        <InfiniteScroll
                                          dataLength={props.userPosts.data.posts}
                                          next={fetchMorePost}
                                          hasMore={
                                            props.userPosts.data.posts.length <
                                            props.userPosts.data.total
                                          }
                                          loader={
                                            <div className="profile-all-post-box">
                                              {[...Array(4)].map(() => (
                                                <Skeleton className="profile-post-card-loader" />
                                              ))}
                                            </div>
                                          }
                                          style={{ height: "auto", overflow: "hidden" }}
                                          className="row"
                                        >
                                          <div className="new-feed-sec" style={{ paddingLeft: 15, paddingRight: 15 }}>
                                            {props.userPosts.data.posts.map((post, index) => (
                                              <NewFeedDisplayCard
                                                post={post}
                                                key={index}
                                                index={index}
                                              />
                                            ))}
                                          </div>
                                        </InfiniteScroll>
                                      ) : (
                                        <NoDataFound />
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {props.userPosts.loading ? (
                                        <div className="profile-all-post-box">
                                          {[...Array(8)].map(() => (
                                            <Skeleton className="profile-post-card-loader" />
                                          ))}
                                        </div>
                                      ) : (
                                        <>
                                          {props.userPosts.data.posts.length > 0 ? (
                                            <InfiniteScroll
                                              dataLength={props.userPosts.data.posts.length}
                                              next={fetchMorePost}
                                              hasMore={
                                                props.userPosts.data.posts.length <
                                                props.userPosts.data.total
                                              }
                                              loader={
                                                <div className="profile-all-post-box">
                                                  {[...Array(4)].map(() => (
                                                    <Skeleton className="profile-post-card-loader" />
                                                  ))}
                                                </div>
                                              }
                                              style={{ height: "auto", overflow: "hidden" }}
                                            >
                                              <div className="profile-all-post-box">
                                                {props.userPosts.data.posts.map((post) => (
                                                  <>
                                                    {post.postFiles &&
                                                      post.postFiles.length > 0 && (
                                                        <ProfileSinglePost post={post} />
                                                      )}
                                                  </>
                                                ))}
                                              </div>
                                            </InfiniteScroll>
                                          ) : (
                                            <NoDataFound />
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </Col>
                              )}
                              
                              
                            </Row>
                          </Tab.Container>
                        </div>
                      )}
                    </div>
                    <div className="new-home-page-right col-lg-4 col-xl-6">
                      <div className="profile-subscription">
                        {userDetails.data.is_block_user == 0 ? (
                          <div className="user-subscription-plans-details">
                            <h3>Subscription Plans</h3>
                            {userDetails.data.payment_info.is_user_needs_pay == 1 &&
                              userDetails.data.payment_info.unsubscribe_btn_status ==
                              0 ? (
                              userDetails.data.payment_info.is_free_account == 0 ? (
                                <div className="user-subscription-btn-sec">
                                  <div
                                    className="subscription-outline-btn"
                                    onClick={(event) =>
                                      subscriptionPayment(
                                        event,
                                        "months",
                                        userDetails.data.payment_info.subscription_info
                                          .monthly_amount,
                                        userDetails.data.payment_info.subscription_info
                                          .monthly_amount_formatted
                                      )
                                    }
                                  >
                                    {
                                      userDetails.data.payment_info.subscription_info
                                        .monthly_amount_formatted
                                    }{" "}
                                    /Month
                                  </div>
                                  <div
                                    className="subscription-btn1"
                                    onClick={(event) =>
                                      subscriptionPayment(
                                        event,
                                        "years",
                                        userDetails.data.payment_info.subscription_info
                                          .yearly_amount,
                                        userDetails.data.payment_info.subscription_info
                                          .yearly_amount_formatted
                                      )
                                    }
                                  >
                                    {
                                      userDetails.data.payment_info.subscription_info
                                        .yearly_amount_formatted
                                    }{" "}
                                    /Year
                                  </div>
                                </div>
                              ) : (
                                <div className="user-subscription-btn-sec">
                                  <div
                                    className="subscription-btn1"
                                    onClick={(event) => {
                                      if (localStorage.getItem("userId")) {
                                        props.dispatch(
                                          followUserStart({
                                            user_id: userDetails.data.user.user_id
                                          })
                                        );
                                      } else {
                                        const notificationMessage =
                                          getErrorNotificationMessage(
                                            t("login_to_continue")
                                          );
                                        props.dispatch(
                                          createNotification(notificationMessage)
                                        );
                                      }
                                    }}
                                  >
                                    Subscribe For Free
                                  </div>
                                </div>
                              )
                            ) : null}

                            {userDetails.data.payment_info.unsubscribe_btn_status ==
                              1 && (
                                <>
                                  <div className="user-subscription-btn-sec">
                                    <div
                                      className="subscription-btn1"
                                      onClick={() => handleUnfollowModalShow()}
                                    >
                                      {t("unfollow")}
                                    </div>
                                  </div>
                                  <Modal
                                    show={showUnfollow}
                                    onHide={handleUnfollowModalClose}
                                    backdrop="static"
                                    keyboard={false}
                                    centered
                                    className={`${localStorage.getItem("theme") !== "" &&
                                      localStorage.getItem("theme") !== null &&
                                      localStorage.getItem("theme") !== undefined &&
                                      localStorage.getItem("theme") === "dark"
                                      ? "dark-theme-modal"
                                      : ""
                                      }
                                    `}
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>{t("unsubscribe")}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {t("cancel_subscription_conformation")}
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={handleUnfollowModalClose}
                                      >
                                        {t("close")}
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={(event) =>
                                          handleUnfollow(
                                            event,
                                            userDetails.data.user.user_id
                                          )
                                        }
                                      >
                                        {t("yes")}
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                </>
                              )}
                          </div>
                        ) : (
                          <div className="user-subscription-plans-details">
                            <div className="user-subscription-btn-sec">
                              <div
                                className="subscription-btn1"
                                onClick={(event) =>
                                  handleBlockUser(event, userDetails.data.user.user_id)
                                }
                              >
                                {t("unblock_the_user")}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="new-feed-suggestions-trending-sec">
                        <NewFeedSuggestionCard />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>

      {userDetails.loading ? (
        t("loading")
      ) : localStorage.getItem("userId") !== "" &&
        localStorage.getItem("userId") !== null &&
        localStorage.getItem("userId") !== undefined ? (
        <>
          {/* <SendTipModal
                            sendTip={sendTip}
                            closeSendTipModal={closeSendTipModal}
                            username={userDetails.data.user.username}
                            userPicture={userDetails.data.user.picture}
                            name={userDetails.data.user.name}
                            post_id={null}
                            user_id={userDetails.data.user.user_id}
                        /> */}
          {sendTip ? (
            <SendTipPaymentModal
              paymentsModal={sendTip}
              closepaymentsModal={closeSendTipModal}
              user_id={userDetails.data.user.user_id}
            />
          ) : null}
          {/* <PaymentModal
            subscrptionPayment={subscrptionPayment}
            closePaymentModal={closePaymentModal}
            userPicture={userDetails.data.user.picture}
            name={userDetails.data.user.name}
            user_unique_id={userDetails.data.user.user_unique_id}
            subscriptionData={subscriptionData}
            username={userDetails.data.user.username}
          /> */}

          {subscrptionPayment ? (
            <SubscriptionPaymentModal
              paymentsModal={subscrptionPayment}
              closepaymentsModal={closePaymentModal}
              name={userDetails.data.user.name}
              user_unique_id={userDetails.data.user.user_unique_id}
              subscriptionData={subscriptionData}
            />
          ) : null}



          <PrivateCallModal
            requestVideoCall={requestVideoCall}
            closePrivateCallModal={closePrivateCallModal}
            username={userDetails.data.user.username}
            userPicture={userDetails.data.user.picture}
            videoAmount={userDetails.data.user.video_call_amount_formatted}
            name={userDetails.data.user.name}
            post_id={null}
            user_id={userDetails.data.user.user_id}
          />
          <PrivateAudioCallModal
            requestAudioCall={requestAudioCall}
            closePrivateCallModal={closePrivateCallModal}
            username={userDetails.data.user.username}
            userPicture={userDetails.data.user.picture}
            AudioAmount={userDetails.data.user.audio_call_amount_formatted}
            name={userDetails.data.user.name}
            post_id={null}
            user_id={userDetails.data.user.user_id}
          />
        </>
      ) : null}
    </>
  );
};

const mapStateToPros = (state) => ({
  comments: state.comment.comments,
  saveChatUser: state.chat.saveChatUser,
  userDetails: state.otherUser.userDetails,
  userPosts: state.otherUser.userPosts,
  products: state.userProducts.otherModelProducts,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(SingleProfile));
