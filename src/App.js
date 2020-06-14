import React from "react";
import News from "./components/news/News";

function App() {
  const columns = ["Comments", "Vote Count", "UpVote", "News Details"];
  return (
    <div className="container">
      <News columns={columns} />
    </div>
  );
}

export default App;
