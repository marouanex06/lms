import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Accordion, ListGroup } from "react-bootstrap";
import Layout from '../common/Layout';
import { fileUrl } from '../common/config';
import { toast } from 'react-toastify';
import { 
    Star, BookOpen, Users, Award, Tv, Infinity, Check, Play, 
    Lock, Globe, Layers, ChevronRight, Calendar, UserCheck, Clock
} from 'lucide-react';

// FAKE_COURSES removed

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const checkEnrollment = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        if (!userInfo?.token) return;
        
        try {
            const res = await fetch(`http://localhost:8000/api/enrollment/${id}`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            });
            const result = await res.json();
            if (res.ok && result.data && result.data.enrolled) {
                setEnrolled(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCourse = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/public/courses/${id}`);
            const result = await res.json();
            if (res.ok) {
                setCourse(result.data);
                checkEnrollment();
            } else {
                toast.error('Course not found');
                navigate('/courses');
            }
        } catch (error) {
            toast.error('Error loading course');
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        if (!userInfo?.token) {
            toast.info('Please login to enroll');
            navigate('/account/login');
            return;
        }
        
        setEnrolling(true);
        try {
            const res = await fetch(`http://localhost:8000/api/enroll/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                setEnrolled(true);
                toast.success('🎉 Enrolled successfully! Go to My Learning to start.');
            } else {
                toast.error(result.message || 'Enrollment failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className='container py-5 min-vh-100 d-flex align-items-center justify-content-center'>
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!course) return null;

    const totalLessons = course.chapters ? course.chapters.reduce((sum, ch) => sum + (ch.lessons ? ch.lessons.length : 0), 0) : 0;
    const totalDuration = course.chapters ? course.chapters.reduce((sum, ch) => sum + (ch.lessons ? ch.lessons.reduce((s, l) => s + (l.duration || 0), 0) : 0), 0) : 0;

    return (
        <Layout>
            {/* Breadcrumb */}
            <div style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 align-items-center small fw-semibold">
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/courses" className="text-decoration-none text-muted">Courses</Link></li>
                            <li className="breadcrumb-item active text-primary" aria-current="page">{course.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className='container pb-5 pt-5'>
                <div className='row g-5'>
                    {/* ── Left Content ── */}
                    <div className='col-lg-8'>

                        {/* Category Badge */}
                        {course.category && (
                            <span style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1', padding: '6px 14px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 700, display: 'inline-block', marginBottom: 16 }}>
                                {course.category.name}
                            </span>
                        )}

                        {/* Title */}
                        <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text-main)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                            {course.title}
                        </h1>

                        {/* Rating & Date Row */}
                        <div className='d-flex flex-wrap align-items-center gap-4 mb-4 pb-4' style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <div className='d-flex align-items-center gap-2'>
                                <span style={{ fontWeight: 800, color: '#F59E0B', fontSize: '1.1rem' }}>5.0</span>
                                <div className="d-flex" style={{ color: '#F59E0B' }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} style={{ fill: 'currentColor' }} />)}
                                </div>
                                <span className="text-muted small">({(course.enrollments_count / 26).toFixed(0)} reviews)</span>
                            </div>
                            <div className="text-muted small d-flex align-items-center gap-1">
                                <Calendar size={15} style={{ color: '#6366F1' }} />
                                <span>Last updated {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="row g-3 mb-5">
                            {[
                                { icon: <Layers size={22} />, label: 'Level', value: course.level?.name || 'All Levels', color: '#6366F1' },
                                { icon: <Users size={22} />, label: 'Students', value: `${course.enrollments_count?.toLocaleString()} enrolled`, color: '#A855F7' },
                                { icon: <Globe size={22} />, label: 'Language', value: course.language?.name || 'English', color: '#10B981' },
                                { icon: <Clock size={22} />, label: 'Duration', value: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}min`, color: '#F59E0B' },
                            ].map((stat, i) => (
                                <div key={i} className="col-6 col-sm-3">
                                    <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-light)', borderRadius: 16, padding: '1rem', textAlign: 'center', transition: 'all 0.2s' }}>
                                        <span style={{ color: stat.color }}>{stat.icon}</span>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem', marginTop: 2 }}>{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className='mb-4' style={{ background: 'var(--bg-white)', borderRadius: 20, padding: '1.8rem', border: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontWeight: 800, color: '#6366F1', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem' }}>
                                <BookOpen size={20} /> Overview
                            </h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>{course.description}</p>
                        </div>

                        {/* What You'll Learn */}
                        {course.outcomes && course.outcomes.length > 0 && (
                            <div className='mb-4' style={{ background: 'var(--bg-white)', borderRadius: 20, padding: '1.8rem', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ fontWeight: 800, color: '#6366F1', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem' }}>
                                    <Award size={20} /> What You'll Learn
                                </h3>
                                <div className="row g-3">
                                    {course.outcomes.map(outcome => (
                                        <div key={outcome.id} className="col-md-6 d-flex align-items-start gap-2">
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                                <Check size={13} style={{ color: '#22C55E' }} strokeWidth={3} />
                                            </div>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{outcome.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {course.requirements && course.requirements.length > 0 && (
                            <div className='mb-4' style={{ background: 'var(--bg-white)', borderRadius: 20, padding: '1.8rem', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ fontWeight: 800, color: '#6366F1', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem' }}>
                                    <UserCheck size={20} /> Requirements
                                </h3>
                                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                    {course.requirements.map(req => (
                                        <li key={req.id} className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                                            <span style={{ color: '#6366F1', fontWeight: 800, fontSize: '1.3rem', lineHeight: 1 }}>•</span>
                                            {req.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Course Structure */}
                        {course.chapters && course.chapters.length > 0 && (
                            <div className='mb-4' style={{ background: 'var(--bg-white)', borderRadius: 20, padding: '1.8rem', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ fontWeight: 800, color: '#6366F1', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem' }}>
                                    <Layers size={20} /> Course Structure
                                </h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                                    {course.chapters.length} sections • {totalLessons} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}min total
                                </div>
                                <Accordion defaultActiveKey="0" id="courseAccordion" className="accordion-modern">
                                    {course.chapters.map((chapter, index) => (
                                        <Accordion.Item key={chapter.id} eventKey={String(index)}>
                                            <Accordion.Header>
                                                <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                                                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{chapter.title}</span>
                                                    <span style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700 }}>
                                                        {chapter.lessons?.length || 0} lessons
                                                    </span>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body className="p-0">
                                                <ListGroup variant="flush">
                                                    {chapter.lessons?.map(lesson => (
                                                        <ListGroup.Item key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.2rem', background: 'transparent', borderColor: 'var(--border-light)', color: 'var(--text-main)' }}>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Play size={14} style={{ color: '#6366F1' }} />
                                                                </div>
                                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{lesson.title}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                {lesson.is_free_preview === 'yes' ? (
                                                                    <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>Preview</span>
                                                                ) : (
                                                                    <Lock size={14} style={{ color: '#94A3B8' }} />
                                                                )}
                                                                {lesson.duration && (
                                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{lesson.duration} min</span>
                                                                )}
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </div>

                    {/* ── Sticky Price Card Sidebar ── */}
                    <div className='col-lg-4'>
                        <div className="position-sticky" style={{ top: '90px' }}>
                            <div style={{ background: 'var(--bg-white)', borderRadius: 24, border: '1px solid var(--border-light)', boxShadow: '0 20px 50px -10px rgba(99,102,241,0.15)', overflow: 'hidden' }}>
                                {/* Course Image */}
                                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={course.image && (course.image.startsWith('http') ? course.image : `${fileUrl}/storage/${course.image}`)}
                                        alt={course.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                                </div>

                                <div style={{ padding: '1.8rem' }}>
                                    {/* Price */}
                                    <div className="d-flex align-items-baseline gap-2 mb-4">
                                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6366F1' }}>${course.price}</span>
                                        {course.cross_price && (
                                            <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>${course.cross_price}</span>
                                        )}
                                        {course.cross_price && (
                                            <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '3px 10px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700 }}>
                                                {Math.round((1 - course.price / course.cross_price) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Enroll Button */}
                                    <div className="mb-4">
                                        {enrolled ? (
                                            <button style={enrolledBtnStyle} disabled>
                                                <Check size={18} strokeWidth={3} /> Enrolled — Go to Learning
                                            </button>
                                        ) : (
                                            <button style={enrollBtnStyle} onClick={handleEnroll} disabled={enrolling}>
                                                {enrolling ? 'Enrolling...' : 'Enroll Now'} <ChevronRight size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Includes */}
                                    <h6 style={{ fontWeight: 800, color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.7rem', marginBottom: '0.9rem' }}>This course includes:</h6>
                                    <div className="d-flex flex-column gap-3">
                                        {[
                                            { icon: <Infinity size={16} />, text: 'Full lifetime access' },
                                            { icon: <Tv size={16} />, text: 'Access on mobile and TV' },
                                            { icon: <Award size={16} />, text: 'Certificate of completion' },
                                            { icon: <BookOpen size={16} />, text: `${totalLessons} lessons included` },
                                        ].map((item, i) => (
                                            <div key={i} className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                                                <span style={{ color: '#6366F1' }}>{item.icon}</span>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Instructor */}
                                    {course.user && (
                                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                                            <h6 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.8rem' }}>Instructor</h6>
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                                                    {course.user.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{course.user.name}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{course.user.designation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

const enrollBtnStyle = {
    width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    color: 'white', fontWeight: 800, fontSize: '1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)',
    transition: 'all 0.3s',
};

const enrolledBtnStyle = {
    width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'default',
    background: 'rgba(34,197,94,0.12)', color: '#22C55E',
    fontWeight: 800, fontSize: '1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
};

export default Detail
