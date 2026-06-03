import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, BookOpen } from "lucide-react";

export default function Footer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        setIsLoggedIn(!!userInfo?.token);
    }, []);

    return (
        <footer className="pt-5 mt-5 border-top">
            <div className="container py-5">
                <div className="row gy-5">
                    <div className="col-lg-4 pe-lg-5">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="bg-gradient-primary text-white p-2 d-flex align-items-center justify-content-center" style={{ borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                                <BookOpen size={24} />
                            </div>
                            <h4 className="mb-0 fw-bold text-gradient">Smart Learning</h4>
                        </div>
                        <p className="text-muted mb-4 pe-lg-4">
                            Join our Learning Management System and explore a wide range of premium courses to enhance your skills and achieve your goals anywhere, anytime.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                <Youtube size={18} />
                            </a>
                            <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                    
                    <div className={`col-lg-2 col-md-4 col-sm-6 ${isLoggedIn ? 'offset-lg-2' : ''}`}>
                        <h5 className="fw-bold mb-4">Product</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><Link to="/courses" className="text-decoration-none transition-all text-muted">Features</Link></li>
                            <li><Link to="/courses" className="text-decoration-none transition-all text-muted">Pricing</Link></li>
                            <li><Link to="/courses" className="text-decoration-none transition-all text-muted">Testimonials</Link></li>
                        </ul>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-6">
                        <h5 className="fw-bold mb-4">Company</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3">
                            <li><Link to="/" className="text-decoration-none transition-all text-muted">About Us</Link></li>
                            <li><Link to="/" className="text-decoration-none transition-all text-muted">Privacy Policy</Link></li>
                            <li><Link to="/" className="text-decoration-none transition-all text-muted">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {!isLoggedIn && (
                        <div className="col-lg-4 col-md-4">
                            <h5 className="fw-bold mb-4">Newsletter</h5>
                            <p className="text-muted mb-4">Subscribe to get the latest courses updates and news right in your inbox.</p>
                            <div className="d-flex p-1 bg-light rounded-pill border border-light">
                                <input 
                                    type="email" 
                                    className="form-control bg-transparent border-0 shadow-none" 
                                    placeholder="Enter your email"
                                />
                                <button className="btn btn-primary rounded-pill px-4 fw-bold">Subscribe</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="border-top py-4 mt-2">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="mb-0 text-muted small">
                        &copy; {new Date().getFullYear()} Smart Learning LMS. All rights reserved.
                    </p>
                    <div className="d-flex gap-4 small">
                        <Link to="/" className="text-decoration-none text-muted">English (US)</Link>
                        <Link to="/" className="text-decoration-none text-muted">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
