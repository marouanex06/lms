import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom';
import Course from './../common/Course';
import Layout from './../common/Layout';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { apiUrl } from '../common/config';

const Courses = () => {
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [sort, setSort] = useState('newest');
    const [allCourses, setAllCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch filter options (categories & levels)
    useEffect(() => {
        fetch(`${apiUrl}/public/course-options`)
            .then(r => r.json())
            .then(data => {
                setCategories(data.categories || []);
                setLevels(data.levels || []);
            })
            .catch(() => {});
    }, []);

    // Fetch courses from real API
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword)          params.set('keyword', keyword);
        if (selectedCategory) params.set('category_id', selectedCategory);
        if (selectedLevel)    params.set('level_id', selectedLevel);
        if (sort === '1')     params.set('sort', '1');

        fetch(`${apiUrl}/public/courses?${params.toString()}`)
            .then(r => r.json())
            .then(data => {
                const list = Array.isArray(data) ? data : data.data || [];
                // sort client-side for price
                if (sort === 'price_asc')  list.sort((a,b) => a.price - b.price);
                if (sort === 'price_desc') list.sort((a,b) => b.price - a.price);
                setAllCourses(list);
            })
            .catch(() => setAllCourses([]))
            .finally(() => setLoading(false));
    }, [keyword, selectedCategory, selectedLevel, sort]);

    const clearFilters = () => {
        setKeyword('');
        setSelectedCategory('');
        setSelectedLevel('');
        setSort('newest');
    };

    const hasFilters = keyword || selectedCategory || selectedLevel;
    const filteredCourses = allCourses;

    return (
        <Layout>
            {/* Page Header */}
            <div style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', padding: '2rem 0' }}>
                <div className='container'>
                    <h1 className="fw-bolder mb-1" style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Explore All Courses</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                            <li className="breadcrumb-item active text-muted" aria-current="page">Courses</li>
                        </ol>
                    </nav>
                </div>
            </div>
            
            <div className='container py-5'>
                <div className='row g-4'>
                    {/* ── Sidebar Filters ── */}
                    <div className='col-lg-3'>
                        <div className='sticky-top' style={{ top: '90px', ...filterCardStyle }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h5 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
                                    <SlidersHorizontal size={20} color="#6366F1" />
                                    Filters
                                </h5>
                                {hasFilters && (
                                    <button onClick={clearFilters} style={clearBtnStyle}>
                                        <X size={14} /> Clear
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div style={filterGroupStyle}>
                                <label style={filterLabelStyle}>Search</label>
                                <form onSubmit={e => e.preventDefault()}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                        <input
                                            type="text"
                                            placeholder='Search courses...'
                                            value={keyword}
                                            onChange={e => setKeyword(e.target.value)}
                                            style={searchInputStyle}
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Category */}
                            <div style={filterGroupStyle}>
                                <label style={filterLabelStyle}>Category</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {categories.map(cat => (
                                        <label key={cat.id} style={radioLabelStyle}>
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === String(cat.id)}
                                                onChange={() => setSelectedCategory(selectedCategory === String(cat.id) ? '' : String(cat.id))}
                                                style={{ accentColor: '#6366F1' }}
                                            />
                                            <span style={{ color: 'var(--text-main)' }}>{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Level */}
                            <div style={{ ...filterGroupStyle, borderBottom: 'none', paddingBottom: 0 }}>
                                <label style={filterLabelStyle}>Level</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {levels.map(lvl => (
                                        <label key={lvl.id} style={radioLabelStyle}>
                                            <input
                                                type="radio"
                                                name="level"
                                                checked={selectedLevel === String(lvl.id)}
                                                onChange={() => setSelectedLevel(selectedLevel === String(lvl.id) ? '' : String(lvl.id))}
                                                style={{ accentColor: '#6366F1' }}
                                            />
                                            <span style={{ color: 'var(--text-main)' }}>{lvl.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Course Grid ── */}
                    <div className='col-lg-9'>
                        {/* Topbar */}
                        <div style={topbarStyle}>
                            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                                Showing <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{filteredCourses.length}</span> courses
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Sort:</span>
                                <select
                                    style={selectStyle}
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low → High</option>
                                    <option value="price_desc">Price: High → Low</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="row g-4 mt-1">
                            {loading ? (
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border" style={{ color: '#6366F1' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading courses...</p>
                                </div>
                            ) : filteredCourses.length === 0 ? (
                                <div className="col-12 text-center py-5">
                                    <div style={{ background: 'var(--bg-white)', borderRadius: 24, padding: '4rem 2rem', border: '1px solid var(--border-light)' }}>
                                        <Search size={56} style={{ color: '#CBD5E1', marginBottom: 16 }} />
                                        <h4 style={{ fontWeight: 800, color: 'var(--text-main)' }}>No courses found</h4>
                                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search term.</p>
                                        <button onClick={clearFilters} style={{ background: '#6366F1', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 28px', fontWeight: 700, cursor: 'pointer' }}>
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                filteredCourses.map(course => (
                                    <Course
                                        key={course.id}
                                        course={course}
                                        customClasses="col-lg-4 col-md-6"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

/* --- Styles --- */
const filterCardStyle = {
    background: 'var(--bg-white)',
    borderRadius: 20,
    padding: '1.5rem',
    border: '1px solid var(--border-light)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
};

const filterGroupStyle = {
    paddingBottom: '1.2rem',
    marginBottom: '1.2rem',
    borderBottom: '1px solid var(--border-light)',
};

const filterLabelStyle = {
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    marginBottom: '0.8rem',
    display: 'block',
};

const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
};

const searchInputStyle = {
    width: '100%',
    border: '1px solid var(--border-light)',
    borderRadius: 50,
    padding: '9px 14px 9px 38px',
    fontSize: '0.9rem',
    outline: 'none',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
};

const clearBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(239,68,68,0.08)',
    border: 'none',
    color: '#EF4444',
    fontWeight: 700,
    fontSize: '0.82rem',
    padding: '6px 12px',
    borderRadius: 50,
    cursor: 'pointer',
};

const topbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--bg-white)',
    padding: '1rem 1.5rem',
    borderRadius: 16,
    border: '1px solid var(--border-light)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
};

const selectStyle = {
    border: '1px solid var(--border-light)',
    borderRadius: 50,
    padding: '6px 16px',
    fontSize: '0.875rem',
    fontWeight: 600,
    outline: 'none',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    cursor: 'pointer',
};

export default Courses
