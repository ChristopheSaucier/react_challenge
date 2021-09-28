import React from "react";
import "../CSS/ContentCard.css";

const ContentCard = ({ contentData = [] }) => {
  const cardStyle = {
    display: "flex",
    flexDirection: "row",
    borderBottom: "2px solid lightgrey",
    fontSize: "1.5em",
    fontWeight: "bold",
    margin: "20px",
    paddingBottom: "10px",
  };

  const [commentData, coreData] = contentData;
  const { thumbnails } = coreData;
  const [compact, medium, large] = thumbnails;

  let contentText = "";
  let contentURL = "";
  let base = "https://www.ign.com/";

  if (coreData.contentType === "article") {
    //dealing with article
    contentText = coreData.metadata.headline;
    contentURL = `${base}articles/${coreData.metadata.slug}`;
  } else if (coreData.contentType === "video") {
    //dealing with videos
    contentText = coreData.metadata.title;
    contentURL = `${base}videos/${coreData.metadata.slug}`;
  } else {
    //should throw an error
    contentText = "ERROR: Issue obtaining title";
  }

  const publicationTime = new Date(coreData.metadata.publishDate);
  const currentTime = new Date();
  let timeSincePublicationSeconds =
    Math.abs(currentTime.getTime() - publicationTime.getTime()) / 1000;
  let formattedTime = "";

  if (timeSincePublicationSeconds / 60 < 60) {
    //minutes
    formattedTime = Math.round(timeSincePublicationSeconds / 60) + "m";
  } else if (timeSincePublicationSeconds / 3600 < 24) {
    //hours
    formattedTime = Math.round(timeSincePublicationSeconds / 3600) + "h";
  } else {
    //days
    formattedTime = Math.round(timeSincePublicationSeconds / 86400) + "d";
  }

  function showVideoDuration() {
    if (coreData.contentType === "video") {
      let durationSeconds = coreData.metadata.duration;
      let minutes = Math.floor(durationSeconds / 60);
      let seconds = durationSeconds - minutes * 60;
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return (
        <div className="videoDuration">
          <div>
            {minutes}:{seconds}
          </div>
        </div>
      );
    }
  }

  return (
    <div style={cardStyle}>
      <div className="contentImageDiv">
        <a href={contentURL} target="_blank" className="contentImageAnchor">
          <img src={medium.url} className="contentImage"></img>
          {showVideoDuration()}
        </a>
      </div>
      <div>
        <div className="subText">
          {formattedTime} - {commentData.count} Comments
        </div>

        <div className="contentTextDiv">
          <a href={contentURL} target="_blank" className="contentTextAnchor">
            {contentText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
