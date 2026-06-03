import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Layers, Code, Palette, Briefcase, Database, Monitor, Shield, Cpu } from 'lucide-react'

/* ─── Fake Categories ─── */
const FAKE_CATEGORIES = [
    { id: 1, name: 'Development' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Data Science' },
    { id: 5, name: 'Cybersecurity' },
    { id: 6, name: 'Cloud & DevOps' },
    { id: 7, name: 'AI & ML' },
    { id: 8, name: 'Mobile Apps' },
];

const FeaturedCtegories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories(FAKE_CATEGORIES);
    }, []);

    const getCategoryStyles = (index) => {
        const styles = [
            { icon: <Code size={28}/>, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
            { icon: <Palette size={28}/>, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
            { icon: <Briefcase size={28}/>, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            { icon: <Database size={28}/>, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
            { icon: <Monitor size={28}/>, color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
            { icon: <Shield size={28}/>, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
            { icon: <Cpu size={28}/>, color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
            { icon: <Layers size={28}/>, color: '#F43F5E', bg: 'rgba(244,63,94,0.1)' },
        ];
        return styles[index % styles.length];
    };

    return (
        <section style={sectionStyle}>
            <div className="container py-5">
                <div style={headerStyle} className="mb-5 text-center">
                    <div style={badgeWrapStyle} className="d-inline-flex align-items-center mb-3">
                        <Compass size={16} color="#6366F1" />
                        <span style={badgeTextStyle}>Top Categories</span>
                    </div>
                    <h2 style={titleStyle}>Explore programs to grow</h2>
                    <p style={subtitleStyle} className="mx-auto">
                        Discover curated learning paths designed to help you excel in your professional and personal growth journey.
                    </p>
                </div>

                <div className='row g-4 justify-content-center'>
                    {categories.map((category, index) => {
                        const cStyle = getCategoryStyles(index);
                        return (
                            <div key={category.id} className='col-sm-6 col-md-4 col-lg-3'>
                                <Link 
                                    to={`/courses?category_id=${category.id}`} 
                                    style={cardLinkStyle}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = `0 15px 30px ${cStyle.color}33`;
                                        e.currentTarget.style.borderColor = cStyle.color;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = 'var(--border-light)';
                                    }}
                                >
                                    <div style={cardInnerStyle}>
                                        <div style={{ ...iconWrapStyle, background: cStyle.bg, color: cStyle.color }}>
                                            {cStyle.icon}
                                        </div>
                                        <h5 style={cardTitleStyle}>{category.name}</h5>
                                        <div style={{ ...exploreBtnStyle, color: cStyle.color }}>
                                            <span>Explore courses</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

/* --- Styles --- */
const sectionStyle = {
    background: 'var(--bg-white)',
    padding: '4rem 0',
};

const headerStyle = {
    maxWidth: 700,
    margin: '0 auto',
};

const badgeWrapStyle = {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    padding: '6px 16px',
    borderRadius: 50,
    gap: 8,
};

const badgeTextStyle = {
    fontWeight: 700, 
    fontSize: '0.85rem', 
    color: '#6366F1'
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

const cardLinkStyle = {
    textDecoration: 'none',
    display: 'block',
    height: '100%',
    background: 'var(--bg-main)',
    borderRadius: 24,
    border: '1px solid var(--border-light)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const cardInnerStyle = {
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    height: '100%',
};

const iconWrapStyle = {
    width: 70, height: 70,
    borderRadius: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '0.5rem',
};

const cardTitleStyle = {
    fontWeight: 800,
    color: 'var(--text-main)',
    fontSize: '1.1rem',
    margin: 0,
};

const exploreBtnStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: 4,
    marginTop: 'auto',
    fontWeight: 700,
    fontSize: '0.9rem',
};

export default FeaturedCtegories
