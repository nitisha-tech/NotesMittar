import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChevronLeft, BookOpen, FileText,
<<<<<<< HEAD
  Calendar, GraduationCap, Download, Search, Eye
=======
  Calendar, GraduationCap, Download, Search
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
} from 'lucide-react';
import '../style/Resources.css';
import Navbar from '../component/Navbar';
import { useNavigate } from 'react-router-dom';

function Resources() {
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
  const [stage, setStage] = useState(1);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [course, setCourse] = useState('AIML');
  const [year, setYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('Notes');
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Subject mapping by semester for AIML course
=======
  const [searchTerm, setSearchTerm] = useState('');

  // Subject mapping by semester
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
  const subjectsBySemester = {
    "Sem 1": [
      "Probability and Statistics",
      "EVS",
      "IT Workshop",
      "Programming with Python",
      "Communication Skills"
    ],
    "Sem 2": [
      "Applied Maths",
      "Applied Physics",
      "Introduction to DS",
      "Data Structures",
      "OOPS"
    ],
    "Sem 3": [
      "Discrete Structures",
      "DBMS",
      "AI",
      "Software Engineering",
      "MSE",
      "Numerical Method"
    ],
    "Sem 4": [
      "Disaster Management",
      "Computer Networks",
      "Operation Management",
      "Design and Analysis of Algorithm",
      "Operating System",
      "Machine Learning"
<<<<<<< HEAD
    ]
  };

  // Get user credentials for tracking
  const getUserCredentials = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  return {
    username: user.username,
    email: user.email
  };
};


  // Function to record view
  const recordView = async (resourceId) => {
    try {
      const credentials = getUserCredentials();
      if (!credentials.username) {
        console.warn('User not logged in, cannot record view');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/record-view/${resourceId}`,
        {},
        {
          headers: {
            username: credentials.username,
            email: credentials.email,
            'session-id': sessionStorage.getItem('sessionId') || Math.random().toString(36),
          }
        }
      );
     
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  // Function to handle view action
  const handleView = async (resource) => {
    try {
      // Record the view first
      await recordView(resource._id);
      
      // Update local state to reflect the view count increase
      setResources(prevResources => 
        prevResources.map(r => 
          r._id === resource._id 
            ? { ...r, viewCount: (r.viewCount || 0) + 1 }
            : r
        )
      );

      // Open the file in a new tab
      window.open(resource.fileUrl, '_blank');
    } catch (error) {
      console.error('Error handling view:', error);
      // Still open the file even if tracking fails
      window.open(resource.fileUrl, '_blank');
    }
  };

  // Function to handle download action
  const handleDownload = async (resource) => {
    try {
      // Update local state to reflect the download count increase
      setResources(prevResources => 
        prevResources.map(r => 
          r._id === resource._id 
            ? { ...r, downloadCount: (r.downloadCount || 0) + 1 }
            : r
        )
      );

      // Create download link with download parameter
      const downloadUrl = `${resource.fileUrl}?download=true`;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${resource.title}.pdf`;


      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
     
    } catch (error) {
      console.error('Error handling download:', error);
      // Fallback to direct link
      window.open(`${resource.fileUrl}?download=true`, '_blank');
    }
  };

  // Fetch resources when we reach stage 5
  useEffect(() => {
=======
    ],
    "Sem 5": [
      "Subject 1", "Subject 2", "Subject 3", "Subject 4"
    ],
    "Sem 6": [
      "Subject 1", "Subject 2", "Subject 3", "Subject 4"
    ],
    "Sem 7": [
      "Subject 1", "Subject 2", "Subject 3", "Subject 4"
    ],
    "Sem 8": [
      "Subject 1", "Subject 2", "Subject 3", "Subject 4"
    ]
  };

  // Fix 1: In your Resources.jsx - Update the useEffect to convert year to string
useEffect(() => {
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (course) params.append('course', course);
        if (semester !== null) params.append('semester', `Sem ${semester}`);
        if (subject) params.append('subject', subject);
        if (type) params.append('type', type);

<<<<<<< HEAD
        // Only append year if not null and if it's PYQs
        if (year !== null && type === 'PYQs') {
          // For PYQs, we might want to filter by year
          // For now, let's include all years for PYQs
        }

        const res = await axios.get(`http://localhost:5000/api/resources?${params.toString()}`);
        setResources(res.data);

      } catch (err) {
        console.error('Failed to fetch resources:', err);
        if (err.response?.status === 404) {
          setError('No resources found for the selected criteria.');
        } else {
          setError('Unable to load resources at this moment. Please try again later.');
        }
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
=======
        // Only append year if not null
        if (year !== null && (type === 'PYQs' ? year >= 2020 : true)) {
          params.append('year', year.toString());
        }

        console.log('Fetching with params:', params.toString());
        const res = await axios.get(`http://localhost:5000/api/resources?${params.toString()}`);
        console.log("Fetched resources:", res.data);
        setResources(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setError('Unable to load resources at this moment.');
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
      }
    };

    if (stage === 5) {
      fetchResources();
    }
  }, [stage, course, year, semester, subject, type]);

  const showYears = () => setStage(2);
<<<<<<< HEAD

=======
  
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
  const showSemesters = (selectedYear) => {
    const semMap = {
      1: [1, 2],
      2: [3, 4],
<<<<<<< HEAD
      3: [5, 6], // These won't have subjects defined yet
      4: [7, 8], // These won't have subjects defined yet
=======
      3: [5, 6],
      4: [7, 8],
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    };
    setYear(selectedYear);
    setSemesters(semMap[selectedYear] || []);
    setStage(3);
  };

  const showSubjects = (sem) => {
    setSemester(sem);
    const semesterKey = `Sem ${sem}`;
<<<<<<< HEAD
    const availableSubjects = subjectsBySemester[semesterKey] || [];

    // If no subjects are defined for this semester, show an empty array
    setSubjects(availableSubjects);
=======
    setSubjects(subjectsBySemester[semesterKey] || []);
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    setStage(4);
  };

  const showResources = (sub) => {
    setSubject(sub);
    setStage(5);
  };

  const goBack = () => {
    if (stage > 1) {
      setStage(stage - 1);
<<<<<<< HEAD
      // Clear error when going back
      setError(null);
=======
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    }
  };

  const getBreadcrumb = () => {
    const parts = [];
    if (course) parts.push(course);
    if (year) parts.push(`Year ${year}`);
    if (semester) parts.push(`Sem ${semester}`);
    if (subject) parts.push(subject);
    return parts.join(' > ');
  };

  const getStageIcon = () => {
    switch (stage) {
      case 1: return <GraduationCap size={32} />;
      case 2: return <Calendar size={32} />;
      case 3: return <BookOpen size={32} />;
      case 4: return <FileText size={32} />;
      case 5: return <Download size={32} />;
      default: return <BookOpen size={32} />;
    }
  };

  // Enhanced icon mapping for subjects
  const getSubjectIcon = (subject, index) => {
    const iconMap = {
      'Probability and Statistics': '📊',
      'EVS': '🌱',
      'IT Workshop': '⚡',
      'Programming with Python': '🐍',
      'Communication Skills': '💬',
      'Applied Maths': '📐',
      'Applied Physics': '⚛️',
      'Introduction to DS': '🔬',
      'Data Structures': '🏗️',
      'OOPS': '☕',
      'Discrete Structures': '🧮',
      'DBMS': '🗄️',
      'AI': '🤖',
      'Software Engineering': '⚙️',
      'MSE': '🔧',
      'Numerical Method': '🔢',
      'Disaster Management': '🚨',
      'Computer Networks': '🌐',
      'Operation Management': '📈',
      'Design and Analysis of Algorithm': '🔍',
      'Operating System': '🖥️',
      'Machine Learning': '🧠'
    };
<<<<<<< HEAD

=======
    
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    return iconMap[subject] || ['📚', '🔬', '💻', '🧠', '⚡', '🎯', '🔧', '📈', '🌟', '🎨'][index % 10];
  };

  const filteredResources = resources.filter(resource =>
    resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<<<<<<< HEAD
    <>
      <Navbar />
      <div className="resources-container">

        {/* Header with back button */}
        {stage > 1 && (
          <button onClick={goBack} className="floating-back-button">
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
=======
    <div className="resources-container">
      {/* Header */}
      <div className="resources-header">
        <div className="header-content">
          <div className="header-left">
            {stage > 1 && (
              <button onClick={goBack} className="back-button">
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
            )}
            <div className="header-info">
              <div className="header-icon">
                {getStageIcon()}
              </div>
              <div>
                <h1 className="header-title">
                  <div className="title-icon">📚</div>
                  NotesMittar Resources
                </h1>
                {getBreadcrumb() && (
                  <p className="breadcrumb">{getBreadcrumb()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Stage 1: Choose Course */}
        {stage === 1 && (
          <div className="stage-container">
            <h2 className="stage-title">Choose Your Course</h2>
            <p className="stage-description">Select your course to access study materials</p>
            <div className="single-card-container">
              <div className="course-card" onClick={showYears}>
                <div className="course-icon">
                  <div className="icon-wrapper">
                    <div className="ai-icon">🤖</div>
                    <div className="ml-icon">🧠</div>
                  </div>
                </div>
                <h3 className="course-title">AI & ML</h3>
                <p className="course-subtitle">Artificial Intelligence & Machine Learning</p>
                <div className="course-action">
                  <span>Explore Resources</span>
                  <div className="arrow-wrapper">
                    <ChevronLeft size={16} className="arrow-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Choose Year */}
        {stage === 2 && (
          <div className="stage-container">
            <h2 className="stage-title">Select Academic Year</h2>
            <p className="stage-description">Choose your current year of study</p>
            <div className="year-grid">
              {[1, 2, 3, 4].map(y => (
                <div key={y} className="year-card" onClick={() => showSemesters(y)}>
                  <div className="year-icon">
                    <div className="year-icon-wrapper">
                      {y === 1 && <div className="seedling-icon">🌱</div>}
                      {y === 2 && <div className="leaf-icon">🌿</div>}
                      {y === 3 && <div className="tree-icon">🌳</div>}
                      {y === 4 && <div className="graduation-icon">🎓</div>}
                    </div>
                  </div>
                  <h3 className="year-title">Year {y}</h3>
                  <p className="year-subtitle">
                    {y === 1 ? 'Foundation Year' : y === 2 ? 'Core Concepts' : y === 3 ? 'Advanced Topics' : 'Specialization'}
                  </p>
                  <div className="card-action">
                    <span>Continue</span>
                    <div className="arrow-wrapper">
                      <ChevronLeft size={12} className="arrow-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Choose Semester */}
        {stage === 3 && (
          <div className="stage-container">
            <h2 className="stage-title">Choose Semester</h2>
            <p className="stage-description">Select the semester for Year {year}</p>
            <div className="semester-grid">
              {semesters.map(sem => (
                <div key={sem} className="semester-card" onClick={() => showSubjects(sem)}>
                  <div className="semester-icon">
                    <div className="semester-icon-wrapper">
                      {sem % 2 === 1 ? (
                        <div className="autumn-icon">🍂</div>
                      ) : (
                        <div className="spring-icon">🌸</div>
                      )}
                    </div>
                  </div>
                  <h3 className="semester-title">Semester {sem}</h3>
                  <p className="semester-subtitle">
                    {sem % 2 === 1 ? 'Odd Semester' : 'Even Semester'}
                  </p>
                  <div className="card-action">
                    <span>View Subjects</span>
                    <div className="arrow-wrapper">
                      <ChevronLeft size={12} className="arrow-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 4: Choose Subject */}
        {stage === 4 && (
          <div className="stage-container">
            <h2 className="stage-title">Select Subject</h2>
            <p className="stage-description">Choose the subject you want to study</p>
            <div className="subject-grid">
              {subjects.map((sub, index) => (
                <div key={sub} className="subject-card" onClick={() => showResources(sub)}>
                  <div className="subject-icon">
                    <div className="subject-icon-wrapper">
                      {getSubjectIcon(sub, index)}
                    </div>
                  </div>
                  <h3 className="subject-title">{sub}</h3>
                  <div className="card-action">
                    <span>Access Resources</span>
                    <div className="arrow-wrapper">
                      <ChevronLeft size={12} className="arrow-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 5: View Resources */}
        {stage === 5 && (
          <div className="resources-view-container">
            <div className="resources-view-header">
              <h2 className="resources-view-title">{subject}</h2>
              <p className="resources-view-subtitle">Year {year} • Semester {semester}</p>
            </div>

            {/* Resource Type Tabs */}
            <div className="tabs-container">
              <div className="tabs-wrapper">
                {['Notes', 'Books', 'PYQs'].map(t => (
                  <button
                    key={t}
                    className={`tab ${type === t ? 'active-tab' : ''}`}
                    onClick={() => setType(t)}
                  >
                    <div className="tab-icon">
                      {t === 'Notes' && <span className="notes-icon">📝</span>}
                      {t === 'Books' && <span className="books-icon">📚</span>}
                      {t === 'PYQs' && <span className="pyqs-icon">📋</span>}
                    </div>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="error-container">
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* Debug Info - Remove in production */}
            <div style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px'}}>
              <strong>Debug Info:</strong><br/>
              Course: {course}<br/>
              Year: {year}<br/>
              Semester: Sem {semester}<br/>
              Subject: {subject}<br/>
              Type: {type}<br/>
              Resources found: {filteredResources.length}
            </div>

            {/* Resources List */}
            <div className="resources-list">
              {filteredResources.length > 0 ? (
                filteredResources.map(res => (
                  <div key={res._id} className="resource-card">
                    <div className="resource-info">
                      <h3 className="resource-title">{res.title}</h3>
                      <p className="resource-author">
                        <span className="status-dot"></span>
                        Uploaded by: {res.author}
                      </p>
                    </div>
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-button"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </a>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <div className="empty-icon-wrapper">📭</div>
                  </div>
                  <h3 className="empty-title">No {type} Found</h3>
                  <p className="empty-description">No {type.toLowerCase()} available for the selected subject yet.</p>
                </div>
              )}
            </div>
          </div>
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
        )}

        <div className="main-content">
          {/* Stage 1: Choose Course */}
          {stage === 1 && (
            <div className="stage-container">
              <h2 className="stage-title">Choose Your Course</h2>
              <p className="stage-description">Select your course to access study materials</p>
              <div className="single-card-container">
                <div className="course-card" onClick={showYears}>
                  <div className="course-icon">
                    <div className="icon-wrapper">
                      <div className="ai-icon">🤖</div>
                      <div className="ml-icon">🧠</div>
                    </div>
                  </div>
                  <h3 className="course-title">AI & ML</h3>
                  <p className="course-subtitle">Artificial Intelligence & Machine Learning</p>
                  <div className="course-action">
                    <span>Explore Resources</span>
                    <div className="arrow-wrapper">
                      <ChevronLeft size={16} className="arrow-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Choose Year */}
          {stage === 2 && (
            <div className="stage-container">
              <h2 className="stage-title">Select Academic Year</h2>
              <p className="stage-description">Choose your current year of study</p>
              <div className="year-grid">
                {[1, 2, 3, 4].map(y => (
                  <div key={y} className="year-card" onClick={() => showSemesters(y)}>
                    <div className="year-icon">
                      <div className="year-icon-wrapper">
                        {y === 1 && <div className="seedling-icon">🌱</div>}
                        {y === 2 && <div className="leaf-icon">🌿</div>}
                        {y === 3 && <div className="tree-icon">🌳</div>}
                        {y === 4 && <div className="graduation-icon">🎓</div>}
                      </div>
                    </div>
                    <h3 className="year-title">Year {y}</h3>
                    <p className="year-subtitle">
                      {y === 1 ? 'Foundation Year' : y === 2 ? 'Core Concepts' : y === 3 ? 'Advanced Topics' : 'Specialization'}
                    </p>
                    <div className="card-action">
                      <span>Continue</span>
                      <div className="arrow-wrapper">
                        <ChevronLeft size={12} className="arrow-icon" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 3: Choose Semester */}
          {stage === 3 && (
            <div className="stage-container">
              <h2 className="stage-title">Choose Semester</h2>
              <p className="stage-description">Select the semester for Year {year}</p>
              <div className="semester-grid">
                {semesters.map(sem => (
                  <div key={sem} className="semester-card" onClick={() => showSubjects(sem)}>
                    <div className="semester-icon">
                      <div className="semester-icon-wrapper">
                        {sem % 2 === 1 ? (
                          <div className="autumn-icon">🍂</div>
                        ) : (
                          <div className="spring-icon">🌸</div>
                        )}
                      </div>
                    </div>
                    <h3 className="semester-title">Semester {sem}</h3>
                    <p className="semester-subtitle">
                      {sem % 2 === 1 ? 'Odd Semester' : 'Even Semester'}
                    </p>
                    <div className="card-action">
                      <span>View Subjects</span>
                      <div className="arrow-wrapper">
                        <ChevronLeft size={12} className="arrow-icon" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 4: Choose Subject */}
          {stage === 4 && (
            <div className="stage-container">
              <h2 className="stage-title">Select Subject</h2>
              <p className="stage-description">Choose the subject you want to study</p>

              {subjects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <div className="empty-icon-wrapper">📭</div>
                  </div>
                  <h3 className="empty-title">No Subjects Available</h3>
                  <p className="empty-description">
                    Subjects for Semester {semester} of Year {year} are not available yet.
                    <br />Please check back later or contact support.
                  </p>
                </div>
              ) : (
                <div className="subject-grid">
                  {subjects.map((sub, index) => (
                    <div key={sub} className="subject-card" onClick={() => showResources(sub)}>
                      <div className="subject-icon">
                        <div className="subject-icon-wrapper">
                          {getSubjectIcon(sub, index)}
                        </div>
                      </div>
                      <h3 className="subject-title">{sub}</h3>
                      <div className="card-action">
                        <span>Access Resources</span>
                        <div className="arrow-wrapper">
                          <ChevronLeft size={12} className="arrow-icon" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stage 5: View Resources */}
          {stage === 5 && (
            <div className="resources-view-container">
              <div className="resources-view-header">
                <h2 className="resources-view-title">{subject}</h2>
                <p className="resources-view-subtitle">Year {year} • Semester {semester}</p>
              </div>

              {/* Resource Type Tabs */}
              <div className="tabs-container">
                <div className="tabs-wrapper">
                  {['Notes', 'Books', 'PYQs'].map(t => (
                    <button
                      key={t}
                      className={`tab ${type === t ? 'active-tab' : ''}`}
                      onClick={() => setType(t)}
                    >
                      <div className="tab-icon">
                        {t === 'Notes' && <span className="notes-icon">📝</span>}
                        {t === 'Books' && <span className="books-icon">📚</span>}
                        {t === 'PYQs' && <span className="pyqs-icon">📋</span>}
                      </div>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="search-container">
                <div className="search-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner">⏳</div>
                  <p className="loading-text">Loading resources...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="error-container">
                  <div className="error-icon">⚠️</div>
                  <p className="error-text">{error}</p>
                </div>
              )}

              {/* Resources List */}
              {!loading && !error && (
                <div className="resources-list">
                  {filteredResources.length > 0 ? (
                    filteredResources.map(res => (
                      <div key={res._id} className="resource-card">
                        <div className="resource-info">
                          <h3 className="resource-title">{res.title}</h3>

                          <p className="resource-author">
  <span className="status-dot"></span>
  Uploaded by:{" "}
  <span 
    className="clickable-uploader"
    onClick={() => navigate(`/Contributor/${res.author}`)}
  >
    {res.author}
  </span>
</p>

                          {res.year && (
                            <p className="resource-year">Year: {res.year}</p>
                          )}
                          {res.unit && res.unit.length > 0 && (
                            <p className="resource-unit">Unit: {res.unit.join(', ')}</p>
                          )}
                          
                          {/* Stats Section */}
                          <div className="resource-stats">
                            <div className="stat-item">
                              <Eye size={16} />
                              <span>{res.viewCount || 0} views</span>
                            </div>
                            <div className="stat-item">
                              <Download size={16} />
                              <span>{res.downloadCount || 0} downloads</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="resource-actions">
                          <button 
                            onClick={() => handleView(res)} 
                            className="view-btn"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button 
                            onClick={() => handleDownload(res)} 
                            className="download-btn"
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <div className="empty-icon-wrapper">📭</div>
                      </div>
                      <h3 className="empty-title">NO RESOURCE AVAILABLE</h3>
                      <p className="empty-description">
                        No {type.toLowerCase()} are available for <strong>{subject}</strong> yet.
                        <br />
                        Be the first to contribute resources for this subject!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Resources;