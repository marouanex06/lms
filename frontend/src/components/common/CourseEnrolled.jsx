import React from 'react'
import { Link } from 'react-router-dom';
import { fileUrl } from './config';
import { Layers, Star, Play, CheckCircle, BookOpen } from 'lucide-react';

const CourseEnrolled = ({ course }) => {
    const progress = course.progress_percentage || 0;
    const isCompleted = progress === 100;

    const cardColors = [
        'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
        'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    ];
    const gradient = cardColors[(course.id || 0) % cardColors.length];

    return (
        <div className="col-md-4">
            <div style={{
                background: 'var(--bg-white, #1E293B)',
                borderRadius: 20,
                border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
            >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0 }}>
                    {course.image ? (
                        <img
                            src={course.image.startsWith('http') ? course.image : `${fileUrl}/storage/${course.image}`}
                            alt={course.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            background: gradient,
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: 8
                        }}>
                            <BookOpen size={36} color="rgba(255,255,255,0.7)" />
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>No Cover Image</span>
                        </div>
                    )}
                    {isCompleted && (
                        <div style={{
                            position: 'absolute', top: 10, right: 10,
                            background: '#22C55E', color: 'white',
                            padding: '3px 10px', borderRadius: 50,
                            fontSize: '0.75rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: 4
                        }}>
                            <CheckCircle size={12} /> Completed
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        fontWeight: 700, fontSize: '0.9rem',
                        color: 'var(--text-main, #F1F5F9)',
                        marginBottom: 12, lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                        {course.title || 'Untitled Course'}
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94A3B8)', fontWeight: 600 }}>Progress</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCompleted ? '#22C55E' : '#6366F1' }}>{progress}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 50, height: 6, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 50,
                                background: isCompleted ? '#22C55E' : 'linear-gradient(90deg, #6366F1, #A855F7)',
                                width: `${progress}%`, transition: 'width 0.5s'
                            }} />
                        </div>
                    </div>

                    {/* Meta */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)',
                        color: 'var(--text-muted, #94A3B8)', fontSize: '0.8rem', fontWeight: 500
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Layers size={12} style={{ color: '#6366F1' }} />
                            {course.level?.name || 'All Levels'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            0.0
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '0 1rem 1rem' }}>
                    <Link
                        to={`/account/watch-course/${course.id}`}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            width: '100%', padding: '10px 0', borderRadius: 12,
                            fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
                            background: isCompleted
                                ? 'rgba(34,197,94,0.15)'
                                : 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                            color: isCompleted ? '#22C55E' : 'white',
                            border: isCompleted ? '1px solid rgba(34,197,94,0.3)' : 'none',
                            boxShadow: isCompleted ? 'none' : '0 6px 20px rgba(99,102,241,0.35)',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {isCompleted ? (
                            <><CheckCircle size={15} /> Review Course</>
                        ) : (
                            <><Play size={15} style={{ fill: 'white' }} /> {progress > 0 ? 'Continue Learning' : 'Start Learning'}</>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CourseEnrolled

