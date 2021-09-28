import React from "react";
import "../CSS/SelectionButton.css";

const SelectionButton = ({ text = "", whenClicked, clickedState = false }) => {
  //USED TO CHANGE THE CSS FOR THE SELECTION BUTTON TO BE EITHER SELECTED OR NOT
  let buttonClass = "selectButton";
  if (clickedState === text) {
    buttonClass = "selectedButton";
  } else {
    buttonClass = "selectButton";
  }
  return (
    <div>
      <button className={buttonClass} onClick={whenClicked}>
        {text}
      </button>
    </div>
  );
};

export default SelectionButton;
