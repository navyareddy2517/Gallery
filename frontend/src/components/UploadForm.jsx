import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5111/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Call onUpload callback to update parent gallery
      onUpload(res.data.url);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  );
};

export default UploadForm;
