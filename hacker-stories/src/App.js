import React from "react";
function App() {
  function getTitle(title) {
    return title;
  }
  return (
    <div>
      <h1>Hi {getTitle("Red")} </h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
