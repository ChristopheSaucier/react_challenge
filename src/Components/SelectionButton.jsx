import React, { useState, useEffect } from "react";
import "../CSS/Button.css";

const SelectionButton = ({ text = "", whenClicked, clickedState = false }) => {
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
