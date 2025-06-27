
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Resources.css';

function Resources() {
  const [filters, setFilters] = useState({
    course: '',
    year: '',
    semester: '',
    subject: '',
    type: '',
  });
  const [resources, setResources] = useState([]);

  // Handle dropdown value changes
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Fetch resources when filters change
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = new URLSearchParams();
        for (let key in filters) {
          if (filters[key]) params.append(key, filters[key]);
        }
        const res = await axios.get(`http://localhost:5000/api/resources?${params}`);
        setResources(res.data);
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    };
    fetchResources();
  }, [filters]);

  return (
    <div className="resources-page">
      <h2 className="page-title">📚 View Resources - NotesMittar</h2>

      {/* Filters */}
      <div className="filters">
        <select name="course" onChange={handleChange} defaultValue="">
          <option value="">Select Course</option>
          <option value="AIML">AIML</option>
          <option value="CSE">CSE</option>
        </select>

        <select name="year" onChange={handleChange} defaultValue="">
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select name="semester" onChange={handleChange} defaultValue="">
          <option value="">Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}> {i + 1} </option>
          ))}
        </select>

        <select name="subject" onChange={handleChange} defaultValue="">
          <option value="">Select Subject</option>
          <option value="Programming with Python">Programming with Python</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="DBMS">DBMS</option>
        </select>

        <select name="type" onChange={handleChange} defaultValue="">
          <option value="">Select Type</option>
          <option value="Notes">Notes</option>
          <option value="Books">Books</option>
          <option value="PYQs">PYQs</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="resource-list">
        {resources.length === 0 ? (
          <p>No resources found.</p>
        ) : (
          resources.map((res) => (
            <div className="resource-card" key={res._id}>
              <div className="resource-info">
                <h3>{res.title}</h3>
                <p>Uploaded by: <strong>{res.author}</strong></p>
              </div>
              <a
                href={res.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Resources;
