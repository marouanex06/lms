import React, { useState, useEffect, useRef } from 'react'
import UserSidebar from './UserSidebar'
import { Bell, Search, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { apiUrl } from './config'

const DashboardLayout = ({ children, title, subtitle }) => {
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const notifRef = useRef(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        if (userInfo.role === 'admin') {
            fetchNotifications();
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/notifications`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            });
            const result = await response.json();
            if (result.status === 200) {
                setNotifs(result.data);
            }
        } catch (err) {
            console.error("Failed to load notifications", err);
        }
    };

    const clearNotifs = async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/notifications/mark-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                setNotifs([]);
            }
        } catch (err) {}
    };

    const clearSingleNotif = async (id) => {
        setNotifs(notifs.filter(item => item.id !== id));
        try {
            await fetch(`${apiUrl}/admin/notifications/${id}/mark-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (err) {}
    };
    return (
        <div style={appWrapperStyle}>
            {/* ── Fixed Sidebar ── */}
            <UserSidebar />

            {/* ── Main Canvas (Pushed by Sidebar) ── */}
            <div style={mainCanvasStyle}>
                
                {/* ── Custom Dashboard Topbar ── */}
                <div style={topbarStyle}>
                    <div style={searchWrapperStyle} className="d-none d-md-flex">
                        <Search size={18} color="#94A3B8" />
                        <input type="text" placeholder="Search courses, certificates..." style={searchInputStyle} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }} ref={notifRef}>
                            <div onClick={() => setShowNotifs(!showNotifs)} style={{ position:'relative' }}>
                                <Bell size={22} color="#64748B" />
                                {notifs.length > 0 && <span style={notificationDotStyle}></span>}
                            </div>
                            
                            <AnimatePresence>
                                {showNotifs && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={notifDropdownStyle}
                                    >
                                        <div style={notifHeaderStyle}>
                                            <h6 style={{ margin: 0, fontWeight: 700 }}>Notifications</h6>
                                            {notifs.length > 0 && (
                                                <button onClick={clearNotifs} style={clearBtnStyle}>Mark all read</button>
                                            )}
                                        </div>
                                        <div style={notifListStyle}>
                                            {notifs.length === 0 ? (
                                                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                    <Check size={24} style={{ marginBottom: 8, opacity: 0.5 }} /><br/>
                                                    All caught up!
                                                </div>
                                            ) : (
                                                notifs.map(n => (
                                                    <div key={n.id} style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }} onClick={() => clearSingleNotif(n.id)}>
                                                        <div style={{ minWidth: 8, width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 6 }} />
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>{n.data.title}</p>
                                                            <p style={{ margin: '2px 0 4px 0', fontSize: '0.8rem', color: '#475569' }}>{n.data.message}</p>
                                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div style={dateChipStyle}>
                            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Ambient background blobs inside main canvas */}
                <div style={blob1Style} />
                <div style={blob2Style} />

                {/* ── Content Container ── */}
                <div className="container-fluid py-4 px-lg-5" style={{ position: 'relative', zIndex: 1, maxWidth: 1400 }}>
                    {/* Optional Page Header */}
                    {(title || subtitle) && (
                        <div className="mb-4">
                            {title && <h2 style={pageTitleStyle}>{title}</h2>}
                            {subtitle && <p style={{ color: '#64748B', margin: 0 }}>{subtitle}</p>}
                        </div>
                    )}
                    
                    {/* Page Content */}
                    {children}
                </div>
            </div>
        </div>
    )
}

/* ─── Layout Styles ───── */
const appWrapperStyle = {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-main)',
    fontFamily: "'Inter', 'Outfit', sans-serif",
};

const mainCanvasStyle = {
    marginLeft: '280px', // Matches sidebar width
    flex: 1,
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
};

const topbarStyle = {
    height: 70,
    background: 'var(--bg-white)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
};

const searchWrapperStyle = {
    alignItems: 'center',
    gap: 10,
    background: 'var(--bg-main)',
    padding: '8px 16px',
    borderRadius: 50,
    width: 350,
    border: '1px solid var(--border-light)',
};

const searchInputStyle = {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    width: '100%',
};

const notificationDotStyle = {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#EF4444',
    border: '2px solid var(--bg-white)',
};

const blob1Style = {
    position: 'fixed', top: -100, right: -100,
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
    filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
};

const blob2Style = {
    position: 'fixed', bottom: -100, left: '20%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
    filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
};

const pageTitleStyle = {
    fontWeight: 800, 
    fontSize: '1.6rem', 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: 4, 
    color: 'var(--text-main)'
};

const dateChipStyle = {
    background: 'var(--bg-main)', color: 'var(--text-muted)',
    border: '1px solid var(--border-light)',
    padding: '6px 14px', borderRadius: 50, fontWeight: 600, fontSize: '0.82rem',
};

const notifDropdownStyle = {
    position: 'absolute',
    top: 40,
    right: -10,
    width: 320,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-light)',
    overflow: 'hidden',
    zIndex: 1000
};

const notifHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-light)',
    background: '#f8fafc'
};

const clearBtnStyle = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0
};

const notifListStyle = {
    maxHeight: 300,
    overflowY: 'auto'
};

export default DashboardLayout
