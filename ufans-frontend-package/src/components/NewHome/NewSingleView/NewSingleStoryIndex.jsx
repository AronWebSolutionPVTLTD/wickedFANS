import React, { useState, useEffect } from "react";
import {
  Dropdown,
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  Media,
  Modal,
  InputGroup,
} from "react-bootstrap";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import ReactPlayer from "react-player";
import "../NewHome.css";
import "./NewSingleComment.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import {
  deletePostStart,
  fetchSinglePostStart,
} from "../../../store/actions/PostAction";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import CopyToClipboard from "react-copy-to-clipboard";
import { getSuccessNotificationMessage } from "../../helper/NotificationMessage";
import { createNotification } from "react-redux-notify";
import ReportModeModal from "../../helper/ReportModeModal";
import { saveBlockUserStart } from "../../../store/actions/UserAction";
import {
  fetchCommentRepliesStart,
  fetchMoreCommentRepliesStart,
  fetchCommentsStart,
  fetchMoreCommentsStart,
} from "../../../store/actions/CommentsAction";
import NewComments from "../../helper/NewComments";
import SendTipPaymentModal from "../../Model/PaymentModal/SendTipPaymentModal";
import CommonCenterLoader from "../../Loader/CommonCenterLoader";
import { savePostLikeStart } from "../../../store/actions/PostLikesAction";
import { saveBookmarkStart } from "../../../store/actions/BookmarkAction";
import InfiniteScroll from "react-infinite-scroll-component";
import NewCommentReplies from "../../helper/NewCommentReplies";
import { useHistory } from "react-router";
import { format } from "timeago.js";
import NewHomeSearch from "./NewHomeSearch";
import NewFeedSuggestionCard from "../NewFeedSuggestionCard";
import HomeLoader from "../../Loader/HomeLoader";
import PPVPaymentModal from "../../Model/PaymentModal/PPVPaymentModal";
import { LazyLoadImage } from "react-lazy-load-image-component";

const NewSingleStoryIndex = (props) => {
  const params = useParams();
  const history = useHistory();

  const [files, setFiles] = useState([]);
  const [reportMode, setReportMode] = useState(false);
  const [sendTip, setTipModal] = useState(false);
  const [skipRender, setSkipRender] = useState(true);
  const [lastPostId, setLastPostId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);

  const closeReportModeModal = () => {
    setReportMode(false);
  };

  const closeSendTipModal = () => {
    setTipModal(false);
  };

  useEffect(() => {
    props.dispatch(
      fetchSinglePostStart({
        post_unique_id: params.post_unique_id,
      })
    );
    setSelectedComment(null);
  }, [params.post_unique_id]);

  useEffect(() => {
    if (!props.singlePost.loading && props.singlePost.data.post.postFiles) {
      setFiles(props.singlePost.data.post.postFiles);
    }
    if (
      !skipRender &&
      !props.singlePost.loading &&
      Object.keys(props.singlePost.data).length > 0 &&
      lastPostId !== props.singlePost.data.post.post_id
    ) {
      props.dispatch(
        fetchCommentsStart({
          post_id: props.singlePost.data.post.post_id,
          skip: 0,
          take: 4,
        })
      );
      setLastPostId(props.singlePost.data.post.post_id);
    }
  }, [props.singlePost]);

  const fetchMoreComments = () => {
    props.dispatch(
      fetchMoreCommentsStart({
        post_id: props.singlePost.data.post.post_id,
        skip: props.comments.data.post_comments.length,
        take: 4,
      })
    );
  };

  const fetchCommentReply = (commentId) => {
    if (commentId != null) {
      props.dispatch(
        fetchCommentRepliesStart({
          post_id: props.singlePost.data.post.post_id,
          post_comment_id: commentId,
          skip: 0,
          take: 1,
        })
      );
    }
    setSelectedComment(commentId);
  };

  const fetchMoreCommentReply = (commentId) => {
    props.dispatch(
      fetchMoreCommentRepliesStart({
        post_id: props.singlePost.data.post.post_id,
        post_comment_id: commentId,
        skip: props.commentReplies.data.post_comment_replies.length,
        take: 1,
      })
    );
  };

  const onCopy = (event) => {
    const notificationMessage = getSuccessNotificationMessage(
      t("profile_link_copied")
    );
    props.dispatch(createNotification(notificationMessage));
  };

  const handleDeletePost = (event, post) => {
    event.preventDefault();
    props.dispatch(deletePostStart({ post_id: post.post_id }));
  };

  useEffect(() => {
    if (
      !skipRender &&
      !props.delPost.loading &&
      Object.keys(props.delPost.data).length > 0
    ) {
      history.push(`/profile`);
    }
  }, [props.delPost]);

  const handleBlockUser = (event, post) => {
    event.preventDefault();
    props.dispatch(saveBlockUserStart({ user_id: post.user_id }));
  };

  const AutoplaySlider = withAutoplay(AwesomeSlider);

  useEffect(() => {
    if (
      !skipRender &&
      !props.saveBlockUser.loading &&
      Object.keys(props.saveBlockUser.data).length > 0
    ) {
      history.push(`/home`);
    }
    setSkipRender(false);
  }, [props.saveBlockUser]);

  const handleLike = (event, post) => {
    event.preventDefault();
    props.dispatch(savePostLikeStart({ post_id: post.post_id }));
  };

  const handleBookmark = (event, post) => {
    event.preventDefault();
    props.dispatch(saveBookmarkStart({ post_id: post.post_id }));
  };

  const handleImageClick = (image) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
  };

  const redirectToProfile = () => {
    history.push(`/${props.singlePost.data.post.user.unique_id}`);
  }

  // const feedMedia = (file) => {
  //   return (
  //     <>
  //       {file.file_type === "image" ? (
  //         <div style={{ height: "100%" }}>
  //           <img
  //             className="new-feed-post-img"
  //             src={file.post_file}
  //             onClick={() => handleImageClick(file.post_file)}
  //           />
  //         </div>
  //       ) : file.file_type === "video" ? (
  //         <div style={{ height: "100%" }}>
  //           <ReactPlayer
  //             // light={postFile.preview_file}
  //             url={file.post_file}
  //             controls={true}
  //             // width="100%"
  //             height="100%"
  //             playing={false}
  //             muted={false}
  //             autoPlay={false}
  //             config={{
  //               file: {
  //                 attributes: { controlsList: "nodownload" },
  //               },
  //             }}
  //             className="post-video-size"
  //           />
  //         </div>
  //       ) : null}
  //     </>
  //   );
  // };

  const feedMedia = (file) => {

    return (
      <>
        {file.file_type === "image" ? (
        //Image File
        props.singlePost.data.post.payment_info.is_user_needs_pay === 1 && props.singlePost.data.post.amount !== 0 ? (
          //Locked Image
          <div className="profile-lock-post-card">
            <div className="profile-lock-img-sec">
              {/* <Image
                                                          className="profile-lock-img"
                                                          src={postFile.post_file}
                                                      /> */}
              <LazyLoadImage
                className="new-feed-post-img"
                src={file.blur_file}
                effect="blur"
              />
              <div className="profile-lock-icon-sec">
                <Image
                  className="profile-lock-icon"
                  src={
                    window.location.origin +
                    "/assets/images/new-home/icon/lock-icon.png"
                  }
                />
              </div>
              {props.singlePost.data.post.amount === 0 ? 
                (<div>
                  <svg>
                    <path
                      fill="url(#a)"
                      d="M2 10c.55 0 1-.45 1-1V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H4C2.35 4 1 5.35 1 7v2c0 .55.45 1 1 1zm26-6h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V7c0-1.65-1.35-3-3-3z"
                      data-original="url(#a)"
                    ></path>
                    <path
                      fill="url(#b)"
                      d="M6 26H4c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.65 1.35 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1zm24-4c-.55 0-1 .45-1 1v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z"
                      data-original="url(#b)"
                    ></path>
                    <g fill="url(#c)">
                      <path d="M16 7C9.83 7 4.13 10.26 1.13 15.5c-.18.31-.18.69 0 .99 3 5.25 8.7 8.5 14.87 8.5s11.87-3.26 14.87-8.5c.18-.31.18-.69 0-.99-3-5.25-8.7-8.5-14.87-8.5zM3.17 16a14.77 14.77 0 014.98-4.84C7.42 12.63 7 14.29 7 16s.41 3.37 1.15 4.84C6.15 19.65 4.43 18 3.17 16zm8.7 6.43c-1.79-1.51-2.86-3.89-2.86-6.43s1.07-4.92 2.86-6.43C13.2 9.2 14.59 9 16.01 9s2.81.2 4.14.57c1.79 1.51 2.86 3.89 2.86 6.43s-1.07 4.92-2.86 6.43c-1.33.37-2.72.57-4.14.57s-2.81-.2-4.14-.57zm11.99-1.59c.73-1.47 1.15-3.13 1.15-4.84s-.41-3.37-1.15-4.84c2 1.19 3.72 2.84 4.98 4.84a14.77 14.77 0 01-4.98 4.84z"></path>
                      <path d="M16.83 15h-1.67a.67.67 0 010-1.34h3.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.68c-1.39.09-2.5 1.24-2.5 2.65s1.2 2.67 2.67 2.67h1.67a.67.67 0 010 1.34H13.5c-.55 0-1 .45-1 1s.45 1 1 1H15V21c0 .55.45 1 1 1s1-.45 1-1v-.68c1.39-.09 2.5-1.24 2.5-2.65S18.3 15 16.83 15z"></path>
                    </g>
                  </svg>
                </div>) : (
                  ""
                )               
              }
              {props.singlePost.data.post.postFiles.length > 1 && (
                <div className="multiple-icon-sec">
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/new-explore/multiple-img-post.png"
                    }
                    alt=""
                    className="explore-icon-top-right"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          //Free Image
          <div className="profile-image-post-card">
            <div className="profile-image-img-sec">
              {/* <Image
                                                          className="profile-image-img"
                                                          src={postFile.post_file}
                                                      /> */}
              <LazyLoadImage
                className="new-feed-post-img"
                src={file.post_file}
                onClick={() => handleImageClick(file.post_file)}
                effect="blur"
              />
              {/* {post.amount > 0 ? (
                <div className="ppv-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    enableBackground="new 0 0 512 512"
                    viewBox="0 0 32 32"
                  >
                    <linearGradient
                      id="a"
                      x1="-0.04"
                      x2="31.01"
                      y1="7"
                      y2="7"
                      data-name="New Gradient Swatch"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fff"></stop>
                      <stop offset="1" stopColor="#fff"></stop>
                    </linearGradient>
                    <linearGradient
                      id="b"
                      y1="25"
                      y2="25"
                      data-name="New Gradient Swatch"
                      xlinkHref="#a"
                    ></linearGradient>
                    <linearGradient
                      id="c"
                      x2="31.01"
                      y1="16"
                      y2="16"
                      data-name="New Gradient Swatch"
                      xlinkHref="#a"
                    ></linearGradient>
                    <path
                      fill="url(#a)"
                      d="M2 10c.55 0 1-.45 1-1V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H4C2.35 4 1 5.35 1 7v2c0 .55.45 1 1 1zm26-6h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V7c0-1.65-1.35-3-3-3z"
                      data-original="url(#a)"
                    ></path>
                    <path
                      fill="url(#b)"
                      d="M6 26H4c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.65 1.35 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1zm24-4c-.55 0-1 .45-1 1v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z"
                      data-original="url(#b)"
                    ></path>
                    <g fill="url(#c)">
                      <path d="M16 7C9.83 7 4.13 10.26 1.13 15.5c-.18.31-.18.69 0 .99 3 5.25 8.7 8.5 14.87 8.5s11.87-3.26 14.87-8.5c.18-.31.18-.69 0-.99-3-5.25-8.7-8.5-14.87-8.5zM3.17 16a14.77 14.77 0 014.98-4.84C7.42 12.63 7 14.29 7 16s.41 3.37 1.15 4.84C6.15 19.65 4.43 18 3.17 16zm8.7 6.43c-1.79-1.51-2.86-3.89-2.86-6.43s1.07-4.92 2.86-6.43C13.2 9.2 14.59 9 16.01 9s2.81.2 4.14.57c1.79 1.51 2.86 3.89 2.86 6.43s-1.07 4.92-2.86 6.43c-1.33.37-2.72.57-4.14.57s-2.81-.2-4.14-.57zm11.99-1.59c.73-1.47 1.15-3.13 1.15-4.84s-.41-3.37-1.15-4.84c2 1.19 3.72 2.84 4.98 4.84a14.77 14.77 0 01-4.98 4.84z"></path>
                      <path d="M16.83 15h-1.67a.67.67 0 010-1.34h3.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.68c-1.39.09-2.5 1.24-2.5 2.65s1.2 2.67 2.67 2.67h1.67a.67.67 0 010 1.34H13.5c-.55 0-1 .45-1 1s.45 1 1 1H15V21c0 .55.45 1 1 1s1-.45 1-1v-.68c1.39-.09 2.5-1.24 2.5-2.65S18.3 15 16.83 15z"></path>
                    </g>
                  </svg>
                  <span>{post.amount} $</span>
                </div>
              ) : (
                ""
              )} */}
              {props.singlePost.data.post.postFiles.length > 1 && (
                <div className="multiple-icon-sec">
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/new-explore/multiple-img-post.png"
                    }
                    alt=""
                    className="explore-icon-top-right"
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : file.file_type === "video" ? (
        // Video Section
        props.singlePost.data.post.payment_info.is_user_needs_pay === 1 && props.singlePost.data.post.amount !== 0 ? (
          //Locked Video
          <div className="profile-lock-post-card">
            <div className="profile-lock-img-sec">
              {file.video_preview_file ? (
                file.preview_file_type === "image" ? (
                  <LazyLoadImage
                    className="new-feed-post-img"
                    src={ file.video_preview_file}
                    effect="blur"
                  />
                ) : (
                  <video
                    autoplay
                    controls
                    id="myVideo"
                    className="user-profile1 w-100"
                    effect="blur"
                  >
                    <source src={file.video_preview_file} type="video/mp4" />
                  </video>
                )
              ) : (
                <>
                  <LazyLoadImage
                    className="new-feed-post-img"
                    src={ file.blur_file}
                    effect="blur"
                  />
                  <div className="profile-lock-icon-sec">
                    <Image
                      className="profile-lock-icon"
                      src={
                        window.location.origin +
                        "/assets/images/new-home/icon/lock-icon.png"
                      }
                    />
                  </div>
                </>
              )}
              
              {/* <div className="ppv-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="24"
                  height="24"
                  enableBackground="new 0 0 512 512"
                  viewBox="0 0 32 32"
                >
                  <linearGradient
                    id="a"
                    x1="-0.04"
                    x2="31.01"
                    y1="7"
                    y2="7"
                    data-name="New Gradient Swatch"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#fff"></stop>
                    <stop offset="1" stopColor="#fff"></stop>
                  </linearGradient>
                  <linearGradient
                    id="b"
                    y1="25"
                    y2="25"
                    data-name="New Gradient Swatch"
                    xlinkHref="#a"
                  ></linearGradient>
                  <linearGradient
                    id="c"
                    x2="31.01"
                    y1="16"
                    y2="16"
                    data-name="New Gradient Swatch"
                    xlinkHref="#a"
                  ></linearGradient>
                  <path
                    fill="url(#a)"
                    d="M2 10c.55 0 1-.45 1-1V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H4C2.35 4 1 5.35 1 7v2c0 .55.45 1 1 1zm26-6h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V7c0-1.65-1.35-3-3-3z"
                    data-original="url(#a)"
                  ></path>
                  <path
                    fill="url(#b)"
                    d="M6 26H4c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.65 1.35 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1zm24-4c-.55 0-1 .45-1 1v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z"
                    data-original="url(#b)"
                  ></path>
                  <g fill="url(#c)">
                    <path d="M16 7C9.83 7 4.13 10.26 1.13 15.5c-.18.31-.18.69 0 .99 3 5.25 8.7 8.5 14.87 8.5s11.87-3.26 14.87-8.5c.18-.31.18-.69 0-.99-3-5.25-8.7-8.5-14.87-8.5zM3.17 16a14.77 14.77 0 014.98-4.84C7.42 12.63 7 14.29 7 16s.41 3.37 1.15 4.84C6.15 19.65 4.43 18 3.17 16zm8.7 6.43c-1.79-1.51-2.86-3.89-2.86-6.43s1.07-4.92 2.86-6.43C13.2 9.2 14.59 9 16.01 9s2.81.2 4.14.57c1.79 1.51 2.86 3.89 2.86 6.43s-1.07 4.92-2.86 6.43c-1.33.37-2.72.57-4.14.57s-2.81-.2-4.14-.57zm11.99-1.59c.73-1.47 1.15-3.13 1.15-4.84s-.41-3.37-1.15-4.84c2 1.19 3.72 2.84 4.98 4.84a14.77 14.77 0 01-4.98 4.84z"></path>
                    <path d="M16.83 15h-1.67a.67.67 0 010-1.34h3.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.68c-1.39.09-2.5 1.24-2.5 2.65s1.2 2.67 2.67 2.67h1.67a.67.67 0 010 1.34H13.5c-.55 0-1 .45-1 1s.45 1 1 1H15V21c0 .55.45 1 1 1s1-.45 1-1v-.68c1.39-.09 2.5-1.24 2.5-2.65S18.3 15 16.83 15z"></path>
                  </g>
                </svg>
                <span>{post.amount} $</span>
              </div> */}
              {props.singlePost.data.post.postFiles.length > 1 && (
                <div className="multiple-icon-sec">
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/new-explore/multiple-img-post.png"
                    }
                    alt=""
                    className="explore-icon-top-right"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          //Free Video
          <div className="profile-video-post-card">
            <div className="profile-video-img-sec">
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
              {/* {post.amount > 0 ? (
                <div className="ppv-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    enableBackground="new 0 0 512 512"
                    viewBox="0 0 32 32"
                  >
                    <linearGradient
                      id="a"
                      x1="-0.04"
                      x2="31.01"
                      y1="7"
                      y2="7"
                      data-name="New Gradient Swatch"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fff"></stop>
                      <stop offset="1" stopColor="#fff"></stop>
                    </linearGradient>
                    <linearGradient
                      id="b"
                      y1="25"
                      y2="25"
                      data-name="New Gradient Swatch"
                      xlinkHref="#a"
                    ></linearGradient>
                    <linearGradient
                      id="c"
                      x2="31.01"
                      y1="16"
                      y2="16"
                      data-name="New Gradient Swatch"
                      xlinkHref="#a"
                    ></linearGradient>
                    <path
                      fill="url(#a)"
                      d="M2 10c.55 0 1-.45 1-1V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H4C2.35 4 1 5.35 1 7v2c0 .55.45 1 1 1zm26-6h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V7c0-1.65-1.35-3-3-3z"
                      data-original="url(#a)"
                    ></path>
                    <path
                      fill="url(#b)"
                      d="M6 26H4c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.65 1.35 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1zm24-4c-.55 0-1 .45-1 1v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z"
                      data-original="url(#b)"
                    ></path>
                    <g fill="url(#c)">
                      <path d="M16 7C9.83 7 4.13 10.26 1.13 15.5c-.18.31-.18.69 0 .99 3 5.25 8.7 8.5 14.87 8.5s11.87-3.26 14.87-8.5c.18-.31.18-.69 0-.99-3-5.25-8.7-8.5-14.87-8.5zM3.17 16a14.77 14.77 0 014.98-4.84C7.42 12.63 7 14.29 7 16s.41 3.37 1.15 4.84C6.15 19.65 4.43 18 3.17 16zm8.7 6.43c-1.79-1.51-2.86-3.89-2.86-6.43s1.07-4.92 2.86-6.43C13.2 9.2 14.59 9 16.01 9s2.81.2 4.14.57c1.79 1.51 2.86 3.89 2.86 6.43s-1.07 4.92-2.86 6.43c-1.33.37-2.72.57-4.14.57s-2.81-.2-4.14-.57zm11.99-1.59c.73-1.47 1.15-3.13 1.15-4.84s-.41-3.37-1.15-4.84c2 1.19 3.72 2.84 4.98 4.84a14.77 14.77 0 01-4.98 4.84z"></path>
                      <path d="M16.83 15h-1.67a.67.67 0 010-1.34h3.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.68c-1.39.09-2.5 1.24-2.5 2.65s1.2 2.67 2.67 2.67h1.67a.67.67 0 010 1.34H13.5c-.55 0-1 .45-1 1s.45 1 1 1H15V21c0 .55.45 1 1 1s1-.45 1-1v-.68c1.39-.09 2.5-1.24 2.5-2.65S18.3 15 16.83 15z"></path>
                    </g>
                  </svg>
                  <span>{post.amount} $</span>
                </div>
              ) : (
                ""
              )} */}
              {props.singlePost.data.post.postFiles.length > 1 && (
                <div className="multiple-icon-sec">
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/new-explore/multiple-img-post.png"
                    }
                    alt=""
                    className="explore-icon-top-right"
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : file.file_type === "audio" ? (
        // Audio
        props.singlePost.data.post.payment_info.is_user_needs_pay === 1 && props.singlePost.data.post.amount !== 0 ? (
          //Locked Audio
          <div className="profile-lock-post-card">
            <div className="profile-lock-img-sec">
              <LazyLoadImage
                className="profile-lock-img-feed"
                src={
                  file.preview_file
                    ? file.preview_file
                    : file.post_file
                }
                effect="blur"
              />
              <div className="profile-lock-icon-sec">
                <Image
                  className="profile-lock-icon"
                  src={
                    window.location.origin +
                    "/assets/images/new-home/icon/lock-icon.png"
                  }
                />
              </div>
              {/* <div className="ppv-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="24"
                  height="24"
                  enableBackground="new 0 0 512 512"
                  viewBox="0 0 32 32"
                >
                  <linearGradient
                    id="a"
                    x1="-0.04"
                    x2="31.01"
                    y1="7"
                    y2="7"
                    data-name="New Gradient Swatch"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#fff"></stop>
                    <stop offset="1" stopColor="#fff"></stop>
                  </linearGradient>
                  <linearGradient
                    id="b"
                    y1="25"
                    y2="25"
                    data-name="New Gradient Swatch"
                    xlinkHref="#a"
                  ></linearGradient>
                  <linearGradient
                    id="c"
                    x2="31.01"
                    y1="16"
                    y2="16"
                    data-name="New Gradient Swatch"
                    xlinkHref="#a"
                  ></linearGradient>
                  <path
                    fill="url(#a)"
                    d="M2 10c.55 0 1-.45 1-1V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H4C2.35 4 1 5.35 1 7v2c0 .55.45 1 1 1zm26-6h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V7c0-1.65-1.35-3-3-3z"
                    data-original="url(#a)"
                  ></path>
                  <path
                    fill="url(#b)"
                    d="M6 26H4c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.65 1.35 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1zm24-4c-.55 0-1 .45-1 1v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z"
                    data-original="url(#b)"
                  ></path>
                  <g fill="url(#c)">
                    <path d="M16 7C9.83 7 4.13 10.26 1.13 15.5c-.18.31-.18.69 0 .99 3 5.25 8.7 8.5 14.87 8.5s11.87-3.26 14.87-8.5c.18-.31.18-.69 0-.99-3-5.25-8.7-8.5-14.87-8.5zM3.17 16a14.77 14.77 0 014.98-4.84C7.42 12.63 7 14.29 7 16s.41 3.37 1.15 4.84C6.15 19.65 4.43 18 3.17 16zm8.7 6.43c-1.79-1.51-2.86-3.89-2.86-6.43s1.07-4.92 2.86-6.43C13.2 9.2 14.59 9 16.01 9s2.81.2 4.14.57c1.79 1.51 2.86 3.89 2.86 6.43s-1.07 4.92-2.86 6.43c-1.33.37-2.72.57-4.14.57s-2.81-.2-4.14-.57zm11.99-1.59c.73-1.47 1.15-3.13 1.15-4.84s-.41-3.37-1.15-4.84c2 1.19 3.72 2.84 4.98 4.84a14.77 14.77 0 01-4.98 4.84z"></path>
                    <path d="M16.83 15h-1.67a.67.67 0 010-1.34h3.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.68c-1.39.09-2.5 1.24-2.5 2.65s1.2 2.67 2.67 2.67h1.67a.67.67 0 010 1.34H13.5c-.55 0-1 .45-1 1s.45 1 1 1H15V21c0 .55.45 1 1 1s1-.45 1-1v-.68c1.39-.09 2.5-1.24 2.5-2.65S18.3 15 16.83 15z"></path>
                  </g>
                </svg>
                <span>{post.amount} $</span>
              </div> */}
              {props.singlePost.data.post.postFiles.length > 1 && (
                <div className="multiple-icon-sec">
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/new-explore/multiple-img-post.png"
                    }
                    alt=""
                    className="explore-icon-top-right"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          //Free Audio
          <div className="profile-audio-post-card">
            <div className="profile-audio-img-sec">
              <LazyLoadImage
                className="profile-audio-img"
                src={
                  file.preview_file
                    ? file.preview_file
                    : file.post_file
                }
                effect="blur"
              />
              {/* {post.amount > 0 ? (
                <div className="ppv-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    enableBackground="new 0 0 512 512"
                    viewBox="0 0 32 32"
                  >
                    <linearGradient
                      id="a"
                      x1="-0.04"
                      x2="31.01"
                      y1="7"
                      y2="7"
                      data-name="New Gradient Swatch"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fff"></stop>
                      <stop offset="1" stopColor="#fff"></stop>
                    </linearGradient>
                    <linearGradient
                      id="b"
                      y1="25"
                      y2="25"
                      data-name="New Gradient Swatch"
                      xlinkHref="#a"
                    ></linearGradient>
                    <linearGradient
                      id="c"
                      x2="31.01"
                      y1="16"
                      y2="16"
                      data-name="New Gradient Swatch"
                      xlinkHref="#a"
                    ></linearGradient>
                    <path
                      fill="url(#a)"
                      d="M2 10c.55 0 1-.45 1-1V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H4C2.35 4 1 5.35 1 7v2c0 .55.45 1 1 1zm26-6h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 .55.45 1 1 1s1-.45 1-1V7c0-1.65-1.35-3-3-3z"
                      data-original="url(#a)"
                    ></path>
                    <path
                      fill="url(#b)"
                      d="M6 26H4c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 1.65 1.35 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1zm24-4c-.55 0-1 .45-1 1v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.65 0 3-1.35 3-3v-2c0-.55-.45-1-1-1z"
                      data-original="url(#b)"
                    ></path>
                    <g fill="url(#c)">
                      <path d="M16 7C9.83 7 4.13 10.26 1.13 15.5c-.18.31-.18.69 0 .99 3 5.25 8.7 8.5 14.87 8.5s11.87-3.26 14.87-8.5c.18-.31.18-.69 0-.99-3-5.25-8.7-8.5-14.87-8.5zM3.17 16a14.77 14.77 0 014.98-4.84C7.42 12.63 7 14.29 7 16s.41 3.37 1.15 4.84C6.15 19.65 4.43 18 3.17 16zm8.7 6.43c-1.79-1.51-2.86-3.89-2.86-6.43s1.07-4.92 2.86-6.43C13.2 9.2 14.59 9 16.01 9s2.81.2 4.14.57c1.79 1.51 2.86 3.89 2.86 6.43s-1.07 4.92-2.86 6.43c-1.33.37-2.72.57-4.14.57s-2.81-.2-4.14-.57zm11.99-1.59c.73-1.47 1.15-3.13 1.15-4.84s-.41-3.37-1.15-4.84c2 1.19 3.72 2.84 4.98 4.84a14.77 14.77 0 01-4.98 4.84z"></path>
                      <path d="M16.83 15h-1.67a.67.67 0 010-1.34h3.33c.55 0 1-.45 1-1s-.45-1-1-1h-1.5v-.67c0-.55-.45-1-1-1s-1 .45-1 1v.68c-1.39.09-2.5 1.24-2.5 2.65s1.2 2.67 2.67 2.67h1.67a.67.67 0 010 1.34H13.5c-.55 0-1 .45-1 1s.45 1 1 1H15V21c0 .55.45 1 1 1s1-.45 1-1v-.68c1.39-.09 2.5-1.24 2.5-2.65S18.3 15 16.83 15z"></path>
                    </g>
                  </svg>
                  <span>{post.amount} $</span>
                </div>
              ) : (
                ""
              )} */}
              <div className="profile-audio-icon-sec">
                <Image
                  className="profile-audio-icon"
                  src={
                    window.location.origin +
                    "/assets/images/new-home/icon/audio-icon.png"
                  }
                />
              </div>
              {props.singlePost.data.post.postFiles.length > 1 && (
                <div className="multiple-icon-sec">
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/new-explore/multiple-img-post.png"
                    }
                    alt=""
                    className="explore-icon-top-right"
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        ""
      )}
      </>
    );
  };

  return (
    <>
      <div className="new-home-page-sec">
        <Container>
          <Row>
            <Col md={12}>
              {props.singlePost.loading ? (
                <HomeLoader />
              ) : (
                <div className="new-home-page-box row">
                  <div className="new-home-page-left col-sm-9 col-md-9 col-lg-6 col-12">
                    <Link to={`/home`}>
                      <div className="back-icon">
                        <i className="fas fa-chevron-left"></i> Home
                      </div>
                    </Link>
                    <div className="new-feed-display-card">
                      <div className="new-feed-header-sec">
                        <div className="new-feed-user-info">
                          <div className="live-streaming-user-img-sec">
                            <Image
                              className="new-feed-user-img"
                              src={props.singlePost.data.post.user_picture}
                            />
                          </div>
                          <div className="new-feed-user-details">
                            <h4>
                              {props.singlePost.data.post.user_displayname}
                              {props.singlePost.data.post.is_verified_badge ===
                              1 ? (
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
                            <Link
                              to={`/${props.singlePost.data.post.user_unique_id}`}
                            >
                              @{props.singlePost.data.post.username}
                            </Link>
                          </div>
                        </div>
                        <div className="new-feed-user-btn-sec">
                          <div className="new-feed-post-time-sec">
                            <p>{props.singlePost.data.post.created}</p>
                          </div>
                          <Button
                            className="sent-tip-btn"
                            onClick={() => setTipModal(true)}
                          >
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
                              <CopyToClipboard
                                text={props.singlePost.data.post.share_link}
                                onCopy={onCopy}
                              >
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
                                  onClick={(event) =>
                                    handleBlockUser(event, props.singlePost)
                                  }
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
                      {props.singlePost.data.post.amount !== 0 && (
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: "2em" }}>
                          <span style={{ fontSize: "16px", fontWeight: "400", color: "#9896A1" }}>${props.singlePost.data.post.amount}</span>
                          {props.singlePost.data.post.payment_info.is_user_needs_pay === 1 && props.singlePost.data.post.amount !== 0 ? (
                            <Image
                              className="profile-lock-icon"
                              style={{ width: "18px" }}
                              src={
                                window.location.origin +
                                "/assets/images/new-home/icon/lock-icon1.png"
                              }
                            />
                          ) : (
                            <Image
                              className="profile-lock-icon"
                              style={{ width: "18px" }}
                              src={
                                window.location.origin +
                                "/assets/images/icons/unlock.svg"
                              }
                            />
                          )}
                        </div>
                      )}
                      <div className="new-feed-post-description-sec">
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              props.singlePost.data.post.content
                          }}
                        ></p>
                      </div>
                      <div className="new-feed-body-sec">
                        {files.length > 0 &&
                          files.length < 2 &&
                          feedMedia(files[0])}
                        {files.length >= 2 && (
                          <AutoplaySlider
                            organicArrows={false}
                            bullets={true}
                            play={false}
                            cancelOnInteraction={false}
                            interval={6000}
                            mobileTouch={true}
                          >
                            {files.length > 0 &&
                              files.map((file, i) => (
                                <div key={i}>{feedMedia(file)}</div>
                              ))}
                          </AutoplaySlider>
                        )}
                      </div>
                      {props.singlePost.data.post.payment_info.is_user_needs_pay === 1 && props.singlePost.data.post.amount !== 0 ? (
                        <div style={{ padding: "16px", backgroundColor: "#e9e9eb" }}>
                          <div style={{ border: "1px solid #d7d7db", padding: "12px", borderRadius: "10px" }}>
                            {props.singlePost.data.post.postFiles.map((file, i) => (
                              file.file_type === "video" && (
                                <div key={i} style={{ display: "flex", gap: "6px" }}>
                                  <Image
                                    src={
                                      window.location.origin +
                                      "/assets/images/icons/video-camera.png"
                                    }
                                    className="svg-clone"
                                  />
                                  {file.duration < 60 ? (
                                    file.duration >= 10 ? (
                                    <span style={{ fontSize: "16px" }}>00:{file.duration}</span>
                                    ) : (
                                    <span style={{ fontSize: "16px" }}>00:0{file.duration}</span>
                                    )
                                  ) : (
                                    parseInt(file.duration / 60) >= 10 ? (
                                    <span style={{ fontSize: "16px" }}>{parseInt(file.duration / 60)}:{file.duration % 60}</span>
                                    ) : (
                                    <span style={{ fontSize: "16px" }}>0{parseInt(file.duration / 60)}:{file.duration % 60}</span> 
                                    ) 
                                  )}
                                </div>)
                              ))
                            }
                            <div className="user-subscription-btn-sec">
                              <div
                                className="subscription-btn"
                                onClick={e =>
                                  props.singlePost.data.post.payment_info.post_payment_type === "ppv" ?
                                    setPaymentModal(true) 
                                    : props.singlePost.data.post.payment_info.post_payment_type === "subscription" ?
                                      redirectToProfile()
                                      : e.preventDefault()
                                }
                              >
                                UNLOCK POST FOR {props.singlePost.data.post.amount} $ 
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null }
                      <div className="new-feed-footer-sec">
                        <div className="new-feed-footer-action-btn-sec">
                          <div className="new-feed-footer-action-left-sec">
                            <Button
                              className="new-feed-wishlist-btn"
                              onClick={(event) =>
                                handleLike(event, props.singlePost.data.post)
                              }
                            >
                              {props.singlePost.data.post.is_user_liked ? (
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
                              <span>
                                {props.singlePost.data.post.like_count}
                              </span>
                            </Button>

                            <Button className="new-feed-wishlist-btn">
                              <Image
                                className="new-feed-wishlist-icon"
                                src={
                                  window.location.origin +
                                  "/assets/images/feed-story/comments.svg"
                                }
                              />
                              <span>
                                {props.singlePost.data.post.total_comments}
                              </span>
                            </Button>
                          </div>
                          <div className="new-feed-footer-action-right-sec">
                            <Button
                              className="new-feed-bookmark-btn"
                              onClick={(event) =>
                                handleBookmark(
                                  event,
                                  props.singlePost.data.post
                                )
                              }
                            >
                              {props.singlePost.data.post.is_user_bookmarked ===
                              1 ? (
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
                          <h5>
                            {props.singlePost.data.post.liked_by_formatted}
                          </h5>
                          {props.singlePost.data.post.recent_likes &&
                          props.singlePost.data.post.recent_likes.length > 0 ? (
                            <div className="new-feeds-liked-users-img-sec">
                              {props.singlePost.data.post.recent_likes.map(
                                (likedUser, i) => (
                                  <Image
                                    key={i}
                                    className="new-feeds-liked-users-img"
                                    src={likedUser.picture}
                                  />
                                )
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Comment Section */}
                      {props.comments.data.post_comments.length > 0 && (
                        <div className="new-single-post-view-body">
                          <div
                            className="scroll-comment-sec"
                            id="commentScrollDiv"
                          >
                            {props.comments.loading ? (
                              <CommonCenterLoader />
                            ) : (
                              <InfiniteScroll
                                dataLength={
                                  props.comments.data.post_comments.length
                                }
                                next={fetchMoreComments}
                                hasMore={
                                  props.comments.data.post_comments.length <
                                  props.comments.data.total
                                }
                                loader={<CommonCenterLoader />}
                                scrollableTarget="commentScrollDiv"
                                style={{ height: "auto", overflow: "hidden" }}
                              >
                                {props.comments.data.post_comments.map(
                                  (comment, i) => (
                                    <div className="view-reply-comment" key={i}>
                                      <div className="comment-profile">
                                        <div className="comment-profile-name">
                                          <div className="comment-profile-img-sec">
                                            <Image
                                              className="comments-profile-img"
                                              src={comment.user_picture}
                                            />
                                          </div>
                                          <div className="comment-profile-details">
                                            <Link
                                              to={`/${comment.user_unique_id}`}
                                            >
                                              <h5>
                                                {comment.user_displayname}
                                              </h5>
                                            </Link>
                                            <p>{comment.comment_formatted}</p>
                                            <div className="comment-footer">
                                              <div className="comment-profile-end">
                                                <p className="time-text">
                                                  {format(comment.created_at)}
                                                  {/* {comment.created} */}
                                                </p>
                                              </div>
                                              <div className="comment-reply-btn">
                                                {selectedComment ===
                                                comment.post_comment_id ? (
                                                  <Button
                                                    onClick={() =>
                                                      fetchCommentReply(null)
                                                    }
                                                  >
                                                    {t("hide")}
                                                  </Button>
                                                ) : (
                                                  <Button
                                                    onClick={() =>
                                                      fetchCommentReply(
                                                        comment.post_comment_id
                                                      )
                                                    }
                                                  >
                                                    {comment.total_comment_replies >
                                                    0 ? (
                                                      <>
                                                        {" "}
                                                        {t(`view_reply`)}{" "}
                                                        {
                                                          comment.total_comment_replies
                                                        }
                                                      </>
                                                    ) : (
                                                      t(`reply`)
                                                    )}
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Comment reply */}
                                      {selectedComment ===
                                      comment.post_comment_id ? (
                                        <div className="new-comment-reply-sec">
                                          {props.commentReplies.loading ? (
                                            <CommonCenterLoader />
                                          ) : props.commentReplies.data
                                              .post_comment_replies.length >
                                            0 ? (
                                            <>
                                              {props.commentReplies.data.post_comment_replies.map(
                                                (reply, i) => (
                                                  <div
                                                    className="view-reply-sec"
                                                    key={i}
                                                  >
                                                    <div className="comment-profile-name">
                                                      <div className="comment-profile-img-sec">
                                                        <Image
                                                          className="comments-profile-img"
                                                          src={
                                                            reply.user_picture
                                                          }
                                                        />
                                                      </div>
                                                      <div className="comment-profile-details">
                                                        <h5>
                                                          {
                                                            reply.user_displayname
                                                          }
                                                          <span>
                                                            {
                                                              reply.reply_formatted
                                                            }
                                                          </span>
                                                        </h5>

                                                        <div className="comment-reply-btn">
                                                          <p className="time-text">
                                                            {reply.created}
                                                          </p>
                                                          {/* <Button>Reply</Button> */}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                              {props.commentReplies.data
                                                .post_comment_replies.length <
                                              props.commentReplies.data
                                                .total ? (
                                                <div className="comment-reply-btn">
                                                  <Button
                                                    onClick={() =>
                                                      fetchMoreCommentReply(
                                                        comment.post_comment_id
                                                      )
                                                    }
                                                  >
                                                    {t("view_reply")}
                                                  </Button>
                                                </div>
                                              ) : (
                                                <Button
                                                  onClick={() =>
                                                    fetchCommentReply(null)
                                                  }
                                                >
                                                  {t("hide")}
                                                </Button>
                                              )}
                                            </>
                                          ) : null}
                                          <NewCommentReplies
                                            comment={comment}
                                          />
                                        </div>
                                      ) : null}
                                    </div>
                                  )
                                )}
                              </InfiniteScroll>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="new-single-post-view-footer">
                        {/* Comment Type Form */}
                        <NewComments post={props.singlePost.data.post} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {reportMode ? (
        <ReportModeModal
          reportMode={reportMode}
          closeReportModeModal={closeReportModeModal}
          post={props.singlePost.data.post.data.post}
        />
      ) : null}

      {paymentModal ?
        <PPVPaymentModal
          PPVPayment={paymentModal}
          closePPVPaymentModal={closePaymentModal}
          post={props.singlePost.data.post}
          username={props.singlePost.data.post.username}
          userPicture={props.singlePost.data.post.user_picture}
          name={props.singlePost.data.post.user_displayname}
          post_id={props.singlePost.data.post.post_id}
          user_id={props.singlePost.data.post.user_id}
          amount={props.singlePost.data.post.amount}
          amount_formatted={props.singlePost.data.post.amount_formatted}
        />
        : null
      }

      {sendTip ? (
        <SendTipPaymentModal
          paymentsModal={sendTip}
          closepaymentsModal={closeSendTipModal}
          post_id={props.singlePost.data.post.data.post.post_id}
          user_id={props.singlePost.data.post.data.post.user_id}
        />
      ) : null}
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
  singlePost: state.post.singlePost,
  delPost: state.post.delPost,
  comments: state.comment.comments,
  commentReplies: state.comment.commentReplies,
  saveBlockUser: state.users.saveBlockUser,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(NewSingleStoryIndex));
