import React, { useEffect, useState } from "react";
import { translate, t } from "react-multi-lang";
import { connect } from "react-redux";
import { registerVerifyResendStart } from '../../store/actions/UserAction';
import "./NewHome.css";

const NewEmailVerifiedCard = (props) => {

    const resendVerification = (event) => {
        event.preventDefault();
        props.dispatch(registerVerifyResendStart());
        props.setVerificationShow(false);
    };

    const closeVerificationModal = () => {
        props.setVerificationShow(false);
    }

    return (
        <div className="email-verification-body">
            <div className="email-verification-content">
                <span className="email-verification-content-title">Check your email to verify your account.</span>
                <span>We sent a link to </span>
                <sapn className="email-verification-content-email">{props.loggedInUser.email}.</sapn>
                <span>Didn't receie the email? <button className="email-verification-content-resend-btn" onClick={resendVerification}>Send again</button></span>
            </div>
            <div className="email-verification-close">
                <button
                    className="email-verification-close-btn"
                    onClick={closeVerificationModal}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

const mapStateToPros = (state) => ({ 
    loggedInUser: state.home.loggedInUser,
    codeResend: state.users.registerVerifyResend,
  });
  
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
  
  export default connect(
    mapStateToPros,
    mapDispatchToProps
  )(translate(NewEmailVerifiedCard))