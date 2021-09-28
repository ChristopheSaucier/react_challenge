import React, { useState, useRef } from "react";
import Listing from "./Listing";
import SelectionButton from "./SelectionButton";
import "../CSS/TitlePage.css";

function TitlePage() {
  //UPDATES WHEN THE USER PRESSES ANY OF THE SELECTION BUTTONS
  const [endpoint, setEndpoint] = useState("/videos");

  //DETERMINES WHICH SELECTION BUTTON TO HIGHLIGHT
  const selectedButton = useRef("Videos");

  //RUNS WHEN ANY OF THE SELECTION BUTTONS ARE PRESSED
  function handleButtonPress(newEndpoint = "/videos", buttonType = "videos") {
    selectedButton.current = buttonType;
    setEndpoint(newEndpoint);
  }

  return (
    <div className="titlePage">
      <div className="title">Latest News</div>
      <div className="content">
        <div className="buttonArea">
          <SelectionButton
            text="Latest"
            whenClicked={() => handleButtonPress("./latest", "Latest")}
            clickedState={selectedButton.current}
          />
          <SelectionButton
            text="Videos"
            whenClicked={() => handleButtonPress("/videos", "Videos")}
            clickedState={selectedButton.current}
          />
          <SelectionButton
            text="Articles"
            whenClicked={() => handleButtonPress("/articles", "Articles")}
            clickedState={selectedButton.current}
          />
        </div>
        <div className="listing">
          <Listing query={endpoint} />
        </div>
      </div>
    </div>
  );
}

export default TitlePage;
