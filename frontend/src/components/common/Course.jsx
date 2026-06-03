import React from 'react'
import { Link } from 'react-router-dom';
import { fileUrl } from './config';
import { BookOpen, Users, Star } from 'lucide-react';

const Course = ({ course, customClasses }) => {
    return (
        <div className={customClasses}>
            <Link to={`/detail/${course.id}`} style={linkWrapperStyle}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                    const img = e.currentTarget.querySelector('.course-img');
                    if(img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                    const img = e.currentTarget.querySelector('.course-img');
                    if(img) img.style.transform = 'scale(1)';
                }}
            >
                {/* ── Image Section ── */}
                <div style={imageWrapStyle}>
                    {course.image ? (
                        <img
                            src={course.image.startsWith('http') ? course.image : `${fileUrl}/storage/${course.image}`}
                            alt={course.title}
                            className="course-img"
                            style={imageStyle}
                        />
                    ) : (
                        <img
                            src={`https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                            alt={course.title}
                            className="course-img"
                            style={imageStyle}
                        />
                    )}
                    
                    {/* Category Badge */}
                    {course.category && (
                        <div style={badgeStyle}>
                            {course.category.name}
                        </div>
                    )}
                </div>
                
                {/* ── Content Section ── */}
                <div style={contentWrapStyle}>
                    <h5 style={titleStyle} title={course.title}>
                        {course.title}
                    </h5>
                    
                    <div style={metaWrapStyle}>
                        <div style={metaItemStyle}>
                            <BookOpen size={14} color="#6366F1" />
                            <span>{course.level ? course.level.name : 'All Levels'}</span>
                        </div>
                        <div style={metaItemStyle}>
                            <Users size={14} color="#6366F1" />
                            <span>{course.enrollments_count || 0}</span>
                        </div>
                        <div style={metaItemStyle}>
                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                            <span>5.0</span>
                        </div>
                    </div>
                </div>

                {/* ── Footer / Price Section ── */}
                <div style={footerStyle}>
                    <div style={priceBadgeStyle}>
                        <span style={priceStyle}>${course.price || '0.00'}</span>
                        {course.cross_price && (
                            <span style={crossPriceStyle}>
                                ${course.cross_price}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

/* --- Styles --- */
const linkWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    textDecoration: 'none',
    background: 'var(--bg-white)',
    borderRadius: 20,
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
};

const imageWrapStyle = {
    position: 'relative',
    height: 220,
    overflow: 'hidden',
    backgroundColor: 'var(--bg-main)',
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
};

const placeholderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    background: 'var(--bg-main)',
};

const badgeStyle = {
    position: 'absolute',
    top: 16,
    left: 16,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    color: '#0F172A',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: '0.75rem',
    fontWeight: 700,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 1,
};

const contentWrapStyle = {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
};

const titleStyle = {
    fontWeight: 800,
    color: 'var(--text-main)',
    fontSize: '1.1rem',
    lineHeight: 1.4,
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '3rem',
};

const metaWrapStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px dashed var(--border-light)',
};

const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    fontWeight: 600,
};

const footerStyle = {
    padding: '0 1.5rem 1.5rem',
    background: 'transparent',
};

const priceBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    padding: '8px 16px',
    borderRadius: 50,
};

const priceStyle = {
    fontWeight: 800,
    color: '#6366F1',
    fontSize: '1rem',
};

const crossPriceStyle = {
    color: 'var(--text-muted)',
    textDecoration: 'line-through',
    fontSize: '0.8rem',
    fontWeight: 600,
};

export default Course
