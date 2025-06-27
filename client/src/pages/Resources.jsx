import { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, FileText, Calendar, GraduationCap, Download, Search } from 'lucide-react';

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

  // Mock data for demonstration
  const mockResources = [
    { _id: '1', title: 'Introduction to Machine Learning - Complete Notes', author: 'Dr. Smith', fileUrl: '#' },
    { _id: '2', title: 'Linear Algebra Fundamentals', author: 'Prof. Johnson', fileUrl: '#' },
    { _id: '3', title: 'Python Programming Guide', author: 'Code Master', fileUrl: '#' },
  ];

  useEffect(() => {
    if (stage === 5) {
      // Simulate API call with mock data
      setTimeout(() => {
        setResources(mockResources);
      }, 500);
    }
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
      3: ['Machine Learning', 'DBMS'],
      4: ['Advanced AI', 'Deep Learning'],
      5: ['Computer Vision', 'NLP'],
      6: ['Robotics', 'Neural Networks'],
      7: ['Capstone Project', 'Industry Training'],
      8: ['Research Methods', 'Final Project'],
    };
    setSubjects(subjMap[sem] || ['Subject 1', 'Subject 2']);
    setStage(4);
  };

  const showResources = (sub) => {
    setSubject(sub);
    setStage(5);
  };

  const goBack = () => {
    if (stage > 1) setStage(stage - 1);
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

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            {stage > 1 && (
              <button onClick={goBack} style={styles.backButton}>
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
            )}
            <div style={styles.headerInfo}>
              <div style={styles.headerIcon}>
                {getStageIcon()}
              </div>
              <div>
                <h1 style={styles.headerTitle}>📚 NotesMittar Resources</h1>
                {getBreadcrumb() && (
                  <p style={styles.breadcrumb}>{getBreadcrumb()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Stage 1: Choose Course */}
        {stage === 1 && (
          <div style={styles.stageContainer}>
            <h2 style={styles.stageTitle}>Choose Your Course</h2>
            <p style={styles.stageDescription}>Select your course to access study materials</p>
            <div style={styles.singleCardContainer}>
              <div style={styles.courseCard} onClick={showYears}>
                <div style={styles.courseIcon}>🤖</div>
                <h3 style={styles.courseTitle}>AI & ML</h3>
                <p style={styles.courseSubtitle}>Artificial Intelligence & Machine Learning</p>
                <div style={styles.courseAction}>
                  <span>Explore Resources</span>
                  <ChevronLeft size={16} style={styles.arrowIcon} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Choose Year */}
        {stage === 2 && (
          <div style={styles.stageContainer}>
            <h2 style={styles.stageTitle}>Select Academic Year</h2>
            <p style={styles.stageDescription}>Choose your current year of study</p>
            <div style={styles.yearGrid}>
              {[1, 2, 3, 4].map(y => (
                <div key={y} style={styles.yearCard} onClick={() => showSemesters(y)}>
                  <div style={styles.yearIcon}>
                    {y === 1 ? '🌱' : y === 2 ? '🌿' : y === 3 ? '🌳' : '🎓'}
                  </div>
                  <h3 style={styles.yearTitle}>Year {y}</h3>
                  <p style={styles.yearSubtitle}>
                    {y === 1 ? 'Foundation Year' : y === 2 ? 'Core Concepts' : y === 3 ? 'Advanced Topics' : 'Specialization'}
                  </p>
                  <div style={styles.cardAction}>
                    <span>Continue</span>
                    <ChevronLeft size={12} style={styles.arrowIcon} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Choose Semester */}
        {stage === 3 && (
          <div style={styles.stageContainer}>
            <h2 style={styles.stageTitle}>Choose Semester</h2>
            <p style={styles.stageDescription}>Select the semester for Year {year}</p>
            <div style={styles.semesterGrid}>
              {semesters.map(sem => (
                <div key={sem} style={styles.semesterCard} onClick={() => showSubjects(sem)}>
                  <div style={styles.semesterIcon}>
                    {sem % 2 === 1 ? '🍂' : '🌸'}
                  </div>
                  <h3 style={styles.semesterTitle}>Semester {sem}</h3>
                  <p style={styles.semesterSubtitle}>
                    {sem % 2 === 1 ? 'Odd Semester' : 'Even Semester'}
                  </p>
                  <div style={styles.cardAction}>
                    <span>View Subjects</span>
                    <ChevronLeft size={12} style={styles.arrowIcon} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 4: Choose Subject */}
        {stage === 4 && (
          <div style={styles.stageContainer}>
            <h2 style={styles.stageTitle}>Select Subject</h2>
            <p style={styles.stageDescription}>Choose the subject you want to study</p>
            <div style={styles.subjectGrid}>
              {subjects.map((sub, index) => (
                <div key={sub} style={styles.subjectCard} onClick={() => showResources(sub)}>
                  <div style={styles.subjectIcon}>
                    {['📊', '🔬', '💻', '🐍', '💬', '📈', '⚛️', '🗄️', '🤖', '🧠'][index % 10]}
                  </div>
                  <h3 style={styles.subjectTitle}>{sub}</h3>
                  <div style={styles.cardAction}>
                    <span>Access Resources</span>
                    <ChevronLeft size={12} style={styles.arrowIcon} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 5: View Resources */}
        {stage === 5 && (
          <div style={styles.resourcesContainer}>
            <div style={styles.resourcesHeader}>
              <h2 style={styles.resourcesTitle}>{subject}</h2>
              <p style={styles.resourcesSubtitle}>Year {year} • Semester {semester}</p>
            </div>

            {/* Resource Type Tabs */}
            <div style={styles.tabsContainer}>
              <div style={styles.tabsWrapper}>
                {['Notes', 'Books', 'PYQs'].map(t => (
                  <button
                    key={t}
                    style={{
                      ...styles.tab,
                      ...(type === t ? styles.activeTab : {})
                    }}
                    onClick={() => setType(t)}
                  >
                    {t === 'Notes' ? '📝' : t === 'Books' ? '📚' : '📋'} {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <div style={styles.searchWrapper}>
                <Search size={20} style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div style={styles.errorContainer}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {/* Resources List */}
            <div style={styles.resourcesList}>
              {filteredResources.length > 0 ? (
                filteredResources.map(res => (
                  <div key={res._id} style={styles.resourceCard}>
                    <div style={styles.resourceInfo}>
                      <h3 style={styles.resourceTitle}>{res.title}</h3>
                      <p style={styles.resourceAuthor}>
                        <span style={styles.statusDot}></span>
                        Uploaded by: {res.author}
                      </p>
                    </div>
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.downloadButton}
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </a>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📭</div>
                  <h3 style={styles.emptyTitle}>No {type} Found</h3>
                  <p style={styles.emptyDescription}>No {type.toLowerCase()} available for the selected subject yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #f3e8ff 50%, #fdf2f8 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    color: '#2563eb',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  stageContainer: {
    textAlign: 'center',
  },
  stageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
  },
  stageDescription: {
    color: '#6b7280',
    marginBottom: '32px',
    fontSize: '16px',
  },
  singleCardContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '320px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  courseIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  courseTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  courseSubtitle: {
    color: '#6b7280',
    marginBottom: '16px',
  },
  courseAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#2563eb',
    fontWeight: '500',
  },
  yearGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  yearCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  yearIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  yearTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  yearSubtitle: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '16px',
  },
  cardAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
  },
  arrowIcon: {
    transform: 'rotate(180deg)',
    transition: 'transform 0.2s',
  },
  semesterGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  semesterCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '256px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  semesterIcon: {
    fontSize: '56px',
    marginBottom: '16px',
  },
  semesterTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  semesterSubtitle: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '16px',
  },
  subjectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  subjectIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  subjectTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
  },
  resourcesContainer: {
    textAlign: 'center',
  },
  resourcesHeader: {
    marginBottom: '32px',
  },
  resourcesTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  resourcesSubtitle: {
    color: '#6b7280',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  tabsWrapper: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    display: 'flex',
  },
  tab: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#6b7280',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  },
  searchContainer: {
    maxWidth: '400px',
    margin: '0 auto 32px',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  errorText: {
    color: '#dc2626',
    margin: 0,
  },
  resourcesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s ease',
  },
  resourceInfo: {
    flex: 1,
    textAlign: 'left',
  },
  resourceTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    transition: 'color 0.2s',
  },
  resourceAuthor: {
    color: '#6b7280',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    paddingTop: '48px',
    paddingBottom: '48px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: '8px',
  },
  emptyDescription: {
    color: '#9ca3af',
  },
};

// Add hover effects using CSS-in-JS approach
const addHoverEffect = (element, hoverStyle) => {
  element.addEventListener('mouseenter', () => {
    Object.assign(element.style, hoverStyle);
  });
  element.addEventListener('mouseleave', () => {
    // Reset styles - you might want to store original styles
  });
};

export default Resources;


 
     
     
          
         
     
