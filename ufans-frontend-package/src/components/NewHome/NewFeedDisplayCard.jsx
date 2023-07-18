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
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
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
import { LazyLoadImage } from "react-lazy-load-image-component";
import PPVPaymentModal from "../Model/PaymentModal/PPVPaymentModal";

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
  const [isCampaign ,setIscampaign] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);

  const setCampaignModal =(val,options)=>{
    setCampaignAmt(val)
    setIscampaign(1)
    if(options != ''){
     setCampaignOptions(options)
    } 
    setSendTip(true);
  }

  const closeSendTipModal = () => {
    setIscampaign(0)
    setCampaignAmt()
    setCampaignOptions([])
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

  const handleImageClick = (image) => {
    setIsModalOpen(true);
    setSelectedImage(image);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
  };

  const redirectToProfile = () => {
    history.push(`/${post.user.unique_id}`);
  }

  const feedMedia = (postFile, post) => {
  
    return (
      <>
        {postFile.file_type === "image" ? (
        //Image File
        post.payment_info.is_user_needs_pay === 1 ? (
          //Locked Image
          <div className="profile-lock-post-card">
            <div className="profile-lock-img-sec">
              {/* <Image
                                                          className="profile-lock-img"
                                                          src={postFile.post_file}
                                                      /> */}
              <LazyLoadImage
                className="new-feed-post-img"
                src={postFile.blur_file}
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
              {post.amount_formatted === 0 ? 
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
                </div>) :                
              (<div className="ppv-icon">
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
                <span>{post.amount_formatted}</span>
              </div>)}
              {post.postFiles.length > 1 && (
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
                src={postFile.post_file}
                onClick={() => handleImageClick(postFile.post_file)}
                effect="blur"
              />
              {post.amount > 0 ? (
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
                  <span>{post.amount_formatted}</span>
                </div>
              ) : (
                ""
              )}
              {post.postFiles.length > 1 && (
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
      ) : postFile.file_type === "video" ? (
        // Video Section
        post.payment_info.is_user_needs_pay === 1 ? (
          //Locked Video
          <div className="profile-lock-post-card">
            <div className="profile-lock-img-sec">
              {postFile.video_preview_file ? (
                <video
                  autoplay
                  controls
                  id="myVideo"
                  className="user-profile1 w-100"
                  effect="blur"
                >
                  <source src={postFile.video_preview_file} type="video/mp4" />
                </video>
              ) : (
                <LazyLoadImage
                  className="new-feed-post-img"
                  src={ postFile.blur_file}
                  effect="blur"
                />
              )}
              <div className="profile-lock-icon-sec">
                <Image
                  className="profile-lock-icon"
                  src={
                    window.location.origin +
                    "/assets/images/new-home/icon/lock-icon.png"
                  }
                />
              </div>
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
                <span>{post.amount_formatted}</span>
              </div>
              {post.postFiles.length > 1 && (
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
                url={postFile.post_file}
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
              {post.amount > 0 ? (
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
                  <span>{post.amount_formatted}</span>
                </div>
              ) : (
                ""
              )}
              {post.postFiles.length > 1 && (
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
      ) : postFile.file_type === "audio" ? (
        // Audio
        post.payment_info.is_user_needs_pay === 1 ? (
          //Locked Audio
          <div className="profile-lock-post-card">
            <div className="profile-lock-img-sec">
              <LazyLoadImage
                className="profile-lock-img-feed"
                src={
                  postFile.preview_file
                    ? postFile.preview_file
                    : postFile.post_file
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
                <span>{post.amount_formatted}</span>
              </div>
              {post.postFiles.length > 1 && (
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
                  postFile.preview_file
                    ? postFile.preview_file
                    : postFile.post_file
                }
                effect="blur"
              />
              {post.amount > 0 ? (
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
                  <span>{post.amount_formatted}</span>
                </div>
              ) : (
                ""
              )}
              <div className="profile-audio-icon-sec">
                <Image
                  className="profile-audio-icon"
                  src={
                    window.location.origin +
                    "/assets/images/new-home/icon/audio-icon.png"
                  }
                />
              </div>
              {post.postFiles.length > 1 && (
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
            feedMedia(post.postFiles[0], post)}
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
                <div key={i}>{feedMedia(file, post)}</div>
              ))}
            </AutoplaySlider>
          )}
        </div>

        {post.is_campaign && post.is_campaign === '1'?
          <div className="new-feed-campaign-footer-sec">
            <div className="new-feed-footer-action-btn-sec campaign-option">
              <div className="new-feed-footer-action-left-sec campaign-option-target">
                <span> <Image
                  className="three-dots-icon"
                  src={
                    window.location.origin +
                    "/assets/images/icons/target_dollar.svg"
                  }
                /> $ {post.total_compaign_amt ? post.total_compaign_amt.toFixed(2) : 0}</span>
              </div>
              <div className="new-feed-footer-action-right-sec campaign-option-target">
                <span>$ {post.campaign_goal_amt?post.campaign_goal_amt:0}</span>
              </div>
            </div>
            <div className="new-feed-footer-campaign-option-sec" >
            {post.campaign_options.split(',').map((item, i) => {
                return <Button className="new-feed-campaign-btn" key={i} onClick={() => setCampaignModal(item,post.campaign_options)}>
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
        {post.payment_info.is_user_needs_pay === 1 ? (
        <div className="user-subscription-btn-sec">
          <div
            className="subscription-btn"
            onClick={e =>
              post.payment_info.post_payment_type === "ppv" ?
                setPaymentModal(true) 
                : post.payment_info.post_payment_type === "subscription" ?
                  redirectToProfile()
                  : e.preventDefault()
            }
          >
            UNLOCK POST FOR {post.amount_formatted} 
          </div>
        </div>) : null }
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
            campaignAmt = {campaignAmt}
            setCampaignAmt = {setCampaignAmt}
            isCampaign ={isCampaign}
            setIscampaign = {setIscampaign}
            campaignOptions = {campaignOptions}
            closepaymentsModal={closeSendTipModal}
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

      {paymentModal ?
        <PPVPaymentModal
          PPVPayment={paymentModal}
          closePPVPaymentModal={closePaymentModal}
          post={post}
          username={post.username}
          userPicture={post.user_picture}
          name={post.user_displayname}
          post_id={post.post_id}
          user_id={post.user_id}
          amount={post.amount}
          amount_formatted={post.amount_formatted}
        />
        : null
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
  userDetails: state.otherUser.userDetails,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(NewFeedDisplayCard));
