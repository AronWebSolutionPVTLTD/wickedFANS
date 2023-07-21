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
} from "react-bootstrap";
import "../NewHome.css";
import "./NewSingleComment.css";
import { Link } from "react-router-dom";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import ReactPlayer from "react-player";
import FancyBox from "../NewSingleView/FancyBox";
import { useHistory } from "react-router";
import PPVPaymentModal from "../../Model/PaymentModal/PPVPaymentModal";
import ReactAudioPlayer from "react-audio-player";

const NewSinglePostSlider = (props) => {
  const history = useHistory();
  const AutoplaySlider = withAutoplay(AwesomeSlider);
  const { post } = props;

  const [paymentModal, setPaymentModal] = useState(false);

  const closePaymentModal = () => {
    setPaymentModal(false);
  }

  const redirectToProfile = () => {
    history.push(`/${post.user.unique_id}`);
  }


  return (
    <>
      <div className="new-feed-body-sec">
        <FancyBox>
          <AutoplaySlider
            organicArrows={false}
            bullets={true}
            play={false}
            cancelOnInteraction={false}
            interval={6000}
            mobileTouch={true}
          >
        
            {post.postFiles && post.postFiles.length > 0 ?
              post.postFiles.map((postFile, index) =>
              <div  className="single_post_blur_image" style={{backgroundImage: `url(${postFile.post_file})`, backgroundSize:'cover', backgroundPosition: 'center'}}>
               { postFile.file_type === "image" ?
               <div className="single_post_blur_image">
                  <div>
                    {post.payment_info.is_user_needs_pay == 1 && post.amount !== 0 ?
                      <div
                        onClick={e =>
                          post.payment_info.post_payment_type === "ppv" ?
                            setPaymentModal(true)
                            : post.payment_info.post_payment_type === "subscription" ?
                              redirectToProfile()
                              : e.preventDefault()
                        }
                      >
                        <Image
                          className="single-post-img"
                          src={postFile.post_file}
                        // style={{ filter: "blur(20px)" }}
                        />
                        <div className="post-lock-icon-sec">
                          <Image
                            className="profile-lock-icon"
                            src={
                              window.location.origin + "/assets/images/new-home/icon/lock-icon.png"
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
                      </div>
                      : <Image
                        className="single-post-img"
                        src={postFile.post_file}
                        data-fancybox
                      />
                    }
                  </div>
                  </div>
                  : postFile.file_type === "video" ?
                    <div>
                      {post.payment_info.is_user_needs_pay == 1 && post.amount !== 0 ?
                        <div
                          onClick={e =>
                            post.payment_info.post_payment_type === "ppv" ?
                              setPaymentModal(true)
                              : post.payment_info.post_payment_type === "subscription" ?
                                redirectToProfile()
                                : e.preventDefault()
                          }
                        >
             
                          {postFile.video_preview_file ?
                            postFile.preview_file_type === "image" ? (
                              <Image
                                className="single-post-img"
                                src={postFile.video_preview_file}
                              />
                            ) : (
                              <div  className="video-blur-image" style={{backgroundImage:"url(https://wickedfans.com/admin/storage/app/public/uploads/      posts/6/272177-post-image.jpeg)",backgroundSize:'cover',backgroundPosition:'center'}}>
                                <ReactPlayer
                                  url={postFile.video_preview_file}
                                  controls={false}
                                  width="100%"
                                  height="100%"
                                  playing={true}
                                  loop={true}
                                  muted={true}
                                  autoplay={true}
                                  controlsList={"nodownload"}
                                  className="post-video-size video-bg-black"
                                  // style={{backgroundImage: `url(${postFile.video_preview_file})`}}

                                />
                              </div>
                            )
                            :
                            <>
                              <Image className="single-post-img"
                                src={postFile.post_file}
                                data-fancybox />
                              <div className="post-lock-icon-sec">
                                <Image
                                  className="profile-lock-icon"
                                  src={
                                    window.location.origin + "/assets/images/new-home/icon/lock-icon.png"
                                  }
                                />
                              </div>
                            </>
                          }
                          
                          {/* <div className="post-lock-icon-sec">
                            <Image
                              className="profile-lock-icon"
                              src={
                                window.location.origin + "/assets/images/new-home/icon/lock-icon.png"
                              }
                            />
                          </div> */}

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
                        </div>
                          :
                          <div className="video-blur-image" style={{backgroundImage:"url(https://wickedfans.com/admin/storage/app/public/uploads/posts/6/272177-post-image.jpeg)",backgroundSize:'cover',backgroundPosition:'center'}}>
                           
                        <ReactPlayer
                          // light={postFile.preview_file}
                          url={postFile.post_file}
                          controls={true}
                          width="100%"
                          height="100%"
                          playing={true}
                          muted={true}
                          autoplay={true}
                          config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                          className="post-video-size video-bg-black"
                          // style={{backgroundImage: `url(${postFile.post_file})`}}

                        />
                        </div>
                      }
                    </div>
                    : postFile.file_type === "audio" ?
                      <div>
                        {post.payment_info.is_user_needs_pay == 1 && post.amount !== 0 ?
                          <div
                            onClick={e =>
                              post.payment_info.post_payment_type === "ppv" ?
                                setPaymentModal(true)
                                : post.payment_info.post_payment_type === "subscription" ?
                                  redirectToProfile()
                                  : e.preventDefault()
                            }
                          >
                            <Image className="single-post-img"
                              src={postFile.preview_file
                                ? postFile.preview_file
                                : postFile.post_file}
                              data-fancybox />
                            <div className="post-lock-icon-sec">
                              <Image
                                className="profile-lock-icon"
                                src={
                                  window.location.origin + "/assets/images/new-home/icon/lock-icon.png"
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
                          </div>
                          :
                          <div className="single-post-audio-sec">
                            <Image className="single-post-img"
                              src={postFile.preview_file ? postFile.preview_file : window.location.origin + "/assets/images/new-home/icon/audio-icon.png"}
                            />
                            <ReactAudioPlayer
                              // light={postFile.preview_file}
                              src={postFile.post_file}
                              // file="forceAudio"
                              controls={true}
                              width="100%"
                              height="100%"
                              autoPlay={false}
                              className="single-post-audio"
                              controlsList={"nodownload"}
                            />
                          </div>
                        }
                      </div>
                      : null}
              </div> 
             )
              : null
            }
          </AutoplaySlider>
        </FancyBox>
      </div>
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
    </>
  );
};

function areEqual(prevProps, nextProps) {
  return prevProps.postId === nextProps.postId
}

export default React.memo(NewSinglePostSlider, areEqual);