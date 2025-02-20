import React, { useState } from "react";
import axios from "axios";

const ColorExtractor = () => {
  const [url, setUrl] = useState("");
  const [colors, setColors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchColors = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post("/api/extract-colors", { url }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setColors(response.data.colors);
    } catch (err) {
      setError("Failed to extract colors. Ensure the URL is valid and CORS is properly configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Squarespace Color Mapper</h1>
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded w-80 mb-4"
      />
      <button
        onClick={fetchColors}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Extracting..." : "Extract Colors"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-16 h-16 rounded flex items-center justify-center relative group"
            style={{ backgroundColor: color }}
          >
            <span className="absolute bottom-2 text-xs bg-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 shadow-md">
              {color}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorExtractor;

