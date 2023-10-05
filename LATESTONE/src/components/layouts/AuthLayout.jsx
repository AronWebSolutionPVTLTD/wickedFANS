import React, { useState } from "react";
import AuthHeader from "./Header/AuthHeader";
import { Notify } from "react-redux-notify";
import LandingFooter from "./Footer/LandingFooter";
import { TumblrShareButton } from "react-share";

const AuthLayout = (props) => {
  const [themeState, setThemeState] = useState(
    localStorage.getItem("theme") !== "" &&
      localStorage.getItem("theme") !== null &&
      localStorage.getItem("theme") !== undefined &&
      localStorage.getItem("theme") === "dark" ?
      true
      : false
  );
  console.log(themeState,"dfgdfklgnk")
  return (
    <div className={`${!themeState ? "dark-mode" : ""}`}>
    <Notify position="TopRight" />
       {/* <AuthHeader /> */}
      <div >  
        {React.cloneElement(props.children)}
      </div>
      {/* className="landing-main-wrapper" */}
     {/* <LandingFooter /> */}
   </div>
  )
}

export default AuthLayout;
