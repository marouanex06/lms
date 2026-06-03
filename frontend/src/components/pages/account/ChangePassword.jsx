import React, { useState } from 'react';
import DashboardLayout from '../../common/DashboardLayout';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { apiUrl } from '../../common/config';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [form, setForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { label: 'Weak', color: '#EF4444', width: '25%' };
        if (score === 2) return { label: 'Fair', color: '#F59E0B', width: '50%' };
        if (score === 3) return { label: 'Good', color: '#6366F1', width: '75%' };
        return { label: 'Strong', color: '#22C55E', width: '100%' };
    };

    const strength = getPasswordStrength(form.new_password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.old_password) errs.old_password = 'Current password is required';
        if (!form.new_password) errs.new_password = 'New password is required';
        else if (form.new_password.length < 6) errs.new_password = 'At least 6 characters required';
        if (!form.confirm_password) errs.confirm_password = 'Please confirm your password';
        else if (form.new_password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    old_password: form.old_password,
                    new_password: form.new_password,
                    confirm_password: form.confirm_password
                })
            });
            const data = await res.json();
            if (data.status === 200) {
                toast.success('Password updated successfully!');
                setForm({ old_password: '', new_password: '', confirm_password: '' });
                setErrors({});
            } else if (data.errors) {
                setErrors(data.errors);
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fieldStyle = (hasError) => ({
        width: '100%',
        padding: '13px 16px 13px 48px',
        border: `1.5px solid ${hasError ? '#EF4444' : 'rgba(99,102,241,0.2)'}`,
        borderRadius: 12,
        fontSize: '0.95rem',
        background: 'rgba(99,102,241,0.03)',
        color: '#1E293B',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        fontFamily: 'inherit',
    });

    const toggleBtn = {
        position: 'absolute',
        right: 14,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        color: '#94A3B8',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <DashboardLayout
            title={<><ShieldCheck size={28} style={{ color: '#6366F1', marginRight: 10 }} /> Security Settings</>}
            subtitle="Keep your account secure by regularly updating your password."
        >
            <div style={{ maxWidth: 560, margin: '24px 0' }}>
                {/* Info card */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.08) 100%)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 16,
                    padding: '16px 20px',
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                }}>
                    <KeyRound size={20} style={{ color: '#6366F1', flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: 4, fontSize: '0.9rem' }}>Password Tips</div>
                        <div style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.6 }}>
                            Use at least 8 characters with uppercase letters, numbers, and special characters for a strong password.
                        </div>
                    </div>
                </div>

                {/* Form card */}
                <div style={{
                    background: '#fff',
                    borderRadius: 24,
                    boxShadow: '0 4px 30px rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.1)',
                    padding: '32px',
                }}>
                    <h5 style={{ fontWeight: 800, color: '#1E293B', marginBottom: 28, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Lock size={18} style={{ color: '#6366F1' }} />
                        Change Password
                    </h5>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Current Password */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8, fontSize: '0.875rem' }}>
                                Current Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type={show.old ? 'text' : 'password'}
                                    name="old_password"
                                    value={form.old_password}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    style={{ ...fieldStyle(errors.old_password), paddingRight: 44 }}
                                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = errors.old_password ? '#EF4444' : 'rgba(99,102,241,0.2)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" style={toggleBtn} onClick={() => setShow(s => ({ ...s, old: !s.old }))}>
                                    {show.old ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.old_password && (
                                <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <AlertCircle size={13} /> {errors.old_password}
                                </div>
                            )}
                        </div>

                        {/* New Password */}
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8, fontSize: '0.875rem' }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type={show.new ? 'text' : 'password'}
                                    name="new_password"
                                    value={form.new_password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    style={{ ...fieldStyle(errors.new_password), paddingRight: 44 }}
                                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = errors.new_password ? '#EF4444' : 'rgba(99,102,241,0.2)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" style={toggleBtn} onClick={() => setShow(s => ({ ...s, new: !s.new }))}>
                                    {show.new ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.new_password && (
                                <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <AlertCircle size={13} /> {errors.new_password}
                                </div>
                            )}
                        </div>

                        {/* Password Strength */}
                        {form.new_password && strength && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>Password strength</span>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                                </div>
                                <div style={{ background: '#F1F5F9', borderRadius: 50, height: 5, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', borderRadius: 50,
                                        background: strength.color,
                                        width: strength.width,
                                        transition: 'width 0.4s ease, background 0.4s ease'
                                    }} />
                                </div>
                            </div>
                        )}
                        {!form.new_password && <div style={{ marginBottom: 20 }} />}

                        {/* Confirm Password */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8, fontSize: '0.875rem' }}>
                                Confirm New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type={show.confirm ? 'text' : 'password'}
                                    name="confirm_password"
                                    value={form.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    style={{ ...fieldStyle(errors.confirm_password), paddingRight: 44 }}
                                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = errors.confirm_password ? '#EF4444' : 'rgba(99,102,241,0.2)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" style={toggleBtn} onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}>
                                    {show.confirm ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <AlertCircle size={13} /> {errors.confirm_password}
                                </div>
                            )}
                            {form.confirm_password && form.new_password === form.confirm_password && !errors.confirm_password && (
                                <div style={{ color: '#22C55E', fontSize: '0.8rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <CheckCircle2 size={13} /> Passwords match
                                </div>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: loading ? '#A5B4FC' : 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 14,
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                letterSpacing: '0.02em',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? (
                                <>
                                    <span style={{
                                        width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid #fff', borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite', display: 'inline-block'
                                    }} />
                                    Updating...
                                </>
                            ) : (
                                <><ShieldCheck size={17} /> Update Password</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </DashboardLayout>
    );
};

export default ChangePassword;
