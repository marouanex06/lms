import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../common/DashboardLayout'
import { apiUrl } from '../../common/config'
import { BookOpen, Users, DollarSign, Award, GraduationCap, LayoutDashboard, TrendingUp, Clock, Star, CheckCircle, Play, Target, Flame } from 'lucide-react'

const fakeRecentActivity = [
    { id: 1, title: 'Account Created', subtitle: 'Welcome to SmartLearning!', time: 'Recently', status: 'new', icon: 'check' },
];
/* ───────────────────────────────────────────────────── */

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [studentStats, setStudentStats] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [loadingStats, setLoadingStats] = useState(false);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const isAdmin = userInfo.role === 'admin';

    useEffect(() => {
        if (isAdmin) {
            setLoadingStats(true);
            fetch(`${apiUrl}/dashboard-stats`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            })
            .then(r => r.json())
            .then(result => {
                if (result.status === 200) {
                    setStats(result.data);
                    setTopCourses(result.data.top_courses || []);
                }
            })
            .catch(err => console.error('Failed to load dashboard stats', err))
            .finally(() => setLoadingStats(false));
        } else {
            fetch(`${apiUrl}/my-enrollments`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            })
            .then(r => r.json())
            .then(result => {
                if (result.status === 200) {
                    // myEnrollments returns course objects directly (not enrollment wrappers)
                    // each course already has progress_percentage set by the backend
                    const courses = (result.data || []).map(course => ({
                        ...course,
                        progress: course.progress_percentage || 0
                    }));
                    
                    let totalProgress = 0;
                    let completedCoursesCount = 0;

                    courses.forEach(course => {
                        totalProgress += course.progress;
                        if (course.progress === 100) completedCoursesCount += 1;
                    });

                    const dynamicStats = {
                        total_enrolled: courses.length,
                        certificates: completedCoursesCount,
                        hours_watched: Math.round((totalProgress / 100) * 4), 
                        streak: courses.length > 0 ? 1 : 0
                    };
                    
                    setStudentStats(dynamicStats);
                    setEnrolledCourses(courses);
                }
            })
            .catch(err => console.error('Failed to load enrollments', err));
        }
    }, [isAdmin]);

    const getActivityIcon = (type) => {
        switch(type) {
            case 'check': return <CheckCircle size={18} />;
            case 'play':  return <Play size={18} />;
            case 'award': return <Award size={18} />;
            default:      return <BookOpen size={18} />;
        }
    };

    const getActivityColor = (status) => {
        switch(status) {
            case 'completed':   return { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' };
            case 'in-progress': return { bg: 'rgba(99,102,241,0.12)', color: '#6366F1' };
            case 'new':         return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
            default:            return { bg: 'rgba(99,102,241,0.12)', color: '#6366F1' };
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':   return { label: 'Done', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' };
            case 'in-progress': return { label: 'In Progress', bg: 'rgba(99,102,241,0.12)', color: '#6366F1' };
            case 'new':         return { label: 'New', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
            default:            return { label: 'New', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
        }
    };

    return (
        <DashboardLayout 
            title={<><LayoutDashboard size={28} style={{ color: '#6366F1', marginRight: 10 }} /> {isAdmin ? 'Instructor Hub' : 'Learning Hub'}</>}
            subtitle="Manage your learning journey and view your performance metrics."
        >
                    {/* ════════ STUDENT VIEW ════════ */}
                    {!isAdmin && (
                        <>
                            {/* Hero Banner */}
                            <div style={heroBannerStyle} className="mb-4 animate-fade-in-up">
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <div style={heroEmojiStyle}>👋</div>
                                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: 6 }}>
                                        Welcome back, <span style={{ opacity: 0.9 }}>{userInfo.name || 'Learner'}</span>!
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 20, maxWidth: 500 }}>
                                        Keep up the momentum! You're on a <strong style={{ color: '#fff' }}>{studentStats?.streak ?? 0}-day streak 🔥</strong> — don't break it now.
                                    </p>
                                    <div className="d-flex gap-3 flex-wrap">
                                        <Link to="/courses" style={heroBtnPrimary}>Browse Courses</Link>
                                        <Link to="/account/my-learning" style={heroBtnOutline}>Continue Learning →</Link>
                                    </div>
                                </div>
                                <GraduationCap size={220} style={{ position:'absolute', right:-10, bottom:-40, opacity:0.08, transform:'rotate(-12deg)' }} />
                            </div>

                            {/* Student Stat Cards */}
                            <div className="row g-4 mb-4">
                                {[
                                    { label:'Enrolled Courses', value: studentStats?.total_enrolled ?? 0, icon:<BookOpen size={24}/>, color:'#6366F1', bg:'rgba(99,102,241,0.1)', delay:1 },
                                    { label:'Certificates', value: studentStats?.certificates ?? 0, icon:<Award size={24}/>, color:'#A855F7', bg:'rgba(168,85,247,0.1)', delay:2 },
                                    { label:'Hours Watched', value: `${studentStats?.hours_watched ?? 0}h`, icon:<Clock size={24}/>, color:'#F59E0B', bg:'rgba(245,158,11,0.1)', delay:3 },
                                    { label:'Day Streak', value: `${studentStats?.streak ?? 0} 🔥`, icon:<Flame size={24}/>, color:'#EF4444', bg:'rgba(239,68,68,0.1)', delay:4 },
                                ].map((card, i) => (
                                    <div key={i} className={`col-md-3 col-6 animate-fade-in-up delay-${card.delay}`}>
                                        <div style={statCardStyle}>
                                            <div style={{ ...iconWrapStyle, background: card.bg, color: card.color }}>
                                                {card.icon}
                                            </div>
                                            <div style={{ fontSize:'2rem', fontWeight:800, color: card.color, margin:'12px 0 4px' }}>
                                                {card.value}
                                            </div>
                                            <div style={{ fontSize:'0.85rem', color:'#64748B', fontWeight:600 }}>{card.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* In-Progress Courses + Activity */}
                            <div className="row g-4">
                                {/* Courses Progress */}
                                <div className="col-lg-7">
                                    <div style={bentoCardStyle} className="animate-fade-in-up delay-2 h-100">
                                        <h5 style={sectionTitleStyle}><Target size={18} style={{marginRight:8, color:'#6366F1'}}/>My Courses</h5>
                                        <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                                            {enrolledCourses.length > 0 ? (
                                                enrolledCourses.slice(0, 4).map(course => (
                                                    <div key={course.id}>
                                                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                                                            <span style={{ fontWeight:600, fontSize:'0.95rem' }}>{course.title}</span>
                                                            <span style={{ fontWeight:700, color: course.color, fontSize:'0.9rem' }}>{course.progress}%</span>
                                                        </div>
                                                        <div style={progressTrackStyle}>
                                                            <div style={{ ...progressFillStyle, width:`${course.progress}%`, background: course.color }} />
                                                        </div>
                                                        <div style={{ fontSize:'0.8rem', color:'#94A3B8', marginTop:6 }}>
                                                            {course.lessons}/{course.total} lessons completed
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-muted">
                                                    <BookOpen size={32} style={{ opacity: 0.5, marginBottom: 10 }} />
                                                    <p className="mb-0 small fw-medium">You haven't enrolled in any courses yet.</p>
                                                    <Link to="/courses" className="btn btn-sm btn-primary mt-3 rounded-pill fw-bold">Browse Courses</Link>
                                                </div>
                                            )}
                                        </div>
                                        {enrolledCourses.length > 0 && (
                                            <Link to="/account/my-learning" style={viewAllLinkStyle}>View all courses →</Link>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="col-lg-5">
                                    <div style={bentoCardStyle} className="animate-fade-in-up delay-3 h-100">
                                        <h5 style={sectionTitleStyle}><TrendingUp size={18} style={{marginRight:8, color:'#6366F1'}}/>Recent Activity</h5>
                                        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                                            {fakeRecentActivity.map(act => {
                                                const c = getActivityColor(act.status);
                                                const b = getStatusBadge(act.status);
                                                return (
                                                    <div key={act.id} style={activityRowStyle}>
                                                        <div style={{ ...activityIconStyle, background: c.bg, color: c.color }}>
                                                            {getActivityIcon(act.icon)}
                                                        </div>
                                                        <div style={{ flex:1, minWidth:0 }}>
                                                            <div style={{ fontWeight:600, fontSize:'0.9rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{act.title}</div>
                                                            <div style={{ fontSize:'0.75rem', color:'#94A3B8' }}>{act.time}</div>
                                                        </div>
                                                        <span style={{ ...badgeStyle, background: b.bg, color: b.color }}>{b.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ════════ ADMIN VIEW ════════ */}
                    {isAdmin && (
                        <>
                            {/* Admin Hero */}
                            <div style={adminHeroStyle} className="mb-4 animate-fade-in-up">
                                <div style={{ position:'relative', zIndex:2 }}>
                                    <p style={{ color:'rgba(255,255,255,0.7)', margin:'0 0 4px', fontSize:'0.85rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>Instructor Hub</p>
                                    <h3 style={{ color:'#fff', fontWeight:800, fontSize:'1.8rem', marginBottom:6 }}>
                                        Hey {userInfo.name || 'Instructor'} 👋, here's your overview
                                    </h3>
                                    <p style={{ color:'rgba(255,255,255,0.7)', marginBottom:0 }}>
                                        Your courses are performing great this month. Keep creating!
                                    </p>
                                </div>
                                <Users size={180} style={{ position:'absolute', right:-10, bottom:-30, opacity:0.08, transform:'rotate(-10deg)' }} />
                            </div>

                            {/* Admin Stat Cards */}
                            <div className="row g-4 mb-4">
                                {[
                                    { label:'Total Revenue', value:`$${stats?.total_revenue?.toLocaleString() || '0'}`, icon:<DollarSign size={24}/>, color:'#22C55E', bg:'rgba(34,197,94,0.1)', delay:1 },
                                    { label:'Total Students', value: stats?.total_enrollments?.toLocaleString() || 0, icon:<Users size={24}/>, color:'#6366F1', bg:'rgba(99,102,241,0.1)', delay:2 },
                                    { label:'Active Courses', value: stats?.active_courses || 0, icon:<BookOpen size={24}/>, color:'#F59E0B', bg:'rgba(245,158,11,0.1)', delay:3 },
                                    { label:'Total Courses', value: stats?.total_courses || 0, icon:<Target size={24}/>, color:'#A855F7', bg:'rgba(168,85,247,0.1)', delay:4 },
                                ].map((card, i) => (
                                    <div key={i} className={`col-md-3 col-6 animate-fade-in-up delay-${card.delay}`}>
                                        <div style={statCardStyle}>
                                            <div style={{ ...iconWrapStyle, background: card.bg, color: card.color }}>
                                                {card.icon}
                                            </div>
                                            <div style={{ fontSize:'2rem', fontWeight:800, color: card.color, margin:'12px 0 4px' }}>
                                                {card.value}
                                            </div>
                                            <div style={{ fontSize:'0.85rem', color:'#64748B', fontWeight:600 }}>{card.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Top Courses Table */}
                            <div style={bentoCardStyle} className="animate-fade-in-up delay-3 mb-4">
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                                    <h5 style={sectionTitleStyle}><TrendingUp size={18} style={{marginRight:8, color:'#6366F1'}}/>Top Performing Courses</h5>
                                    <Link to="/account/my-courses" style={viewAllLinkStyle}>Manage all →</Link>
                                </div>
                                <div style={{ overflowX:'auto' }}>
                                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                        <thead>
                                            <tr>
                                                {['Course','Students','Revenue','Rating'].map(h => (
                                                    <th key={h} style={thStyle}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topCourses.map((c, i) => (
                                                <tr key={c.id} style={{ borderBottom:'1px solid #F1F5F9' }}>
                                                    <td style={tdStyle}>
                                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                            <div style={{ ...rankBadgeStyle, background: ['#6366F1','#A855F7','#F59E0B','#22C55E'][i] + '22', color: ['#6366F1','#A855F7','#F59E0B','#22C55E'][i] }}>
                                                                #{i + 1}
                                                            </div>
                                                            <span style={{ fontWeight:600, fontSize:'0.95rem' }}>{c.title}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={{ fontWeight:700, color:'#6366F1' }}>{c.students}</span>
                                                        <span style={{ color:'#94A3B8', fontSize:'0.85rem' }}> students</span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={{ fontWeight:700, color:'#22C55E' }}>${c.revenue.toLocaleString()}</span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {c.rating ? (
                                                            <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontWeight:700, color:'#F59E0B' }}>
                                                                <Star size={15} fill="#F59E0B" />{c.rating}
                                                            </span>
                                                        ) : (
                                                            <span style={{ color:'#94A3B8', fontSize:'0.85rem' }}>No reviews</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {!loadingStats && topCourses.length === 0 && (
                                        <div style={{ textAlign:'center', padding:'2rem', color:'#94A3B8' }}>
                                            <BookOpen size={32} style={{ opacity:0.4, marginBottom:8 }} />
                                            <p style={{ margin:0, fontSize:'0.9rem' }}>No courses with enrollments yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
        </DashboardLayout>
    )
}

/* ─── Layout Styles ───── */
const heroBannerStyle = {
    background: 'linear-gradient(120deg, #6366F1 0%, #A855F7 100%)',
    borderRadius: 24, padding: '2.5rem 3rem',
    position: 'relative', overflow: 'hidden',
    boxShadow: '0 20px 40px -10px rgba(99,102,241,0.3)',
};
const adminHeroStyle = {
    background: 'linear-gradient(120deg, #1E293B 0%, #0F172A 100%)',
    borderRadius: 24, padding: '2.5rem 3rem',
    position: 'relative', overflow: 'hidden',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
};
const heroEmojiStyle = {
    fontSize: '2.5rem', marginBottom: 10,
};
const heroBtnPrimary = {
    background: 'white', color: '#6366F1', fontWeight: 700,
    padding: '12px 28px', borderRadius: 12, textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
};
const heroBtnOutline = {
    background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700,
    padding: '12px 28px', borderRadius: 12, textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
};
const statCardStyle = {
    background: 'var(--bg-white)',
    borderRadius: 20,
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-light)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
};
const iconWrapStyle = {
    width: 56, height: 56, borderRadius: 16,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto'
};
const bentoCardStyle = {
    background: 'var(--bg-white)',
    borderRadius: 24,
    padding: '1.8rem',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-light)',
};
const sectionTitleStyle = {
    fontWeight: 800, fontSize: '1.05rem', marginBottom: '1.5rem',
    display: 'flex', alignItems: 'center', color: 'var(--text-main)'
};
const viewAllLinkStyle = {
    display: 'inline-block', marginTop: '1.5rem',
    color: '#6366F1', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
};
const progressTrackStyle = {
    height: 8, background: 'var(--border-light)', borderRadius: 50, overflow: 'hidden',
};
const progressFillStyle = {
    height: '100%', borderRadius: 50,
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
};
const activityRowStyle = {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '0.8rem 0', borderBottom: '1px solid var(--border-light)',
};
const activityIconStyle = {
    width: 42, height: 42, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
};
const badgeStyle = {
    padding: '6px 14px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
};
const thStyle = {
    padding: '12px 14px', textAlign: 'left',
    fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    borderBottom: '2px solid var(--border-light)',
};
const tdStyle = {
    padding: '16px 14px', fontSize: '0.92rem', verticalAlign: 'middle',
    color: 'var(--text-main)'
};
const rankBadgeStyle = {
    width: 30, height: 30, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
};

export default Dashboard