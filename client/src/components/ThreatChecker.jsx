import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import keywords from '../../../ai_models/keywords.json'; // Assuming this is the path to your keywords file

function ThreatDetection() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [keywordMessage, setKeywordMessage] = useState("");

  // Maintain a list of all keywords (initial + added)
  const [allKeywords, setAllKeywords] = useState(keywords.threatWords || []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        text,
      });

      // Local keyword threat check
      const localThreat = allKeywords.some((word) =>
        text.toLowerCase().includes(word)
      );

      setResult({
        ...response.data,
        threat: response.data.threat || localThreat, // true if backend OR keyword match
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to get result" });
    }

    setLoading(false);
  };

  const handleKeywordSubmit = async (e) => {
    e.preventDefault();
    setKeywordMessage("");

    const trimmedKeyword = keyword.trim().toLowerCase();
    if (!trimmedKeyword) return;

    try {
      const response = await axios.post("http://localhost:5000/add-keyword", {
        keyword: trimmedKeyword,
      });

      setKeywordMessage(response.data.message);
      setKeyword(""); // clear input

      // Update local keyword list if not already included
      if (!allKeywords.includes(trimmedKeyword)) {
        setAllKeywords((prev) => [...prev, trimmedKeyword]);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setKeywordMessage(error.response.data.message);
      } else {
        setKeywordMessage("❌ Failed to add keyword");
      }
    }
  };

  return (
    <div className="container px-5 border rounded mt-5">
      <h1 className="text-center mb-4">Threat Detection</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-3"
          value={text}
          onChange={handleChange}
          placeholder="Enter message"
          rows="4"
        ></textarea>
        <button type="submit" disabled={loading} className="btn btn-primary mb-3">
          {loading ? "Processing..." : "Check for Threat"}
        </button>
      </form>

      {result && (
        <div className="alert alert-info">
          <h5>Prediction Result:</h5>
          <p><strong>Text:</strong> {result.text}</p>
          <p><strong>Threat Detected:</strong> {result.threat ? "Yes 🚨" : "No ✅"}</p>
        </div>
      )}

      <hr />

      <form onSubmit={handleKeywordSubmit}>
        <div className="form-group mb-2">
          <label>Add New Keyword:</label>
          <input
            type="text"
            className="form-control"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword..."
          />
        </div>
        <button type="submit" className="btn btn-success mb-2">Add Keyword</button>
        {keywordMessage && (
          <div className="alert alert-secondary mt-2">{keywordMessage}</div>
        )}
      </form>
    </div>
  );
}

export default ThreatDetection;
