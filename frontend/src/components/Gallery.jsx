import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [sections, setSections] = useState({});
  const [newSection, setNewSection] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const API_URL = "http://localhost:5111/api/images";

  // 🖼 Fetch images from backend
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  // 📤 Upload new image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchImages();
      setFile(null);
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };

  // 🗑 Delete image
  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_URL}/${filename}`);
      setImages(images.filter((img) => !img.includes(filename)));
    } catch (err) {
      console.error("Error deleting image", err);
    }
  };

  // ❤️ Toggle favorite
  const toggleFavorite = (filename) => {
    setFavorites((prev) =>
      prev.includes(filename)
        ? prev.filter((fav) => fav !== filename)
        : [...prev, filename]
    );
  };

  // ➕ Create new section
  const addSection = () => {
    if (!newSection.trim()) return;
    setSections((prev) => ({
      ...prev,
      [newSection.trim()]: [],
    }));
    setNewSection("");
  };

  // 🏷 Add image to section
  const addImageToSection = (filename, sectionName) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: [...(prev[sectionName] || []), filename],
    }));
  };

  // 🗑 Remove section
  const deleteSection = (sectionName) => {
    const updated = { ...sections };
    delete updated[sectionName];
    setSections(updated);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const displayedImages =
    activeTab === "favorites"
      ? images.filter((url) => favorites.includes(url.split("/").pop()))
      : activeTab === "images"
      ? images
      : [];

  return (
    <div className="gallery-container">
      {/* Header */}
      <header className="gallery-header">
        <h1> Cloud Gallery</h1>
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Upload</button>
        </form>
      </header>

      {/* Images / Favorites View */}
      {(activeTab === "images" || activeTab === "favorites") && (
        <div className="image-grid">
          {displayedImages.length > 0 ? (
            displayedImages.map((url, index) => {
              const filename = url.split("/").pop();
              const isFav = favorites.includes(filename);

              return (
                <div key={index} className="image-card">
                  <img src={`http://localhost:5111${url}`} alt={`img-${index}`} />

                  <div className="overlay">
                    <button
                      className={`icon-btn ${isFav ? "fav" : ""}`}
                      onClick={() => toggleFavorite(filename)}
                    >
                      ❤️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(filename)}
                    >
                      🗑️
                    </button>
                    <select
                      className="section-select"
                      value=""
                      onChange={(e) =>
                        addImageToSection(filename, e.target.value)
                      }
                    >
                      <option value="">➕ Section</option>
                      {Object.keys(sections).map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isFav && <div className="fav-badge">❤️</div>}
                </div>
              );
            })
          ) : (
            <p className="no-images">
              {activeTab === "favorites"
                ? "No favorites yet ❤️"
                : "No images uploaded yet."}
            </p>
          )}
        </div>
      )}

      {/* Menu View (Sections) */}
      {activeTab === "menu" && (
        <div className="menu-section">
          <h2>📂 Your Albums</h2>
          <div className="add-section">
            <input
              type="text"
              value={newSection}
              placeholder="New album name..."
              onChange={(e) => setNewSection(e.target.value)}
            />
            <button onClick={addSection}>Add</button>
          </div>

          {Object.keys(sections).length === 0 ? (
            <p className="no-images">No albums yet. Create one!</p>
          ) : (
            <div className="section-list">
              {Object.keys(sections).map((sectionName) => (
                <div key={sectionName} className="section-block">
                  <div className="section-header">
                    <h3>{sectionName}</h3>
                    <button
                      className="delete-section"
                      onClick={() => deleteSection(sectionName)}
                    >
                      ❌
                    </button>
                  </div>
                  <div className="section-images">
                    {sections[sectionName].length > 0 ? (
                      sections[sectionName].map((filename, i) => {
                        const imageUrl = images.find((img) =>
                          img.endsWith(filename)
                        );
                        return (
                          imageUrl && (
                            <img
                              key={i}
                              src={`http://localhost:5111${imageUrl}`}
                              alt={filename}
                            />
                          )
                        );
                      })
                    ) : (
                      <p className="empty-album">No images yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sticky Nav */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === "images" ? "active" : ""}`}
          onClick={() => setActiveTab("images")}
        >
          🖼️ <span>Images</span>
        </button>
        <button
          className={`nav-btn ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          ❤️ <span>Favorites</span>
        </button>
        <button
          className={`nav-btn ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          ☰ <span>Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default Gallery;
