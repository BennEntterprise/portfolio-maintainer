import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // fetch("http://localhost:3001/api/hello")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     setMessage(data.message);
    //   });
    console.log("Render process for App.tsx (first load) is running");
  }, []);

  return <SecondComponent />;
}

export default App;

const SecondComponent = () => {
  return <h2>Second Edited Component</h2>;
};
