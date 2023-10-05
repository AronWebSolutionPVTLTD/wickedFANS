import React from "react";
import ContentLoader from "react-content-loader";

const StorySliderLoader = (props) => (
  <ContentLoader
    speed={2}
    width={500}
    height={200}
    viewBox="0 0 530 200"
    // backgroundColor="#f3f3f3"
    // foregroundColor="#ecebeb"
    backgroundColor={
      localStorage.getItem("theme") === "dark" ? "#090909" : "#f3f3f3"
    }
    foregroundColor={
      localStorage.getItem("theme") === "dark" ? "#151515" : "#ecebeb"
    }
    {...props}
  >
    <circle cx="50" cy="80" r="40" />
    <rect x="5" y="145" rx="0" ry="0" width="85" height="15" />
    <circle cx="160" cy="80" r="40" />
    <rect x="115" y="145" rx="0" ry="0" width="85" height="15" />
    <circle cx="270" cy="80" r="40" />
    <rect x="225" y="145" rx="0" ry="0" width="85" height="15" />
    <circle cx="380" cy="80" r="40" />
    <rect x="335" y="145" rx="0" ry="0" width="85" height="15" />
    <circle cx="490" cy="80" r="40" />
    <rect x="445" y="145" rx="0" ry="0" width="85" height="15" />
  </ContentLoader>
);

export default StorySliderLoader;
