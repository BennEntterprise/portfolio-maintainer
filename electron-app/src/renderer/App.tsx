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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Electron + R + Tailwind CSS
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SecondComponent />
        </div>
      </div>
    </div>
  );
}

export default App;

const SecondComponent = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        Second Edited Component
      </h2>
      <p className="text-gray-600 mb-6">
        This component is now styled with Tailwind CSS!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          <h3 className="font-medium">Red Card</h3>
          <p>A sample card with red styling</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg">
          <h3 className="font-medium">Green Card</h3>
          <p>A sample card with green styling</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
          <h3 className="font-medium">Blue Card</h3>
          <p>A sample card with blue styling</p>
        </div>
      </div>
      <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
        Test Button
      </button>
    </div>
  );
};
