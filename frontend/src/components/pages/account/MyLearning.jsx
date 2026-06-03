import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../common/DashboardLayout';
import CourseEnrolled from '../../common/CourseEnrolled';
import { BookOpen } from 'lucide-react';

import { apiUrl } from '../../common/config';

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        
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
                const userCourses = result.data || [];
                setCourses(userCourses);
            }
        })
        .catch(err => console.error('Failed to load my learning', err))
        .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout 
            title={<><BookOpen size={28} style={{ color: '#6366F1', marginRight: 10 }} /> My Learning</>}
            subtitle="Pick up exactly where you left off and complete your courses."
        >
            <div className='row gy-4 mt-2'>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : courses.length === 0 ? (
                    <div style={emptyStateStyle}>
                        <BookOpen size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                        <h4 style={{ fontWeight: 700, color: '#0F172A' }}>No courses yet</h4>
                        <p style={{ color: '#64748B' }}>You haven't enrolled in any courses yet.</p>
                    </div>
                ) : (
                    courses.map(course => (
                        <CourseEnrolled key={course.id} course={course} />
                    ))
                )}
            </div>
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

export default MyLearning
