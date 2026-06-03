import React, { useState, useEffect } from 'react'
import { Container, Nav, Navbar, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Search, BookOpen, UserCircle, Menu, Moon, Sun } from 'lucide-react'

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    
    // Theme state
    const [theme, setTheme] = useState(localStorage.getItem('lms_theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lms_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/courses?keyword=${keyword}`);
        } else {
            navigate('/courses');
        }
    };

    const isDark = theme === 'dark';

    return (
        <Navbar 
            expand="lg" 
            className="header py-3"
            style={{
                background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)',
            }}
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <div className="bg-gradient-primary text-white p-2 d-flex align-items-center justify-content-center" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)' }}>
                        <BookOpen size={24} color="#fff" />
                    </div>
                    <strong className="text-gradient" style={{ fontSize: '1.4rem' }}>Smart Learning</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" className="border-0" style={{ background: 'transparent' }}>
                    <Menu size={28} style={{ color: isDark ? '#94A3B8' : '#6366F1' }} />
                </Navbar.Toggle>
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        <Nav.Link 
                            as={Link} 
                            to="/courses" 
                            className="fw-semibold px-lg-3"
                            style={{ color: isDark ? '#94A3B8' : '#6366F1' }}
                        >
                            All Courses
                        </Nav.Link>
                    </Nav>
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                        <Form className="d-flex" onSubmit={handleSearch}>
                            <div 
                                className="custom-search-box rounded-pill px-3 py-1 d-flex align-items-center w-100"
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.07)' : '#F1F5F9',
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                                }}
                            >
                                <Search size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
                                <input 
                                    type="text" 
                                    className="form-control border-0 bg-transparent shadow-none"
                                    placeholder="Search course here" 
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
                                />
                            </div>
                        </Form>
                        <div className="d-flex align-items-center gap-3">
                            <button 
                                onClick={toggleTheme} 
                                className="btn rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ 
                                    width: '42px', height: '42px',
                                    background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                                    color: isDark ? '#F59E0B' : '#6366F1',
                                    transition: 'all 0.3s',
                                }}
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
                            </button>
                            <Link 
                                to='/account/dashboard' 
                                className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)', border: 'none', fontWeight: 700 }}
                            >
                                <UserCircle size={20} strokeWidth={2.5} />
                                <span>My Account</span>
                            </Link>
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
