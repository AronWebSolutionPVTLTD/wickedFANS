import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import configuration from "react-global-configuration";
import SocialButton from "../helper/SocialButton";
import { translate, t } from "react-multi-lang";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import "./signup.css";

import {
  forgotPasswordStart,
  userLoginStart,
  userRegisterStart,
  usernameValidationStart,
  referralValidationStart,
} from "../../store/actions/UserAction";
import { getErrorNotificationMessage } from "../helper/NotificationMessage";
import { createNotification } from "react-redux-notify";
import {
  isAndroid,
  isIOS,
  isWindows,
  isMacOs,
  mobileModel,
  browserName,
  osName,
  mobileVendor,
  browserVersion,
} from "react-device-detect";
import { getFcmToken, onMessageListener } from "../../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ConnectedFocusError } from "focus-formik-error";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { gapi } from "gapi-script";
import { FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const LandingPageIndex = (props) => {
  const [show, setShow] = useState("login");
  const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(0);
  const [loginInputData, setLoginInputData] = useState({});
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [isvalidUserName, setIsValidUserName] = useState(false);

  const [isTokenFound, setTokenFound] = useState(false);

  const [signupInputData, setSignupInputData] = useState();

  const [additionalDetails, setAdditionalDetails] = useState({
    device_type: "",
    device_model: "",
    browser_type: browserName,
    device_token: "",
  });
  const [deviceUniqueId, setDeviceUniqueId] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);

  const history = useHistory();
 const {type} = useParams();
useEffect(()=>{
console.log(" y t i  o  p",type);
setShow(type)
},[type])

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken) {
      history.push("/home");
    }
    const referral = "";
    if (configuration.get("configData.is_referral_enabled") == 1) {
      const query = new URLSearchParams(props.location.search);
      const referral = query.get("referral");
      if (referral) {
        setReferralCode(referral);
        setShow("signup");
      }
    }
    console.log(show);
    if (isAndroid == true) {
      setAdditionalDetails({
        ...additionalDetails,
        device_type: "android",
        device_model: mobileModel,
      });
    } else if (isIOS == true) {
      setAdditionalDetails({
        ...additionalDetails,
        device_type: "ios",
        device_model: mobileModel,
      });
    } else {
      setAdditionalDetails({
        ...additionalDetails,
        device_type: "web",
        device_model: browserName + " " + browserVersion,
      });
    }
  }, []);
  console.log(referralCode);
  const [validationError, setValidationError] = useState("NO");

  // useEffect(() => {
  //   let data;
  //   async function tokenFunc() {
  //     data = await getFcmToken(setTokenFound);
  //     setAdditionalDetails({
  //       ...additionalDetails,
  //       device_token: data,
  //     });
  //     return data;
  //   }
  //   tokenFunc();
  // }, [setTokenFound]);

  useEffect(() => {
    getDeviceUniqueID();
  }, []);

  async function getDeviceUniqueID() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    setDeviceUniqueId(result.visitorId);
  }

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("invalid_email"))
      .required(t("email_is_required")),
    password: Yup.string().required(t("password_is_required")),
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{9,30}$/, t("password_required_note")),
  });

  const handleLogin = (values) => {
    let newValues = {
      ...values,
      ...additionalDetails,
      device_unique_id: deviceUniqueId,
    };
    props.dispatch(userLoginStart(newValues));
  };

  const registerSchema = Yup.object().shape({
    name: Yup.string().required(t("name_is_required")),
    username: Yup.string().required(t("username_is_required")),
    email: Yup.string()
      .email(t("invalid_email"))
      .required(t("email_is_required")),
    password: Yup.string()
      .required(t("password_is_required"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{9,30}$/,
        t("password_required_note")
      ),
  });

  const handleSignup = (values) => {
    let newValues = {
      ...values,
      ...additionalDetails,
      referral_code: referralCode,
      device_unique_id: deviceUniqueId,
    };
    console.log(newValues);
    props.dispatch(userRegisterStart(newValues));
  };

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("invalid_email"))
      .required(t("email_is_required")),
  });

  const handleForgotPassword = (values) => {
    props.dispatch(forgotPasswordStart(values));
  };

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        clientId: configuration.get("configData.GOOGLE_CLIENT_ID"),
        plugin_name: "chat",
      });
    });
  }, []);

  const handleFacebookLogin = (user) => {
    console.log("handleFacebookLogin", user._profile);
    props.dispatch(
      userRegisterStart({
        name: user._profile.name,
        first_name: user._profile.firstName ? user._profile.firstName : "",
        last_name: user._profile.lastName ? user._profile.lastName : "",
        email: user._profile.email ? user._profile.email : "",
        social_unique_id: user._profile.id,
        picture: user._profile.profilePicURL,
        login_by: "facebook",
        device_token: additionalDetails.device_token,
      })
    );
  };

  const handleGoogleLogin = (user) => {
    console.log("handleGoogleLogin", user._profile);
    props.dispatch(
      userRegisterStart({
        name: user._profile.name,
        email: user._profile.email,
        first_name: user._profile.firstName ? user._profile.firstName : "",
        last_name: user._profile.lastName ? user._profile.lastName : "",
        social_unique_id: user._profile.id,
        picture: user._profile.profilePicURL,
        login_by: "google",
        device_token: additionalDetails.device_token,
      })
    );
  };

  const handleUsernameValidation = (username) => {
    if (username && username.length > 3) {
      if (username.replace(" ", "") === username) {
        if (username !== userName) {
          setUserName(username);
          setIsValidUserName(true);
          props.dispatch(usernameValidationStart({ username: username }));
          return "";
        }
      } else {
        setIsValidUserName(false);
        return "No white space allowed";
      }
    } else {
      setIsValidUserName(false);
      return "Must Contain 4 Characters";
    }
  };

  const handleSocialLoginFailure = (err) => {
    console.error(err);
  };

  const checkReferralCode = (event) => {
    event.preventDefault();

    if (referralCode) {
      props.dispatch(referralValidationStart({ referral_code: referralCode }));
    } else {
      const notificationMessage = getErrorNotificationMessage(
        "Please enter the Referral code"
      );
      props.dispatch(createNotification(notificationMessage));
    }
  };

  const onChange = (event) => {
    setIsCaptchaEnabled(1);
    console.log("Captcha value:", event);
    if (event == null) {
      setIsCaptchaEnabled(0);
    }
  };
  return (
    <>
      <div className="wf-wapper">
        <div className="wf-body">
          <div className="wf-form-container">
            <div className="wf-logo-wrap text-center mb-5 mt-md-5 d-flex justify-content-center">
              <Image
                src="/images/logo@4x.png"
                alt="Logo"
                className="wf-logo"
              />
            </div>
            <div className="forms-fields">
              <div id="main">
                <div id="first">
                  {show === "login" ? (
                    <>
                         {/* <div className="Now_MADE">
                        <Button
                          variant="primary"
                          className="d-flex align-items-center signupBtn"
                          style={{ marginBottom: "16px" }}
                        >
                          <FaTwitter size={24} className="mr-2" />
                          Continue with Twitter
                        </Button>
                        <Button
                          variant="primary"
                          className="d-flex align-items-center signupBtn cntGoogle"
                        >
                          <FcGoogle size={24} className="mr-2" />
                          Continue with Google
                        </Button>
                      </div>
                      <div className="or-divider">
                        <div className="line"></div>
                        <div className="or-text">OR</div>
                        <div className="line"></div>
                      </div> */}
                      <Formik
                        isInitialValid={false}
                        initialValues={{
                          email: configuration.get(
                            "configData.demo_user_email"
                          ),
                          password: configuration.get(
                            "configData.demo_user_password"
                          ),
                        }}
                        validationSchema={loginSchema}
                        onSubmit={(values) => handleLogin(values)}
                      >
                        {({ touched, errors, isSubmitting, setFieldValue }) => (
                          <Form noValidate>
                            <div class="form-group mb-4">
                              <div className="form-floating">
                                <Field
                                  type="email"
                                  name="email"
                                  className="form-control"
                                />
                                <label className="form-label">
                                  Email <span>*</span>
                                </label>
                              </div>
                              <ErrorMessage
                                component={"div"}
                                name="email"
                                className="text-left fs-14 fw-medium px-2 error_msg"
                              />
                            </div>
                            <div className="form-group mb-3">
                              <div class="form-floating">
                                <Field
                                  type={
                                    loginPasswordVisible ? "text" : "password"
                                  }
                                  name="password"
                                  className="form-control"
                                />
                                <div class="input-group-append">
                                  <div
                                    onClick={() =>
                                      setLoginPasswordVisible(
                                        !loginPasswordVisible
                                      )
                                    }
                                    class="password-eye"
                                  >
                                    {loginPasswordVisible ? (
                                      <i className="fas fa-eye-slash align-self-center"></i>
                                    ) : (
                                      <i className="fas fa-eye align-self-center"></i>
                                    )}
                                  </div>
                                </div>
                                <label className="form-label">
                                  Password <span>*</span>
                                </label>
                              </div>
                              <ErrorMessage
                                component={"div"}
                                name="password"
                                className="text-left fs-14 fw-medium px-2 error_msg"
                              />
                            </div>

                            <div className="forget-password mb-4">
                              <p className="text-right">
                                <Link
                                  to="#"
                                  type="button"
                                  className="link-text fs-16 fw-semibold"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    setShow("forgotpassword");
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                >
                                  {" "}
                                  {t("forgot_password")}{" "}
                                </Link>
                              </p>
                            </div>

                            <Button
                              type="submit"
                              className="btn wf-submit"
                              disabled={props.login.buttonDisable}
                            >
                              {props.login.loadingButtonContent !== null
                                ? props.login.loadingButtonContent
                                : t("login")}
                            </Button>

                            <div className="my-5 text-center">
                              <p className="fs-16 fw-semibold">
                                {t("do_not_have_an_account")}
                                <Link
                                  className="signup primary fs-16 fw-semibold"
                                  to="/authentication/signup"
                                  id="signup"
                                >
                                  {" "}
                                  {t("signup")}
                                </Link>
                              </p>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </>
                  ) : null}

                  {show === "signup" ? (
                    <>
                      {/* <div className="Now_MADE">
                        <Button
                          variant="primary"
                          className="d-flex align-items-center signupBtn"
                          style={{ marginBottom: "16px" }}
                        >
                          <FaTwitter size={24} className="mr-2" />
                          Continue with Twitter
                        </Button>
                        <Button
                          variant="primary"
                          className="d-flex align-items-center signupBtn cntGoogle"
                        >
                          <FcGoogle size={24} className="mr-2" />
                          Continue with Google
                        </Button>
                      </div>

                      <div className="or-divider">
                        <div className="line"></div>
                        <div className="or-text">OR</div>
                        <div className="line"></div>
                      </div> */}
                      <Formik
                        isInitialValid={false}
                        initialValues={{
                          name: "",
                          username: "",
                          email: "",
                          password: "",
                        }}
                        validationSchema={registerSchema}
                        onSubmit={(values) => {
                          console.log(values);
                          handleSignup(values);
                        }}
                      >
                        {({ touched, errors, isSubmitting, setFieldValue }) => (
                          <Form noValidate>
                            <div class="form-group mb-4">
                              <div className="form-floating">
                                <Field
                                  type="text"
                                  name="name"
                                  placeholder={t("name")}
                                  className="form-control"
                                  autoComplete="off"
                                />
                                <label className="form-label">
                                  Name <span>*</span>
                                </label>
                              </div>
                              <ErrorMessage
                                component={"div"}
                                name="name"
                                className="text-left fs-14 fw-medium px-2 error_msg"
                              />
                            </div>

                            <div class="form-group mb-4">
                              <div className="form-floating">
                                <Field
                                  type="text"
                                  name="username"
                                  placeholder={t("username")}
                                  className="form-control"
                                  validate={handleUsernameValidation}
                                  autoComplete="off"
                                />
                                <label className="form-label">
                                  Username <span>*</span>
                                </label>
                              </div>
                              <ErrorMessage
                                component={"div"}
                                name="username"
                                className="text-left fs-14 fw-medium px-2 error_msg"
                                style={{ textAlign: "left" }}
                              />
                              {props.validation.isInValid && isvalidUserName ? (
                                <div class="text-left fs-14 fw-medium px-2 error_msg">
                                  {props.validation.errorMessage ??
                                    t("username_already_taken")}
                                </div>
                              ) : (
                                ""
                              )}
                              {props.validation.isValid && isvalidUserName ? (
                                <div class="text-success text-right fs-14 fw-medium px-2">
                                  {t("looks_good")}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>

                            <div class="form-group mb-4">
                              <div className="form-floating">
                                <Field
                                  type="email"
                                  name="email"
                                  placeholder={t("email_address")}
                                  className="form-control"
                                  autoComplete="off"
                                />
                                <label className="form-label">
                                  Email <span>*</span>
                                </label>
                              </div>
                              <ErrorMessage
                                component={"div"}
                                name="email"
                                className="text-left fs-14 fw-medium px-2 error_msg"
                              />
                            </div>

                            <div className="form-group mb-4">
                              <div className="form-floating">
                                <Field
                                  type={
                                    loginPasswordVisible ? "text" : "password"
                                  }
                                  name="password"
                                  placeholder={t("password")}
                                  className="form-control"
                                  autoComplete="off"
                                />
                                <div class="input-group-append">
                                  <div
                                    onClick={() =>
                                      setLoginPasswordVisible(
                                        !loginPasswordVisible
                                      )
                                    }
                                    className="password-eye"
                                  >
                                    {loginPasswordVisible ? (
                                      <i className="fas fa-eye-slash align-self-center"></i>
                                    ) : (
                                      <i className="fas fa-eye align-self-center"></i>
                                    )}
                                  </div>
                                </div>
                                <label className="form-label">
                                  Password <span>*</span>
                                </label>
                              </div>
                              <ErrorMessage
                                component={"div"}
                                name="password"
                                className="text-left fs-14 fw-medium px-2 error_msg"
                              />
                            </div>

                            {configuration.get(
                              "configData.is_referral_enabled"
                            ) == 1 ? (
                              <>
                                <div class="form-group mb-4">
                                  <div className="form-floating">
                                    <Field
                                      type="text"
                                      name="referral_code"
                                      placeholder={t("referral_code_optional")}
                                      value={referralCode}
                                      className="form-control"
                                      onChange={(e) =>
                                        setReferralCode(e.target.value)
                                      }
                                    />
                                    <label className="form-label">
                                      Referral Code
                                    </label>
                                  </div>
                                  <ErrorMessage
                                    component={"div"}
                                    name="referral_code"
                                    className="text-danger text-right fs-14 fw-medium"
                                  />
                                  <div className="check-referral-link pt-0">
                                    <a
                                      href="#"
                                      onClick={checkReferralCode}
                                      className="primary fs-14 px-2 fw-semibold"
                                    >
                                      {t("check_referral_code_valid")}
                                    </a>
                                  </div>
                                </div>
                              </>
                            ) : null}
                            <Button
                              type="submit"
                              className="btn wf-submit"
                              disabled={props.signup.buttonDisable}
                            >
                              {props.signup.loadingButtonContent !== null
                                ? props.signup.loadingButtonContent
                                : "Sign up"}
                            </Button>

                            <div className="my-1 text-center">
                              <p className="text-center fs-13 ">
                                {t("signing_up_confirmation")}{" "}
                                <Link
                                  to={`/page/terms`}
                                  target="_blank"
                                  className="primary fw-semibold"
                                >
                                  {t("terms_conditions")}
                                </Link>{" "}
                                {t("and")}{" "}
                                <Link
                                  to={`/page/privacy`}
                                  target="_blank"
                                  className="primary fw-semibold"
                                >
                                  {t("privacy_policy")}
                                </Link>
                                {", "}
                                {t("age")}
                              </p>
                            </div>

                            <div className="my-5 text-center">
                              <p className="fs-16 fw-semibold">
                                {t("already_have_an_account")}
                                <Link
                                  className="signup primary fs-16 fw-semibold"
                                  to="/authentication/login"
                                  id="signin"
                                >
                                  {" "}
                                  {t("login")}
                                </Link>
                              </p>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </>
                  ) : null}
                  {show === "forgotpassword" ? (
                    <Formik
                      initialValues={{
                        email: "",
                      }}
                      validationSchema={forgotPasswordSchema}
                      onSubmit={(values) => handleForgotPassword(values)}
                    >
                      {({ touched, errors, isSubmitting, setFieldValue }) => (
                        <Form noValidate>
                          {/* <ConnectedFocusError /> */}
                          <div class="form-group mb-4">
                            <div className="form-floating">
                              <Field
                                type="email"
                                name="email"
                                placeholder={t("email_address")}
                                className="form-control"
                              />
                              <label className="form-label">
                                Email <span>*</span>
                              </label>
                            </div>
                            <ErrorMessage
                              component={"div"}
                              name="email"
                              className="text-danger text-right fs-14 fw-medium"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="btn wf-submit"
                            disabled={props.forgotPassword.buttonDisable}
                          >
                            {props.forgotPassword.loadingButtonContent !== null
                              ? props.forgotPassword.loadingButtonContent
                              : t("request_reset_link")}
                          </Button>
                          <div className="my-5 text-center">
                            <p className="fs-16 fw-semibold">
                              {t("already_have_an_account")}
                              <Link
                                className="signup primary fs-16 fw-semibold"
                                to="#"
                                id="signin"
                                onClick={(event) => {
                                  event.preventDefault();
                                  setShow("login");
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                              >
                                {" "}
                                {t("login")}
                                {/* {t("login_for")}{" "} */}
                                {/* {configuration.get("configData.site_name")} */}
                              </Link>
                            </p>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
         {/* Footer */}
        <div className="wf-footer">
          <div className="wf-container">
            <ul className="list-unstyled d-flex flex-wrap gap-x-3 footer--links align-items-center justify-content-center mb-1">
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  Terms and Conditions
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  Privacy Policy
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  Community Guidelines
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  Support
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  FAQ
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  DMCA
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link to="#" className="fs-12 fw-medium text-white">
                  USC 2257
                </Link>
              </li>
              <li
                className="d-flex align-items-center"
                style={{ maxHeight: "33px" }}
              >
                <span className="fs-12 fw-medium d-flex align-items-center ml-2 gap-2">
                  We accept:
                  <Image
                    src="/images/visa-logo.png"
                    alt="visa"
                    className="wf-visa-icon"
                  />
                  <Image
                    src="/images/master-card.png"
                    alt="master card"
                    className="wf-master-icon"
                  />
                </span>
              </li>
            </ul>

            <p className="text-center text-white fs-12 fw-medium">
              &copy; 2023 Shift Holding Ltd. 2nd Floor College House, 17 King
              Edwards Road, Rulslip, london, United Kingdom, HA4 7AE
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => ({
  login: state.users.loginInputData,
  signup: state.users.registerInputData,
  forgotPassword: state.users.forgotPasswordInputData,
  validation: state.users.validationInputData,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(LandingPageIndex));
