import * as React from "react";
import { render } from "react-dom";
import Toolbar from "./Toolbar";

import "./styles.scss";

function App() {
  const giveAlert = action => alert(`${action} was clicked!`);
  return (
    <div className="App">
      <h1>A Small Toolbar Component Using React-Spring</h1>
      <h2>Click the Arrow!</h2>
      <h2>
        Find more icons at{" "}
        <a href="https://material.io/resources/icons/?style=baseline">
          Material UI Icons
        </a>
      </h2>
      <Toolbar
        onIconClicked={giveAlert}
        icons={[
          {
            icon: "MdPlayArrow",
            action: "play"
          },
          {
            icon: "MdPause",
            action: "pause"
          },
          {
            icon: "MdMusicNote",
            action: "music note"
          },
          {
            icon: "MdLocalCafe",
            action: "cafe"
          },
          {
            icon: "MdLocalAirport",
            action: "airport"
          },
          {
            icon: "MdPhoto",
            action: "photo"
          },
          {
            icon: "MdCancel",
            action: "cancel"
          }
        ]}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
