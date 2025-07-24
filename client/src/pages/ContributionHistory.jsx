<<<<<<< HEAD

=======
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
import React, { useEffect, useState } from 'react';
import '../style/ContributionHistory.css';

export default function ContributionHistory() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const username = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('email');

        if (!username) throw new Error('Username not found. Please login again.');

        const res = await fetch('http://localhost:5000/api/my-resources', {
          headers: {
            'username': username,
            'email': email || 'unknown@example.com'
          }
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        console.log('Fetched contributions:', data);
        
<<<<<<< HEAD
        // Debug: Log each document's properties including new fields
=======
        // Debug: Log each document's properties
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
        data.forEach((doc, index) => {
          console.log(`Document ${index}:`, {
            filename: doc.filename,
            type: doc.type,
            status: doc.status,
            relevanceScore: doc.relevanceScore,
<<<<<<< HEAD
            topicCoverage: doc.topicCoverage,
            coverageAnalysis: doc.coverageAnalysis,
            recommendations: doc.recommendations,
=======
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
            allFields: Object.keys(doc)
          });
        });
        
        setContributions(data);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const handleFileClick = (fileId, filename) => {
    const fileUrl = `http://localhost:5000/api/file/${fileId}`;
    window.open(fileUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusClassName = (status) => `status ${status.toLowerCase()}`;

  // Enhanced debugging for relevance score
  const getRelevanceScore = (doc) => {
    console.log('Checking relevance score for:', doc.filename, 'Score:', doc.relevanceScore, 'Type:', typeof doc.relevanceScore);
    
    const score = doc.relevanceScore;
    
    // More flexible checking
    if (score !== null && score !== undefined && !isNaN(Number(score))) {
      const numScore = Number(score);
      if (numScore >= 0 && numScore <= 100) {
        return Math.round(numScore);
      }
    }
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745'; // Green
    if (score >= 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

<<<<<<< HEAD
  // Get topic coverage summary for display
  const getTopicCoverageSummary = (doc) => {
    if (!doc.topicCoverage || !Array.isArray(doc.topicCoverage)) {
      return null;
    }

    const totalTopics = doc.topicCoverage.length;
    const wellCoveredTopics = doc.topicCoverage.filter(t => t.coveragePercentage >= 70).length;
    const partiallyCoveredTopics = doc.topicCoverage.filter(t => t.coveragePercentage >= 30 && t.coveragePercentage < 70).length;
    const poorlyCoveredTopics = doc.topicCoverage.filter(t => t.coveragePercentage < 30).length;

    return {
      totalTopics,
      wellCoveredTopics,
      partiallyCoveredTopics,
      poorlyCoveredTopics
    };
  };

  // Get AI-generated recommendations
  const getAIRecommendations = (doc) => {
    // First check if we have recommendations from the new enhanced API
    if (doc.recommendations && Array.isArray(doc.recommendations) && doc.recommendations.length > 0) {
      return doc.recommendations;
    }

    // Fallback to basic recommendations if no AI recommendations available
    const score = getRelevanceScore(doc);
    if (score === null) return [];

    const fallbackRecommendations = [];
    if (score >= 90) {
      fallbackRecommendations.push("🌟 Excellent contribution! Your content provides comprehensive coverage.");
    } else if (score >= 80) {
      fallbackRecommendations.push("✅ Great work! Content aligns well with syllabus requirements.");
    } else if (score >= 60) {
      fallbackRecommendations.push("⚠️ Good foundation but could benefit from more comprehensive coverage.");
    } else {
      fallbackRecommendations.push("❌ Content needs significant improvement to match syllabus requirements.");
    }

    return fallbackRecommendations;
  };

  // Enhanced analysis reasons based on topic coverage
  const getAnalysisReasons = (doc) => {
=======
  const getReasonForScore = (doc) => {
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    const score = getRelevanceScore(doc);
    if (score === null) return [];

    const reasons = [];
<<<<<<< HEAD
    const topicSummary = getTopicCoverageSummary(doc);

    if (topicSummary) {
      if (topicSummary.wellCoveredTopics > 0) {
        reasons.push(`✅ ${topicSummary.wellCoveredTopics}/${topicSummary.totalTopics} topics well covered`);
      }
      if (topicSummary.partiallyCoveredTopics > 0) {
        reasons.push(`⚠️ ${topicSummary.partiallyCoveredTopics} topics partially covered`);
      }
      if (topicSummary.poorlyCoveredTopics > 0) {
        reasons.push(`❌ ${topicSummary.poorlyCoveredTopics} topics need improvement`);
      }
    } else {
      // Fallback to basic analysis
      if (score >= 80) {
        reasons.push("✅ Excellent content alignment with syllabus");
        reasons.push("✅ Comprehensive coverage of topics");
      } else if (score >= 60) {
        reasons.push("⚠️ Good content but some gaps in coverage");
        reasons.push("⚠️ Moderate alignment with syllabus");
      } else {
        reasons.push("❌ Low relevance to course syllabus");
        reasons.push("❌ Content doesn't match expected topics");
      }
=======
    if (score >= 80) {
      reasons.push("✅ Excellent content alignment with syllabus");
      reasons.push("✅ Comprehensive coverage of topics");
      reasons.push("✅ High educational value");
    } else if (score >= 60) {
      reasons.push("⚠️ Good content but some gaps in coverage");
      reasons.push("⚠️ Moderate alignment with syllabus");
      if (doc.type === 'Notes') reasons.push("⚠️ Could benefit from more detailed explanations");
    } else {
      reasons.push("❌ Low relevance to course syllabus");
      reasons.push("❌ Content doesn't match expected topics");
      reasons.push("❌ Poor alignment with semester requirements");
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    }

    return reasons;
  };

  const renderAIAnalysisColumn = (doc) => {
    console.log('Rendering AI Analysis for:', doc.filename, 'Type:', doc.type);
    
    // If it's not Notes type, show message
    if (doc.type !== 'Notes') {
      return (
        <div className="no-analysis">
          <div style={{padding: '10px', textAlign: 'center'}}>
            📝 AI analysis only available for Notes
          </div>
        </div>
      );
    }

    const relevanceScore = getRelevanceScore(doc);
    console.log('Relevance score for', doc.filename, ':', relevanceScore);

    // If Notes but no relevance score, show pending with debug info
    if (relevanceScore === null) {
      return (
        <div className="pending-report">
          <div style={{padding: '15px'}}>
            <div style={{fontStyle: 'italic', marginBottom: '10px'}}>
              ⏳ AI analysis in progress...
            </div>
            <div className="debug-info" style={{
              fontSize: '0.8rem',
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              textAlign: 'left'
            }}>
              <strong>Debug Info:</strong><br />
              Type: {doc.type}<br />
              Status: {doc.status}<br />
              RelevanceScore: {JSON.stringify(doc.relevanceScore)}<br />
              RelevanceScore Type: {typeof doc.relevanceScore}<br />
              All Fields: {Object.keys(doc).join(', ')}
            </div>
          </div>
        </div>
      );
    }

    // If Notes and has relevance score, show full analysis
    return (
      <div className={`report-box ${doc.status}`} style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="relevance-score" style={{marginBottom: '15px'}}>
          <div className="score-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <strong>🎯 Relevance Score:</strong>
            <span
              className="score-value"
              style={{
                color: getScoreColor(relevanceScore),
                fontWeight: 'bold',
                fontSize: '1.2rem',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              {relevanceScore}%
            </span>
          </div>
          <div className="score-bar" style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              className="score-fill"
              style={{
                height: '100%',
                width: `${relevanceScore}%`,
                backgroundColor: getScoreColor(relevanceScore),
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

<<<<<<< HEAD
        {/* Enhanced Coverage Analysis */}
        {doc.coverageAnalysis && (
          <div className="coverage-analysis" style={{marginBottom: '15px'}}>
            <strong>📊 Coverage Analysis:</strong>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginTop: '8px',
              fontSize: '0.85rem'
            }}>
              <div>Topics: {doc.coverageAnalysis.totalTopics}</div>
              <div>Coverage: {doc.coverageAnalysis.overallCoveragePercentage}%</div>
              <div>Covered: {doc.coverageAnalysis.coveredSubtopics}</div>
              <div>Missing: {doc.coverageAnalysis.uncoveredSubtopics}</div>
            </div>
          </div>
        )}

        <div className="analysis-reasons" style={{marginBottom: '15px'}}>
          <strong>📋 Analysis Summary:</strong>
          <ul style={{margin: '8px 0', paddingLeft: '0', listStyle: 'none'}}>
            {getAnalysisReasons(doc).map((reason, idx) => (
=======
        <div className="analysis-reasons" style={{marginBottom: '15px'}}>
          <strong>📋 Analysis Reasons:</strong>
          <ul style={{margin: '8px 0', paddingLeft: '0', listStyle: 'none'}}>
            {getReasonForScore(doc).map((reason, idx) => (
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
              <li key={idx} style={{
                padding: '3px 0',
                fontSize: '0.85rem',
                color: '#495057'
              }}>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="verification-section" style={{marginBottom: '15px'}}>
          <strong>✅ Verification Check:</strong>
          <ul style={{margin: '8px 0', paddingLeft: '0', listStyle: 'none'}}>
            <li style={{color: '#28a745', fontSize: '0.85rem'}}>✔️ Subject match confirmed</li>
            <li style={{color: '#28a745', fontSize: '0.85rem'}}>✔️ Semester alignment verified</li>
            <li style={{color: '#28a745', fontSize: '0.85rem'}}>✔️ Content type appropriate</li>
            {doc.unit && doc.unit.length > 0 && (
              <li style={{color: '#28a745', fontSize: '0.85rem'}}>
                ✔️ Unit coverage: {Array.isArray(doc.unit) ? doc.unit.join(', ') : doc.unit}
              </li>
            )}
          </ul>
        </div>
<<<<<<< HEAD

        {/* AI Generated Recommendations Section */}
        <div className="ai-recommendations-box" style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          padding: '12px',
          borderRadius: '6px',
          borderLeft: '4px solid #2196f3'
        }}>
          <strong style={{color: '#1976d2', marginBottom: '8px', display: 'block'}}>
            🤖 AI Recommendations:
          </strong>
          {getAIRecommendations(doc).length > 0 ? (
            <ul style={{
              margin: '0',
              paddingLeft: '0',
              listStyle: 'none'
            }}>
              {getAIRecommendations(doc).map((recommendation, idx) => (
                <li key={idx} style={{
                  color: '#424242',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  marginBottom: '6px',
                  paddingLeft: '16px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#1976d2'
                  }}>•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{
              margin: '0',
              color: '#424242',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}>
              No specific recommendations available.
            </p>
          )}
        </div>

        {/* Debug section for development (can be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-section" style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: '#6c757d'
          }}>
            <strong>Debug Info:</strong><br />
            Has recommendations: {doc.recommendations ? 'Yes' : 'No'}<br />
            Recommendations count: {doc.recommendations ? doc.recommendations.length : 0}<br />
            Has topicCoverage: {doc.topicCoverage ? 'Yes' : 'No'}<br />
            Has coverageAnalysis: {doc.coverageAnalysis ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    );
  };

=======

        <div className="suggestion-box" style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          padding: '12px',
          borderRadius: '6px',
          borderLeft: '4px solid #2196f3'
        }}>
          <strong style={{color: '#1976d2', marginBottom: '8px', display: 'block'}}>💡 AI Recommendation:</strong>
          <p style={{
            margin: '0',
            color: '#424242',
            fontSize: '0.85rem',
            lineHeight: '1.5'
          }}>
            {doc.status === 'rejected' && relevanceScore < 60
              ? `🚫 Content rejected due to low relevance (${relevanceScore}%). Please ensure your upload aligns with syllabus requirements.`
              : relevanceScore >= 80
              ? `🌟 Excellent contribution! Your ${doc.type.toLowerCase()} provides high-quality content.`
              : relevanceScore >= 60
              ? `👍 Good contribution! Consider enhancing with more detailed explanations.`
              : `⚠️ Content needs improvement. Focus on aligning with syllabus topics.`}
          </p>
        </div>
      </div>
    );
  };

>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
  if (loading) {
    return (
      <div className="history-container">
        <h1 className="history-title">📚 Your Contribution History</h1>
        <div className="loading">Loading your contributions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <h1 className="history-title">📚 Your Contribution History</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1 className="history-title">📚 Your Contribution History</h1>

      {contributions.length === 0 ? (
        <div className="no-contributions">
          <p>No contributions yet. Start uploading to see your history!</p>
        </div>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table className="history-table" style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minWidth: '800px'
          }}>
            <thead>
              <tr>
                <th style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  width: '20%'
                }}>Title</th>
                <th style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  width: '25%'
                }}>Details</th>
                <th style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  width: '15%'
                }}>Status</th>
                <th style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  width: '15%'
                }}>Upload Date</th>
                <th style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '15px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  width: '25%'
                }}>AI Analysis & Score</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((doc, index) => (
                <tr key={doc.fileId || index} style={{borderBottom: '1px solid #e9ecef'}}>
                  <td style={{padding: '15px 12px', verticalAlign: 'top'}}>
                    <button
                      className="file-link"
                      onClick={() => handleFileClick(doc.fileId, doc.filename)}
                      title="Click to view file"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        textDecoration: 'underline'
                      }}
                    >
                      📄 {doc.filename || 'Unknown File'}
                    </button>
                  </td>
                  <td style={{padding: '15px 12px', verticalAlign: 'top'}}>
                    <div className="details-section">
                      <div><strong>Course:</strong> {doc.course}</div>
                      <div><strong>Semester:</strong> {doc.semester}</div>
                      <div><strong>Subject:</strong> {doc.subject}</div>
                      <div><strong>Type:</strong> {doc.type}</div>
                      {doc.unit && doc.unit.length > 0 && (
                        <div><strong>Units:</strong> {Array.isArray(doc.unit) ? doc.unit.join(', ') : doc.unit}</div>
                      )}
                      {doc.year && <div><strong>Year:</strong> {doc.year}</div>}
                    </div>
                  </td>
                  <td style={{padding: '15px 12px', verticalAlign: 'top'}}>
                    <span className={getStatusClassName(doc.status)} style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase'
                    }}>
                      {doc.status === 'approved'
                        ? '✅ Approved'
                        : doc.status === 'rejected'
                        ? '❌ Rejected'
                        : '⏳ Pending'}
                    </span>
                  </td>
                  <td style={{padding: '15px 12px', verticalAlign: 'top'}}>
                    {formatDate(doc.uploadDate)}
                  </td>
                  <td style={{padding: '15px 12px', verticalAlign: 'top'}}>
                    <div className="report-box-wrapper" style={{maxWidth: '350px'}}>
                      {renderAIAnalysisColumn(doc)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}