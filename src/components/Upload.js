import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const fileId = data.fileId;
        navigate(`/map/${fileId}`);
      } else {
        setError('File upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="topbar">
        <span className="logo">Spatial KML Viewer</span>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
      <div className="form-container">
        <h2>Upload KML File</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="kmlFile">Choose KML file:</label>
            <input
              id="kmlFile"
              type="file"
              accept=".kml"
              onChange={handleFileChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;