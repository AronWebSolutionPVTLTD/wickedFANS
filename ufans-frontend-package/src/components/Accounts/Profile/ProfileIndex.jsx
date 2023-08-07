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
  fetchUserDetailsStart,
  updateVerifyBadgeStatusStart,
} from "../../../store/actions/UserAction";
import { connect } from "react-redux";
import { getSuccessNotificationMessage } from "../../helper/NotificationMessage";
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
import InfiniteScroll from "react-infinite-scroll-component";
import NoDataFound from "../../NoDataFound/NoDataFound";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileLoader from "../../Loader/ProfileLoader";
import HomeLoader from "../../Loader/HomeLoader";
import NewFeedDisplayCard from "../../NewHome/NewFeedDisplayCard";
import NewFeedSuggestionCard from "../../NewHome/NewFeedSuggestionCard";

const ProfileIndex = (props) => {
  const history = useHistory();

  const [badgeStatus, setBadgeStatus] = useState(0);

  const [activeSec, setActiveSec] = useState("all");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(12);
  
  const [allCount, setAllCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);

  useEffect(() => {
    props.dispatch(fetchPostsStart({ type: "all", skip: 0, take: take }));
    setSkip(take);
    if (props.profile.loading) {
      props.dispatch(fetchUserDetailsStart());
      setBadgeStatus(localStorage.getItem("is_verified_badge"));
    }
  }, []);

  useEffect(() => {

    if (activeSec === 'all') {
      const tempImageCount = props.posts.data.posts.filter((post) => post.post_files.find((eachFile) => eachFile.file_type === "image")).length;
      const tempVideoCount = props.posts.data.posts.filter((post) => post.post_files.find((eachFile) => eachFile.file_type === "video")).length;

      setImageCount(tempImageCount)
      setVideoCount(tempVideoCount)
      setAllCount(props.posts.data.total)
    }
    
  }, [activeSec, props.posts])

  const setActiveSection = (event, key) => {
    setActiveSec(key);
    props.dispatch(
      fetchPostsStart({
        type: key,
        skip: 0,
        take: take,
      })
    );
    setSkip(take);
  };

  const fetchMorePost = () => {
    props.dispatch(
      fetchPostsStart({
        type: activeSec,
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

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onCopy = (event) => {
    const notificationMessage = getSuccessNotificationMessage(
      t("profile_link_copied")
    );
    props.dispatch(createNotification(notificationMessage));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const countChar = (val) => {
    var len = val.length;
    if (len >= 500) {
      val = val.substring(0, 500);
      return val;
      console.log("------", val);
    } else {
      console.log(500 - len);
    }
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  return (
    <>
      <div className="new-home-sec">
        {props.profile.loading ? (
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
                            src={props.profile.data.cover}
                            alt={props.profile.data.name}
                          />
                          <div className="profile-user-cover-header">
                            <div className="profile-user-cover-header-left">
                              <Button variant="link" onClick={() => history.goBack()}>
                                <div className="back-icon" style={{ color: '#fff' }}>
                                  <i className="fas fa-chevron-left"></i>
                                </div>
                              </Button>
                              <div className="profile-user-cover-header-title">
                                <h3>{props.profile.data.name}</h3>
                                <div className="profile-user-cover-header-title-info">
                                  <span>
                                    {props.profile.data.total_posts} {t("posts")} |
                                  </span>
                                  <span>
                                    {props.profile.data.total_followers} {t("fans")} |
                                  </span>
                                  <span>
                                    {props.profile.data.total_followings} {t("following")}
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
                                <i class="fas fa-ellipsis-v fa-2x" aria-hidden="true"></i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <CopyToClipboard text={props.profile.data.share_link} onCopy={onCopy}>
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
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="user-avatar-container">
                          <Image
                            className="user-avatar"
                            src={props.profile.data.picture}
                            alt={props.profile.data.name}
                          />
                          {props.profile.data.is_user_live === 1 && (
                            <Link
                              to={`/join/${props.profile.data.ongoing_live_video.live_video_unique_id}`}
                              className="sidebar-live-btn"
                            >
                              Live
                            </Link>
                          )}
                          {props.profile.data.is_online_status === 1 &&
                            props.profile.data.is_user_online === 1 && (
                              <div className="dot-circle-online"></div>
                            )}
                        </div>
                        <div className="profile-description">
                          <h3>
                            {props.profile.data.name}
                            <span>
                              {props.profile.data.is_verified_badge == 1 && (
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
                            @{props.profile.data.username}
                          </Link>
                          <div className="profile-description-content" style={{ marginTop: 10 }}>
                            {props.profile.data.about_formatted ?
                              <p>
                                {/* {props.profile.data.about_formatted}
                              <a href="#">Read More</a> */}
                                {isReadMore ? props.profile.data.about_formatted.slice(0, 300) : props.profile.data.about_formatted}
                                {props.profile.data.about_formatted.length > 150 &&
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
                        <div className="user-info-list" style={{ paddingLeft: 15 }}>
                          <ul className="list-unstyled">
                            {props.profile.data.selected_category &&
                              props.profile.data.selected_category.name && (
                                <Media as="li">
                                  <Link to="#">
                                    <Image
                                      className="user-info-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/fashion.svg"
                                      }
                                    />
                                    <span>
                                      {props.profile.data.selected_category.name}
                                    </span>
                                  </Link>
                                </Media>
                              )}
                            {props.profile.data.date_of_birth && (
                              <Media as="li">
                                <Link to="#">
                                  <Image
                                    className="user-info-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/date-icon.svg"
                                    }
                                  />
                                  <span>{props.profile.data.date_of_birth}</span>
                                </Link>
                              </Media>
                            )}
                            {props.profile.data.gender &&
                              props.profile.data.gender != "rather-not-select" && (
                                <Media as="li">
                                  <Link to="#">
                                    <Image
                                      className="user-info-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/gender.svg"
                                      }
                                    />
                                    <span>{props.profile.data.gender}</span>
                                  </Link>
                                </Media>
                              )}
                            {props.profile.data.eyes_color_formatted && (
                              <Media as="li">
                                <Link to="#">
                                  <Image
                                    className="user-info-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/eye.svg"
                                    }
                                  />
                                  <span>
                                    {props.profile.data.eyes_color_formatted}
                                  </span>
                                </Link>
                              </Media>
                            )}
                            {props.profile.data.height > 0 && (
                              <Media as="li">
                                <Link to="#">
                                  <Image
                                    className="user-info-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/scale.svg"
                                    }
                                  />
                                  <span>{props.profile.data.height_formatted}</span>
                                </Link>
                              </Media>
                            )}
                            {props.profile.data.weight > 0 && (
                              <Media as="li">
                                <Link to="#">
                                  <Image
                                    className="user-info-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/weight.svg"
                                    }
                                  />
                                  <span>{props.profile.data.weight_formatted}</span>
                                </Link>
                              </Media>
                            )}
                            {props.profile.data.address ? (
                              <Media as="li">
                                <Link to="#">
                                  <Image
                                    className="user-info-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-settings/map-marker-icon.svg"
                                    }
                                  />
                                  <span>{props.profile.data.address}</span>
                                </Link>
                              </Media>
                            ) : null}
                          </ul>
                        </div>
                      </div>
                      <div className="profile-subscription">
                        <div className="user-subscription-plans-details">
                          <h3>{t("my_plans")}</h3>
                          {props.profile.data.payment_info?.is_free_account == "0" ? (
                            <div className="user-subscription-btn-sec">
                              <div className="profile-subscription-btn">
                                {
                                  props.profile.data.payment_info.subscription_info
                                    .monthly_amount_formatted
                                }{" "}
                                /Month
                              </div>
                              <div className="profile-subscription-btn">
                                {
                                  props.profile.data.payment_info.subscription_info
                                    .yearly_amount_formatted
                                }{" "}
                                /Year
                              </div>
                            </div>
                          ) : (
                            <div className="user-subscription-btn-sec">
                              <div className="profile-subscription-btn">
                                {t("free_subscription")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="profile-buttons">
                        <div className="sidebar-links">
                          <ul className="list-unstyled">
                            <Media as="li">
                              <Link to={"/edit-profile"}>
                                <span>
                                  <Image
                                    className="sidebar-links-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/edit-profile-theme.svg"
                                    }
                                  />
                                </span>
                                {t("edit_profile")}
                              </Link>
                            </Media>
                            <Media as="li">
                              <Link to={"/live-videos"}>
                                <span>
                                  <Image
                                    className="sidebar-links-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/live-video-theme.svg"
                                    }
                                  />
                                </span>
                                {t("live_video")}
                              </Link>
                            </Media>
                            <Media as="li">
                              <Link to="#" onClick={handleShareClick}>
                                <span>
                                  <Image
                                    className="sidebar-links-icon"
                                    src={
                                      window.location.origin +
                                      "/assets/images/new-home/icon/share-theme.svg"
                                    }
                                  />
                                </span>
                                {t("share")}
                              </Link>
                            </Media>
                            {props.profile.data.is_content_creator == 2 ? (
                              <Media as="li">
                                <Link to="/dashboard">
                                  <span>
                                    <Image
                                      className="sidebar-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/dashboard-theme.svg"
                                      }
                                    />
                                  </span>
                                  {t("dashboard")}
                                </Link>
                              </Media>
                            ) : (
                              <Media as="li">
                                <Link to="/become-a-content-creator">
                                  <span>
                                    <Image
                                      className="sidebar-links-icon"
                                      src={
                                        window.location.origin +
                                        "/assets/images/new-home/icon/become-content-creator.svg"
                                      }
                                    />
                                  </span>
                                  {t("become-a-content-creator")}
                                </Link>
                              </Media>
                            )}
                          </ul>
                        </div>
                        {/* {props.profile.data.youtube_link ||
                        props.profile.data.pinterest_link ||
                        props.profile.data.linkedin_link ||
                        props.profile.data.snapchat_link ||
                        props.profile.data.twitter_link ||
                        props.profile.data.instagram_link ||
                        props.profile.data.amazon_wishlist ||
                        props.profile.data.facebook_link ||
                        props.profile.data.twitch_link ||
                        props.profile.data.website ? (
                          <div className="sidebar-social-links">
                            <ul className="list-unstyled">
                              {props.profile.data.youtube_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.youtube_link}
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
                              {props.profile.data.pinterest_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.pinterest_link}
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
                              {props.profile.data.linkedin_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.linkedin_link}
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
                              {props.profile.data.snapchat_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.snapchat_link}
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
                              {props.profile.data.twitter_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.twitter_link}
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
                              {props.profile.data.instagram_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.instagram_link}
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
                              {props.profile.data.amazon_wishlist && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.amazon_wishlist}
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
                              {props.profile.data.facebook_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.facebook_link}
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
                              {props.profile.data.twitch_link && (
                                <Media as="li">
                                  <a
                                    href={props.profile.data.twitch_link}
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
                              {props.profile.data.website && (
                                <Media as="li">
                                  <a href={props.profile.data.website} target="_blank">
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
                        ) : null} */}
                      </div>
                      
                      <div className="profile-tab-sec" style={{ padding: 0 }}>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="all">
                          <Row>
                            <Col lg={12}>
                              <Nav
                                variant="pills"
                                className={
                                  props.profile.data.is_content_creator == 2
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
                          
                            <Col lg={12}>
                              {activeSec === "all" ? (
                                <>
                                  {props.posts.data.posts.length > 0 ? (
                                    <InfiniteScroll
                                      dataLength={props.posts.data.posts}
                                      next={fetchMorePost}
                                      hasMore={
                                        props.posts.data.posts.length <
                                        props.posts.data.total
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
                                        {props.posts.data.posts.map((post, index) => (
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
                                  {props.posts.loading ? (
                                    <div className="profile-all-post-box">
                                      {[...Array(8)].map(() => (
                                        <Skeleton className="profile-post-card-loader" />
                                      ))}
                                    </div>
                                  ) : (
                                    <>
                                      {props.posts.data.posts.length > 0 ? (
                                        <InfiniteScroll
                                          dataLength={props.posts.data.posts.length}
                                          next={fetchMorePost}
                                          hasMore={
                                            props.posts.data.posts.length <
                                            props.posts.data.total
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
                                            {props.posts.data.posts.map((post) => (
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
                            
                          </Row>
                        </Tab.Container>
                      </div>
                    </div>
                    <div className="new-home-page-right col-lg-4 col-xl-6">
                      <div className="profile-subscription">
                        <div className="user-subscription-plans-details">
                          <h3>{t("my_plans")}</h3>
                          {props.profile.data.payment_info?.is_free_account == "0" ? (
                            <div className="user-subscription-btn-sec">
                              <div className="profile-subscription-btn">
                                {
                                  props.profile.data.payment_info.subscription_info
                                    .monthly_amount_formatted
                                }{" "}
                                /Month
                              </div>
                              <div className="profile-subscription-btn">
                                {
                                  props.profile.data.payment_info.subscription_info
                                    .yearly_amount_formatted
                                }{" "}
                                /Year
                              </div>
                            </div>
                          ) : (
                            <div className="user-subscription-btn-sec">
                              <div className="profile-subscription-btn">
                                {t("free_subscription")}
                              </div>
                            </div>
                          )}
                        </div>
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
    </>
  );
};

const mapStateToPros = (state) => ({
  profile: state.users.profile,
  posts: state.post.posts,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(ProfileIndex));
