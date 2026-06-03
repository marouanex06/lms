import React from 'react'
import { ArrowRight, Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section style={heroSectionStyle}>
        {/* Ambient Blobs */}
        <div style={blob1Style} />
        <div style={blob2Style} />

        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
            <div className="row align-items-center justify-content-center min-vh-75 py-5 text-center">
                <div className="col-lg-10 mb-5 mb-lg-0 animate-fade-in-up">
                    


                    {/* Headline */}
                    <h1 style={headlineStyle}>
                        Accelerate your career <br className="d-none d-md-block" />
                        with <span style={textGradientStyle}>premium skills.</span>
                    </h1>
                    
                    {/* Subheadline */}
                    <p style={subHeadlineStyle} className="mx-auto">
                        Access world-class educational content designed for modern professionals. 
                        Master new technologies, earn certificates, and build the future you want.
                    </p>
                    
                    {/* Call to Actions */}
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-5">
                        <Link to="/courses" style={primaryBtnStyle}>
                            Start Learning <ArrowRight size={18} />
                        </Link>
                        <a href="#featured" style={secondaryBtnStyle}>
                            <Play size={18} fill="currentColor" /> Watch Demo
                        </a>
                    </div>

                    {/* Social Proof */}
                    <div style={socialProofStyle} className="mt-5 pt-4">
                        <div style={avatarsGroupStyle}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{...avatarStyle, zIndex: 10-i, marginLeft: i > 1 ? -12 : 0}}>
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', color: '#F59E0B', gap: 2, marginBottom: 2 }}>
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F59E0B" />)}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                                Trusted by 10,000+ students worldwide
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </div>

        {/* Bottom Fade Gradient to transition to next section */}
        <div style={bottomFadeStyle} />
    </section>
  )
}

/* --- Styles --- */
const heroSectionStyle = {
    position: 'relative',
    background: '#0F172A',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
};

const blob1Style = {
    position: 'absolute',
    top: '-10%', left: '-5%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
    filter: 'blur(60px)', pointerEvents: 'none',
};

const blob2Style = {
    position: 'absolute',
    bottom: '-20%', right: '-10%',
    width: 800, height: 800, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
    filter: 'blur(60px)', pointerEvents: 'none',
};

const badgeWrapStyle = {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    padding: '8px 20px',
    borderRadius: 50,
    gap: 8,
};

const badgeIconStyle = {
    fontSize: '1rem',
};

const headlineStyle = {
    fontSize: 'clamp(3rem, 6vw, 5rem)',
    fontWeight: 900,
    color: '#ffffff',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    marginBottom: '1.5rem',
};

const textGradientStyle = {
    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
};

const subHeadlineStyle = {
    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
    color: '#94A3B8',
    lineHeight: 1.6,
    maxWidth: '700px',
    fontWeight: 400,
};

const primaryBtnStyle = {
    background: 'white',
    color: '#0F172A',
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: '14px 32px',
    borderRadius: 14,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 10px 30px rgba(255,255,255,0.15)',
    transition: 'all 0.3s ease',
};

const secondaryBtnStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: '14px 32px',
    borderRadius: 14,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    transition: 'all 0.3s ease',
};

const socialProofStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
};

const avatarsGroupStyle = {
    display: 'flex',
    alignItems: 'center',
};

const avatarStyle = {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '3px solid #0F172A',
    background: '#1E293B',
};

const bottomFadeStyle = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 100,
    background: 'linear-gradient(to bottom, transparent, var(--bg-main))',
    pointerEvents: 'none',
};

export default Hero