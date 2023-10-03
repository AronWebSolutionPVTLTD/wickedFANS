import React from 'react';

import './css/style-2.css'
import './css/responsive.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from 'react-router-dom/cjs/react-router-dom';
export const MainLanding = () => {
  const settings = {
    dots: false,
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };
  const settings1 = {
    dots: false,
    speed: 500,
    infinite: true,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };
  const Testsettings = {
    dots: true,
    speed: 500,
    infinite: true,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <>
    
    <>
  <div className="main-wrpper"> 
    {/* page leader */}
    {/* <div class="page-loader">
          <img src="images/logo@4x.png" alt="page-logo" class="img-fluid">
      </div> */}
    {/* Header */}
    <header>
      <div className="container">
        <nav className="navbar navbar-expand-md navbar-light">
          <Link className="navbar-brand" href="index.html">
            <img src="images/logo@4x.png" alt="Logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#NavbarToggle"
            aria-controls="NavbarToggle"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="NavbarToggle">
            <div className="nav-row">
              <ul className="navbar-nav">
                {/* <li><Link class="nav-link active" to="">Home</Link></li> */}
                <li>
                  <Link className="nav-link" to="">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="">
                    Help
                  </Link>
                </li>
                {/* <li><Link class="nav-link" to="">Contact Us</Link></li> */}
              </ul>
              <ul className="enter-nav">
                <li>
                  <Link to="/authentication/login" className="btn-nav">
                    Log in{" "}
                  </Link>
                </li>
                <li>
                  <Link to="/authentication/signup" className="btn-nav signupbtn">
                    Sign up{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
    {/* End Header */}
    {/* Banner */}
    <section className="banner-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div className="banner-data">
              <h1>
                Explore your
                <br /> favorite creators
                <br /> like never before
              </h1>
              <p>
                A new paradigm in the adult world powered by
                <br /> Crypto &amp; Card Payments.
              </p>
              <div className="coinbase">
                <img src="images/coinbase.png" alt="coinbase" />
              </div>
              <Link to="" className="btn-main">
                Become a Creator
              </Link>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="banner-img">
              <img src="images/1-banner-img.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* <img src="images/banner-shp1.png" alt="" class="banner-shp1">
          <img src="images/banner-shp2.png" alt="" class="banner-shp2">
          <img src="images/mobile-shp1.png" alt="" class="mobile-shp1"> */}
    </section>
    <div className="sponcers-wrp">
      <div className="container">
        <div className="sponcer-slider">
          <Slider {...settings}>
            <div className="sponcer-img">
              <img src="images/sponcer-img1.png" alt="" />
            </div>
            <div className="sponcer-img">
              <img src="images/sponcer-img2.png" alt="" />
            </div>
            <div className="sponcer-img">
              <img src="images/sponcer-img3.png" alt="" />
            </div>
            <div className="sponcer-img">
              <img src="images/sponcer-img4.png" alt="" />
            </div>
            <div className="sponcer-img">
              <img src="images/sponcer-img5.png" alt="" />
            </div>
        </Slider>
        </div>
      </div>
    </div>
    {/* End Banner */}
    {/* Why Us */}
    <section className="whyus-wrp">
      <div className="container">
        <div className="titlebar">
          <h6>why us</h6>
          <h2>How wickedfans works?</h2>
          <p>
            Unlock a world of wet experiences with our creators, treat yourself
            with <br /> a whim, and pay securely and quickly with your credit
            card!
          </p>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <div className="why-box">
              <div className="why-ic">
                <img src="images/why-ic1.svg" alt="" />
              </div>
              <h3>Setup creator account</h3>
              <p>
                Become a verified creator in less than 3 minutes, then populate
                your
                <br /> profile with content.
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="why-box">
              <div className="why-ic">
                <img src="images/why-ic2.svg" alt="" />
              </div>
              <h3>Connect with fans</h3>
              <p>
                Promote your account and get your first subscribers to engage
                with messages, live streams or pay to view content.
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="why-box">
              <div className="why-ic">
                <img src="images/why-ic3.svg" alt="" />
              </div>
              <h3>Earn money</h3>
              <p>
                85% of everything you make can be withdrawn as soon as it hits{" "}
                <br />
                your balance!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <img src="images/banner-shp1.png" alt="" class="why-shp1">
          <img src="images/why-shp2.png" alt="" class="why-shp2">                 */}
    </section>
    {/* End Why Us */}
    {/* Ambassadors */}
    <section className="ambassadors-wrp">
      <div className="container">
        <div className="titlebar">
          <h6>Ambassadors</h6>
          <h2>Ambassadors &amp; Affiliates</h2>
          <p>
            Unlock a world of wet experiences with our creators, treat yourself
            with a whim, <br /> and pay securely and quickly with your credit
            card!
          </p>
        </div>
        <Slider {...settings1}>
        <div className="ambassadors-block">
            <div className="ambassadors-img">
              <img src="images/model-img1.png" alt="" />
            </div>
            <div className="personal-infobx">
              <h3>Melvin Lamberty</h3>
              <h6>@melvinlamberty</h6>
              <div className="connect-us">
                <Link to="" target="_blank">
                  <img src="images/social-ic1.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic2.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic3.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
          <div className="ambassadors-block">
            <div className="ambassadors-img">
              <img src="images/model-img2.png" alt="" />
            </div>
            <div className="personal-infobx">
              <h3>Melvin Lamberty</h3>
              <h6>@melvinlamberty</h6>
              <div className="connect-us">
                <Link to="" target="_blank">
                  <img src="images/social-ic1.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic2.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic3.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
          <div className="ambassadors-block">
            <div className="ambassadors-img">
              <img src="images/model-img3.png" alt="" />
            </div>
            <div className="personal-infobx">
              <h3>Melvin Lamberty</h3>
              <h6>@melvinlamberty</h6>
              <div className="connect-us">
                <Link to="" target="_blank">
                  <img src="images/social-ic1.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic2.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic3.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
          <div className="ambassadors-block">
            <div className="ambassadors-img">
              <img src="images/model-img4.png" alt="" />
            </div>
            <div className="personal-infobx">
              <h3>Melvin Lamberty</h3>
              <h6>@melvinlamberty</h6>
              <div className="connect-us">
                <Link to="" target="_blank">
                  <img src="images/social-ic1.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic2.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic3.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
          <div className="ambassadors-block">
            <div className="ambassadors-img">
              <img src="images/model-img4.png" alt="" />
            </div>
            <div className="personal-infobx">
              <h3>Melvin Lamberty</h3>
              <h6>@melvinlamberty</h6>
              <div className="connect-us">
                <Link to="" target="_blank">
                  <img src="images/social-ic1.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic2.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <img src="images/social-ic3.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </Slider>
      </div>
      {/* <img src="images/banner-shp1.png" alt="" class="ambassadors-shp1">
          <img src="images/asseshp.png" alt="" class="ambassadors-shp2">                 */}
    </section>
    {/* End Ambassadors */}
    {/* Creation */}
    <section className="creation-wrp">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div className="creation-img">
              <img src="images/creation-img.png" alt="" />
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="creation-data">
              <h6>creators</h6>
              <h2>
                Enjoy the widest selection of content from your favorite
                creators through
              </h2>
              <ul>
                <li>Chat with your favorite creator</li>
                <li>PPVs</li>
                <li>Subscriptions</li>
                <li>Custom Content</li>
              </ul>
              <div className="coinbase">
                <img src="images/coinbase.png" alt="coinbase" />
              </div>
              <p>
                All while paying with the option that best suits your needs,
                such as credit cards or cryptocurrency.
              </p>
              <div className="btn-group">
                <Link to="" className="btn-main">
                  Become a Creator
                </Link>
                <Link to="" className="btn-main browsebtn">
                  start browing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <img src="images/asseshp.png" alt="" class="ambassadors-shp2">  
          <img src="images/mobile-shp2.png" alt="" class="mobile-shp2">  */}
    </section>
    {/* End Creation */}
    <section className="signup-wrp">
      <div className="container">
        <div className="signup-row">
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <div className="signup-data">
                <h2>
                  Sign up this month,
                  <br /> earn 85% on
                  <br /> WickedFans Now
                </h2>
                <p>
                  Join the fastest growing platform in the creator economy and
                  take control of your earnings
                </p>
                <div className="btn-group">
                  <Link to="" className="btn-main">
                    Become a Creator
                  </Link>
                  <Link to="" className="btn-main browsebtn">
                    start browing
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-sm-12">
              <div className="signup-img">
                <img src="images/signup-img.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <img src="images/banner-shp1.png" alt="" class="signup-shp1">
          <img src="images/banner-shp1.png" alt="" class="signup-shp2">
          <img src="images/asseshp.png" alt="" class="signup-shp3">  */}
    </section>
    {/* Testimonial */}
    <section className="testimonial-wrp">
      <div className="container">
        <div className="titlebar">
          <h6>testimonials</h6>
          <h2>What our customer says</h2>
          <p>
            Become a verified creator in less than 3 minutes, then populate your
            profile with content.
          </p>
        </div>
        <div className="testimonials-slider">
        <Slider {...Testsettings}>
        <div className="testimonials-box">
            <div className="raitingbx">
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
            </div>
            <p>
              "Die Kampagne über euch lief super einfach ab. Ich finde es top,
              dass Leadnow die Posts der Influecner automatisiert checkt und
              einsammelt. "
            </p>
            <h3>Melvin Lamberty</h3>
            <h6>Geschäftsführer </h6>
          </div>
          <div className="testimonials-box">
            <div className="raitingbx">
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
            </div>
            <p>
              "Die Kampagne über euch lief super einfach ab. Ich finde es top,
              dass Leadnow die Posts der Influecner automatisiert checkt und
              einsammelt. "
            </p>
            <h3>Sandhya Mer</h3>
            <h6>Geschäftsführer </h6>
          </div>
          <div className="testimonials-box">
            <div className="raitingbx">
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
            </div>
            <p>
              "Die Kampagne über euch lief super einfach ab. Ich finde es top,
              dass Leadnow die Posts der Influecner automatisiert checkt und
              einsammelt. "
            </p>
            <h3>Maximilian</h3>
            <h6>Geschäftsführer </h6>
          </div>
          <div className="testimonials-box">
            <div className="raitingbx">
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
            </div>
            <p>
              "Die Kampagne über euch lief super einfach ab. Ich finde es top,
              dass Leadnow die Posts der Influecner automatisiert checkt und
              einsammelt. "
            </p>
            <h3>Felix Thönnessen</h3>
            <h6>Geschäftsführer </h6>
          </div>
          <div className="testimonials-box">
            <div className="raitingbx">
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
              <img src="images/star-ic.svg" alt="" />
            </div>
            <p>
              "Die Kampagne über euch lief super einfach ab. Ich finde es top,
              dass Leadnow die Posts der Influecner automatisiert checkt und
              einsammelt. "
            </p>
            <h3>Felix Thönnessen</h3>
            <h6>Geschäftsführer </h6>
          </div>
        </Slider>
          
        </div>
      </div>
      {/* <img src="images/banner-shp1.png" alt="" class="signup-shp2">
          <img src="images/mobile-shp2.png" alt="" class="mobile-shp2">  */}
    </section>
    {/* End Testimonial */}
    {/* FAQ */}
    <section className="faq-wrapper">
      <div className="container">
        <div className="titlebar">
          <h6>faq’s</h6>
          <h2>Frequently asked questions</h2>
          <p>
            Unlock a world of wet experiences with our creators, treat yourself
            with a whim, <br /> and pay securely and quickly with your credit
            card!
          </p>
        </div>
        <div className="faq-list">
          
          <div className="accordion" id="accordionExample">
            <div className="accordion-item line-border">
              <h2 className="accordion-header" id="headingfaq1">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefaq1"
                  aria-expanded="true"
                  aria-controls="collapsefaq1"
                >
                  What is wickedfans?
                </button>
              </h2>
              <div
                id="collapsefaq1"
                className="accordion-collapse collapse show"
                aria-labelledby="headingfaq1"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Wickedfans is a subscription social platform that empowers
                    all creators to share, earn and connect with their fans. We
                    are built for creators and optimizer for fans
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfaq2">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefaq2"
                  aria-expanded="false"
                  aria-controls="collapsefaq2"
                >
                  Who can create wickedfans?
                </button>
              </h2>
              <div
                id="collapsefaq2"
                className="accordion-collapse collapse"
                aria-labelledby="headingfaq2"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Wickedfans is a subscription social platform that empowers
                    all creators to share, earn and connect with their fans. We
                    are built for creators and optimizer for fans
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfaq3">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefaq3"
                  aria-expanded="false"
                  aria-controls="collapsefaq3"
                >
                  How much can i make on wickedfans?
                </button>
              </h2>
              <div
                id="collapsefaq3"
                className="accordion-collapse collapse"
                aria-labelledby="headingfaq3"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Wickedfans is a subscription social platform that empowers
                    all creators to share, earn and connect with their fans. We
                    are built for creators and optimizer for fans
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfaq4">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefaq4"
                  aria-expanded="false"
                  aria-controls="collapsefaq4"
                >
                  How long does it take to become a creator?
                </button>
              </h2>
              <div
                id="collapsefaq4"
                className="accordion-collapse collapse"
                aria-labelledby="headingfaq4"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Wickedfans is a subscription social platform that empowers
                    all creators to share, earn and connect with their fans. We
                    are built for creators and optimizer for fans
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfaq5">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefaq5"
                  aria-expanded="false"
                  aria-controls="collapsefaq5"
                >
                  How long does it take to become a creator?
                </button>
              </h2>
              <div
                id="collapsefaq5"
                className="accordion-collapse collapse"
                aria-labelledby="headingfaq5"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Wickedfans is a subscription social platform that empowers
                    all creators to share, earn and connect with their fans. We
                    are built for creators and optimizer for fans
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <img src="images/asseshp.png" alt="" class="signup-shp3">
          <img src="images/mobile-shp2.png" alt="" class="mobile-shp2">  */}
    </section>
    {/* End FAQ */}
    <section className="signup-wrp crypto-wrp">
      <div className="container">
        <div className="signup-row">
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <div className="signup-data">
                <h2>Pay Through Crypto</h2>
                <p>
                  We know anonymity is important that's crypto payments
                  guarantee that, so you can relax and get absorbed by content
                  you have never seen before.
                </p>
                <h6>powered &amp; integrated with</h6>
                <div className="coinbase">
                  <img src="images/coinbase.png" alt="coinbase" />
                </div>
                <div className="btn-group">
                  <Link to="" className="btn-main">
                    Become a Creator
                  </Link>
                  <Link to="" className="btn-main browsebtn">
                    start browing
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-sm-12">
              <div className="signup-img">
                <img src="images/crypto-img.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <img src="images/banner-shp1.png" alt="" class="signup-shp1">
          <img src="images/asseshp.png" alt="" class="signup-shp3">  */}
    </section>
    {/* Footer */}
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-5 col-sm-12">
            <div className="footer-abt">
              <img src="images/logo@4x.png" alt="footer-logo" />
              <p>
                A new paradigm in the adult world powered by Crypto &amp; Card
                Payments.
              </p>
              <div className="social-box">
                <Link to="" target="_blank">
                  <img src="images/tiktok-ic.png" alt="" />
                </Link>
                <Link to="" target="_blank">
                  <i className="fab fa-twitter fa-fw" />
                </Link>
                <Link to="" target="_blank">
                  <i className="fab fa-facebook-f fa-fw" />
                </Link>
                <Link to="" target="_blank">
                  <i className="fab fa-instagram fa-fw" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-7 col-sm-12">
            <div className="footer-links">
              <div className="quicklinks">
                <h3>Company</h3>
                <ul>
                  <li>
                    <Link to="">Home</Link>
                  </li>
                  <li>
                    <Link to="">Explore</Link>
                  </li>
                  <li>
                    <Link to="">Feed</Link>
                  </li>
                  <li>
                    <Link to="">Discover</Link>
                  </li>
                  <li>
                    <Link to="">Contact</Link>
                  </li>
                </ul>
              </div>
              <div className="quicklinks">
                <h3>Legal</h3>
                <ul>
                  <li>
                    <Link to="">Legal Overview</Link>
                  </li>
                  <li>
                    <Link to="">Terms Of Service</Link>
                  </li>
                  <li>
                    <Link to="">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="">Under 18 Disclaimer</Link>
                  </li>
                  <li>
                    <Link to="">Creator Agreement</Link>
                  </li>
                </ul>
              </div>
              <div className="quicklinks">
                <h3>Help</h3>
                <ul>
                  <li>
                    <Link to="">Change log</Link>
                  </li>
                  <li>
                    <Link to="">Roadmap</Link>
                  </li>
                  <li>
                    <Link to="">Help docs</Link>
                  </li>
                  <li>
                    <Link to="">API docs</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div className="copyright">
      <div className="container">
        <p>
          @2023 <Link to="">WickedFans</Link> all right reserved.
        </p>
      </div>
    </div>
    {/* End Footer */}
  </div>
  {/* model start */}
  {/* Button trigger modal */}
  {/* Modal */}
  <div
    className="modal fade"
    id="exampleModal"
    data-bs-backdrop="static"
    tabIndex={-1}
    aria-labelledby="exampleModalLabel"
    role="dialog"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <div className="model-img">
            <img src="images/logo@4x.png" alt="logo" />
          </div>
          <div className="model-content">
            <div className="banner-data">
              <h1>Age Verification</h1>
            </div>
            <div className="banner-data">
              <p>
                Pornhub is an adult community that contains sexually explicit
                content. You must be 18 year old or over to enter.
              </p>
            </div>
            <div className="enter-link">
              <Link href="index.html">I am 18 or older - Enter</Link>
            </div>
            <div className="banner-data">
              <p>
                Our <span>parental control page </span> explains how you can
                easliy block access to this site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    </>
  )
}
