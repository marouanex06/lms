import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../common/DashboardLayout';
import { Users, MoreVertical } from 'lucide-react';

// Removed old FAKE_COURSES mappings
/* ───────────────────────────────────────────────────── */

const StudentProgress = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentProgress = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
                const token = userInfo?.token;
                
                const res = await fetch('http://localhost:8000/api/admin/student-progress', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                const result = await res.json();
                
                if (res.ok && result.data) {
                    const mappedData = result.data.map(en => ({
                        id: en.id,
                        name: en.user?.name || 'Unknown Student',
                        email: en.user?.email || '',
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(en.user?.name || 'Student')}&background=6366F1&color=fff&size=150`,
                        courseTitle: en.course?.title || 'Unknown Course',
                        progress: en.progress_percentage || 0,
                        date: new Date(en.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    }));
                    setEnrollments(mappedData);
                }
            } catch (err) {
                console.error("Failed to fetch student progress", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProgress();
    }, []);

    return (
        <DashboardLayout 
            title={<><Users size={28} style={{ color: '#6366F1', marginRight: 10 }} /> Student Progress</>}
            subtitle="Track your students' learning journeys and completion rates."
        >
            <div style={bentoCardStyle} className="animate-fade-in-up">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Loading student data...</div>
                ) : enrollments.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94A3B8' }}>
                        <Users size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
                        <h5 style={{ fontWeight: 700, color: '#64748B', marginBottom: 8 }}>No students enrolled yet</h5>
                        <p style={{ fontSize: '0.9rem' }}>When students enroll in your courses, their progress will appear here.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Student</th>
                                    <th style={thStyle}>Enrolled Course</th>
                                    <th style={thStyle}>Progress</th>
                                    <th style={thStyle}>Joined</th>
                                    <th style={thStyle}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((en, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <img src={en.avatar} alt={en.name} style={avatarStyle} />
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{en.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{en.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>{en.courseTitle}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={progressTrackStyle}>
                                                    <div style={{ 
                                                        ...progressFillStyle, 
                                                        width: `${en.progress}%`,
                                                        background: en.progress === 100 ? '#22C55E' : '#6366F1'
                                                    }} />
                                                </div>
                                                <span style={{ 
                                                    fontWeight: 700, 
                                                    fontSize: '0.85rem',
                                                    color: en.progress === 100 ? '#22C55E' : '#6366F1'
                                                }}>
                                                    {en.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                                {new Date(en.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <button style={actionBtnStyle}>
                                                <MoreVertical size={18} color="#94A3B8" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

/* --- Styles --- */
const bentoCardStyle = {
    background: 'var(--bg-white)',
    borderRadius: 24,
    padding: '2rem',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-light)',
};

const thStyle = {
    padding: '12px 16px', 
    textAlign: 'left',
    fontSize: '0.78rem', 
    fontWeight: 700, 
    color: 'var(--text-muted)',
    textTransform: 'uppercase', 
    letterSpacing: '0.05em',
    borderBottom: '2px solid var(--border-light)',
};

const tdStyle = {
    padding: '16px', 
    verticalAlign: 'middle',
    color: 'var(--text-main)'
};

const avatarStyle = {
    width: 44, 
    height: 44, 
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--border-light)'
};

const progressTrackStyle = {
    flexGrow: 1,
    height: 8, 
    background: 'var(--border-light)', 
    borderRadius: 50, 
    overflow: 'hidden',
    minWidth: '100px'
};

const progressFillStyle = {
    height: '100%', 
    borderRadius: 50,
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
};

const actionBtnStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background 0.2s'
};

export default StudentProgress;
