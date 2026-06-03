import React, { useState, useEffect } from 'react'
import Layout from '../../common/Layout'
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCheckCircle } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl, fileUrl } from '../../common/config';
import { toast } from 'react-toastify';
import CourseReview from './CourseReview';


const WatchCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progress, setProgress] = useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

    useEffect(() => {
        if (!id || id === 'undefined') {
            toast.error('Invalid course. Please enroll in a course first.');
            navigate('/account/my-learning');
            return;
        }

        // Fetch real course data from public API
        fetch(`${fileUrl}/api/public/courses/${id}`)
            .then(r => r.json())
            .then(result => {
                if (result.status === 200 && result.data) {
                    setCourse(result.data);
                    const allLessons = result.data.chapters?.flatMap(ch => ch.lessons) || [];
                    if (allLessons.length > 0) {
                        setActiveLesson(allLessons[0]);
                    }
                } else {
                    toast.error('Course not found');
                    navigate('/account/my-learning');
                }
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load course');
                navigate('/account/my-learning');
            })
            .finally(() => setLoading(false));

        // Fetch real progress
        if (userInfo?.token) {
            fetch(`${apiUrl}/course-progress/${id}`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            })
            .then(r => r.json())
            .then(result => {
                if (result.status === 200) {
                    setProgress(result.percentage || 0);
                    setCompletedLessons(result.completed_lessons || []);
                }
            })
            .catch(err => console.error(err));
        }
    }, [id]);

    const handleMarkComplete = async () => {
        if (!activeLesson || !course) return;
        if (completedLessons.includes(activeLesson.id)) return;

        try {
            const res = await fetch(`${apiUrl}/lesson-complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    lesson_id: activeLesson.id,
                    course_id: course.id
                })
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                const newCompleted = [...completedLessons, activeLesson.id];
                setCompletedLessons(newCompleted);
                
                // Recalculate progress
                let totalLessons = 0;
                course.chapters?.forEach(ch => totalLessons += ch.lessons?.length || 0);
                const newProgress = totalLessons > 0 ? Math.round((newCompleted.length / totalLessons) * 100) : 0;
                setProgress(newProgress);
                toast.success('Lesson marked as complete!');
            } else {
                toast.error('Failed to mark lesson complete');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error saving progress');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className='container py-5 text-center'>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!course) return null;

    return (
        <Layout>
            <section className='section-5 my-5'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            {/* Video Player */}
                            <div className='video mb-4 shadow-sm bg-dark' style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                {activeLesson?.youtube_id ? (
                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                        <iframe 
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            src={`https://www.youtube.com/embed/${activeLesson.youtube_id}`} 
                                            title={activeLesson.title}
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : activeLesson?.video ? (
                                    <video
                                        key={activeLesson.id}
                                        width="100%"
                                        height="450"
                                        controls
                                        autoPlay
                                        style={{ backgroundColor: '#000' }}
                                    >
                                        <source src={`${fileUrl}/storage/${activeLesson.video}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center text-white"
                                        style={{ height: '450px' }}
                                    >
                                        <div className="text-center">
                                            <MdSlowMotionVideo size={60} className="mb-3 opacity-50" />
                                            <p className="mb-0">No video available for this lesson</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mark as Complete & Meta */}
                            <div className='meta-content p-4 bg-white shadow-sm' style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3'>
                                    <h3 className='mb-0 fw-bold fs-4 text-dark'>{activeLesson?.title || 'Select a lesson'}</h3>
                                    {activeLesson && (
                                        <button 
                                            className={`btn rounded-pill px-4 fw-bold ${completedLessons.includes(activeLesson.id) ? 'btn-success' : 'btn-primary'}`}
                                            onClick={handleMarkComplete}
                                            disabled={completedLessons.includes(activeLesson.id)}
                                        >
                                            {completedLessons.includes(activeLesson.id) ? (
                                                <><FaCheckCircle className="me-2" /> Completed</>
                                            ) : (
                                                'Mark as Complete'
                                            )}
                                        </button>
                                    )}
                                </div>
                                {activeLesson?.description && (
                                    <div className="text-muted" dangerouslySetInnerHTML={{ __html: activeLesson.description }} />
                                )}
                            </div>

                            {/* Course Review Section */}
                            <div className="mt-4">
                                <CourseReview courseId={id} />
                            </div>
                        </div>

                        {/* Sidebar - Course Structure */}
                        <div className='col-md-4'>
                            <div className='card shadow-sm border-0' style={{ borderRadius: '16px' }}>
                                <div className='card-body p-4'>
                                    <div className='h5 fw-bold mb-3 text-primary'>
                                        {course.title}
                                    </div>
                                    <div className='mb-4 bg-light p-3 rounded'>
                                        <div className="d-flex justify-content-between mb-2">
                                            <small className="text-muted fw-semibold">Course Progress</small>
                                            <small className="fw-bold text-success">{progress}%</small>
                                        </div>
                                        <ProgressBar now={progress} variant="success" style={{ height: '8px', borderRadius: '4px' }} />
                                    </div>

                                    <Accordion defaultActiveKey="0" flush id="courseWatchAccordion" className="course-accordion">
                                        {course.chapters?.map((chapter, idx) => (
                                            <Accordion.Item key={chapter.id} eventKey={String(idx)} style={{ border: 'none', borderBottom: '1px solid #F1F5F9' }}>
                                                <Accordion.Header className="fw-bold">{chapter.title}</Accordion.Header>
                                                <Accordion.Body className='p-0'>
                                                    <ul className='lessons mb-0 list-unstyled'>
                                                        {chapter.lessons?.map(lesson => {
                                                            const isCompleted = completedLessons.includes(lesson.id);
                                                            const isActive = activeLesson?.id === lesson.id;
                                                            return (
                                                                <li
                                                                    key={lesson.id}
                                                                    className={`px-3 py-3 d-flex align-items-center justify-content-between border-bottom lesson-item ${isActive ? 'bg-primary bg-opacity-10' : ''}`}
                                                                    style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                                                    onClick={() => setActiveLesson(lesson)}
                                                                >
                                                                    <div className="d-flex align-items-center pe-3">
                                                                        <MdSlowMotionVideo 
                                                                            size={20} 
                                                                            className={`me-3 ${isActive ? 'text-primary' : 'text-muted'}`} 
                                                                        />
                                                                        <span className={`${isActive ? 'text-primary fw-bold' : 'text-dark fw-medium'}`} style={{ fontSize: '0.95rem' }}>{lesson.title}</span>
                                                                    </div>
                                                                    {isCompleted && (
                                                                        <IoMdCheckmarkCircleOutline className="text-success" size={24} />
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default WatchCourse
