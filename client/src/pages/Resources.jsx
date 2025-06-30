import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChevronLeft, BookOpen, FileText,
  Calendar, GraduationCap, Download, Search
} from 'lucide-react';
import '../style/Resources.css';

function Resources() {
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = new URLSearchParams();
        if (course) params.append('course', course);
        if (year !== null) params.append('year', year);
        if (semester !== null) params.append('semester', semester);
        if (subject) params.append('subject', subject);
        if (type) params.append('type', type);

        const res = await axios.get(`http://localhost:5000/api/resources?${params.toString()}`);
        console.log("Fetched resources:", res.data);
        setResources(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setError('Unable to load resources at this moment.');
      }
    };

    if (stage === 5) fetchResources();
  }, [stage, course, year, semester, subject, type]);

  const showYears = () => setStage(2);
  
  const showSemesters = (selectedYear) => {
    const semMap = {
      1: [1, 2],
      2: [3, 4],
      3: [5, 6],
      4: [7, 8],
    };
    setYear(selectedYear);
    setSemesters(semMap[selectedYear] || []);
    setStage(3);
  };

  const showSubjects = (sem) => {
    setSemester(sem);
    const subjMap = {
      1: ['Probability & Statistics', 'EVS', 'IT Workshop', 'Programming with Python', 'Communication Skills'],
      2: ['Applied Maths', 'Applied Physics', 'Intro to DS', 'Data Structures', 'OOPJ'],
      3: ['Discrete Mathematics','Software Engineering ','Design and Analysis of Algorithm','Introduction to Internet of Things'],
      4: ['Database Management Systems','Computer Organiztion and Architecture','Operating Systems','Data Communication and Computer Networks','Advanced IOT and Real World Applications'],
      
    };
    setSubjects(subjMap[sem] || ['Subject 1', 'Subject 2']);
    setStage(4);
  };

  const showResources = (sub) => {
    setSubject(sub);
    setStage(5);
  };

  const goBack = () => stage > 1 && setStage(stage - 1);

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
      'Probability & Statistics': '📊',
      'EVS': '🌱',
      'IT Workshop': '⚡',
      'Programming with Python': '🐍',
      'Communication Skills': '💬',
      'Applied Maths': '📐',
      'Applied Physics': '⚛️',
      'Intro to DS': '🔬',
      'Data Structures': '🏗️',
      'OOPJ': '☕',
      'Discrete Mathematics': '🧮',
      'Software Engineering': '⚙️',
      'Design and Analysis of Algorithm': '🔍',
      'Introduction to Internet of Things': '🌐',
      'Database Management Systems': '🗄️',
      'Computer Organiztion and Architecture': '💻',
      'Operating Systems': '🖥️',
      'Data Communication and Computer Networks': '🌊',
      'Advanced IOT and Real World Applications': '🚀'
    };
    
    return iconMap[subject] || ['📚', '🔬', '💻', '🧠', '⚡', '🎯', '🔧', '📈', '🌟', '🎨'][index % 10];
  };

  const filteredResources = resources.filter(resource =>
    resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
        )}
      </div>
    </div>
  );
}

export default Resources;
 
  

  
    
    
  
            
    
       
       
           
           
  ,


  
   
