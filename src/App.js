import React from "react";  // Make sure React is imported
import "./App.css";
import Main from "./components/Main";  // ✅ Fixed relative path

function App() {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
