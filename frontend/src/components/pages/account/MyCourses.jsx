import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../common/DashboardLayout';
import { Link } from 'react-router-dom';
import { apiUrl, fileUrl } from '../../common/config';
import { FaBriefcase, FaUsers, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = getToken();
                const res = await fetch(`${apiUrl}/courses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setCourses(Array.isArray(data) ? data : data.data || []);
                } else {
                    toast.error('Failed to load courses');
                }
            } catch (err) {
                toast.error('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const toggleStatus = async (courseId) => {
        try {
            const token = getToken();
            const res = await fetch(`${apiUrl}/courses/${courseId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const data = await res.json();
            if (res.ok) {
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: data.data?.status ?? (c.status === '1' ? '0' : '1') } : c));
                toast.success(data.message || 'Course status updated!');
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch (err) {
            toast.error('Error connecting to server');
        }
    };

    return (
        <DashboardLayout 
            title={<><FaBriefcase size={28} style={{ color: '#6366F1', marginRight: 10 }} /> Instructor Courses</>}
            subtitle="Manage your created courses, track enrollments, and update content."
        >
            <div className='d-flex justify-content-end mb-4'>
                <Link to="/account/courses/create" className='btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4'>
                    + Create New Course
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-5">Loading...</div>
            ) : courses.length === 0 ? (
                <div style={emptyStateStyle}>
                    <FaBriefcase size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                    <h4 style={{ fontWeight: 700, color: '#0F172A' }}>No courses yet</h4>
                    <p style={{ color: '#64748B' }}>You haven't created any courses yet.</p>
                </div>
            ) : (
                <div className='row gy-4'>
                    {courses.map((course) => (
                        <div key={course.id} className='col-md-6 col-lg-4'>
                            <div className='card border-0 shadow-sm h-100 course-card' style={{ borderRadius: 20, overflow: 'hidden' }}>
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    {course.image ? (
                                        <img 
                                            src={course.image.startsWith('http') ? course.image : `${fileUrl}/storage/${course.image}`} 
                                            className='card-img-top w-100 h-100 object-fit-cover' 
                                            alt={course.title}
                                        />
                                    ) : (
                                        <img
                                            src={`https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                                            alt="Cover Fallback"
                                            className='card-img-top w-100 h-100 object-fit-cover'
                                        />
                                    )}
                                </div>
                                <div className='card-body d-flex flex-column p-4'>
                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                        <h5 className='card-title mb-0 fs-6 fw-bold flex-grow-1 text-primary'>{course.title}</h5>
                                        <span className={`badge ${course.status == '1' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                            {course.status == '1' ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    
                                    <div className='d-flex justify-content-between mb-3 text-muted small fw-medium mt-3'>
                                        <div className="d-flex align-items-center gap-1">
                                            <FaBriefcase color="#6366F1" /> 
                                            {course.level ? course.level.name : 'All Levels'}
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <FaUsers color="#6366F1" /> {course.enrollments_count || 0}
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <FaStar className='text-warning' /> 5.0
                                        </div>
                                    </div>

                                    <div className='mt-auto border-top pt-3 mt-3'>
                                        <div className='d-flex align-items-center mb-3'>
                                            <span className='fs-5 fw-bold text-primary'>${course.price || '0.00'}</span>
                                            {course.cross_price && (
                                                <span className='text-muted text-decoration-line-through ms-2 small fw-semibold'>
                                                    ${course.cross_price}
                                                </span>
                                            )}
                                        </div>
                                        <div className='d-grid gap-2'>
                                            <button
                                                className={`btn btn-sm w-100 fw-bold rounded-pill ${course.status == '1' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                                onClick={() => toggleStatus(course.id)}
                                            >
                                                {course.status == '1' ? 'Unpublish' : 'Publish'}
                                            </button>
                                            <Link to={`/account/courses/edit/${course.id}`} className='btn btn-sm btn-primary w-100 fw-bold rounded-pill'>Edit Course</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}

const emptyStateStyle = {
    background: 'white',
    borderRadius: 24,
    padding: '4rem 2rem',
    textAlign: 'center',
    boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

export default MyCourses