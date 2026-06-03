import React, { useContext } from 'react'
import { User, LayoutDashboard, GraduationCap, MonitorPlay, Users, KeyRound, LogOut, ChevronRight, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const UserSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const isAdmin = userInfo.role === 'admin';

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/account/login');
    }

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { to: '/account/profile', icon: <User size={18} />, label: 'My Profile' },
        { to: '/account/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/account/my-learning', icon: <GraduationCap size={18} />, label: 'My Learning' },
        ...(isAdmin ? [
            { to: '/account/my-courses', icon: <MonitorPlay size={18} />, label: 'My Courses' },
            { to: '/account/student-progress', icon: <Users size={18} />, label: 'Student Progress' },
            { to: '/account/reviews', icon: <MessageSquare size={18} />, label: 'Reviews' },
        ] : []),
        { to: '/account/change-password', icon: <KeyRound size={18} />, label: 'Security' },
    ];

    return (
        <div style={sidebarWrapStyle}>
            
            {/* Top Brand Area */}
            <div style={brandAreaStyle}>
                <div style={logoCircleStyle}>
                    <GraduationCap size={20} color="white" />
                </div>
                <span style={brandTextStyle}>SmartLearn</span>
            </div>

            {/* Back to Site Button */}
            <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
                <Link to="/" style={backToSiteStyle}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    <ArrowLeft size={16} />
                    Back to Website
                </Link>
            </div>

            {/* Nav Items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 1rem', flex: 1, overflowY: 'auto' }}>
                {navItems.map((item) => {
                    const active = isActive(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            style={active ? activeLinkStyle : linkStyle}
                            onMouseEnter={e => {
                                if (!active) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.color = '#fff';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!active) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#94A3B8';
                                }
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom User Area */}
            <div style={bottomAreaStyle}>
                <div style={avatarSectionStyle}>
                    <div style={avatarStyle}>
                        {(userInfo.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {userInfo.name || 'User'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                            {isAdmin ? 'Instructor' : 'Student'}
                        </div>
                    </div>
                    <a href="#" onClick={handleLogout} style={logoutBtnStyle} title="Logout"
                       onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={16} color="#EF4444" />
                    </a>
                </div>
            </div>
        </div>
    )
}

const sidebarWrapStyle = {
    background: '#0F172A', // Deep dark blue
    width: '280px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    zIndex: 1000,
};

const brandAreaStyle = {
    padding: '2rem 1.5rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
};

const logoCircleStyle = {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
};

const brandTextStyle = {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.2rem',
    letterSpacing: '-0.02em',
};

const backToSiteStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#CBD5E1',
    background: 'rgba(255,255,255,0.05)',
    padding: '0.6rem 1rem',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s',
};

const baseLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.88rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
};

const linkStyle = {
    ...baseLinkStyle,
    color: '#94A3B8',
    background: 'transparent',
};

const activeLinkStyle = {
    ...baseLinkStyle,
    color: 'white',
    background: 'rgba(99,102,241,0.15)',
    borderLeft: '3px solid #6366F1',
};

const bottomAreaStyle = {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
};

const avatarSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.03)',
    padding: '0.8rem',
    borderRadius: 12,
};

const avatarStyle = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 700,
};

const logoutBtnStyle = {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    transition: 'all 0.2s',
};

export default UserSidebar
