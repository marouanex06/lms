import React, { useState, useEffect } from 'react'
import Course from './Course'
import { apiUrl } from './config';
import { Sparkles } from 'lucide-react'

const FeaturedCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/public/courses?is_featured=yes`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setCourses(data.data.slice(0, 4)); // Only show top 4
                }
            })
            .catch(err => console.error("Failed to fetch featured courses"));
    }, []);

    return (
        <section style={sectionStyle}>
            {/* Top decorative gradient line */}
            <div style={topLineStyle}></div>
            
            <div className="container py-5">
                <div style={headerStyle} className="mb-5 text-center">
                    <div style={badgeWrapStyle} className="d-inline-flex align-items-center mb-3">
                        <Sparkles size={16} color="#A855F7" />
                        <span style={badgeTextStyle}>Trending Now</span>
                    </div>
                    <h2 style={titleStyle}>Featured Courses</h2>
                    <p style={subtitleStyle} className="mx-auto">
                        Hand-picked premium courses to help you accelerate your career and master new skills.
                    </p>
                </div>
                <div className="row g-4 justify-content-center">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <Course
                                key={course.id}
                                course={course}
                                customClasses="col-lg-3 col-md-6"
                            />
                        ))
                    ) : (
                        <p className="text-muted text-center py-5">No courses available yet.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

/* --- Styles --- */
const sectionStyle = {
    background: 'var(--bg-main)',
    padding: '4rem 0',
    position: 'relative',
};

const topLineStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)',
};

const headerStyle = {
    maxWidth: 700,
    margin: '0 auto',
};

const badgeWrapStyle = {
    background: 'rgba(168,85,247,0.1)',
    border: '1px solid rgba(168,85,247,0.2)',
    padding: '6px 16px',
    borderRadius: 50,
    gap: 8,
};

const badgeTextStyle = {
    fontWeight: 700, 
    fontSize: '0.85rem', 
    color: '#A855F7'
};

const titleStyle = {
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 800,
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
};

const subtitleStyle = {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
};

export default FeaturedCourses
