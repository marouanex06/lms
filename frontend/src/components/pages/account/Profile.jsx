import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../common/DashboardLayout'
import { apiUrl, fileUrl } from '../../common/config'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Camera, User, Mail, Phone, Bookmark, Globe, Award, Calendar, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setUser(result.data);
                // Set form values
                const data = result.data;
                setValue('name', data.name);
                setValue('email', data.email);
                setValue('mobile', data.mobile || '');
                setValue('designation', data.designation || '');
                setValue('language', data.language || '');
                setValue('nationality', data.nationality || '');
                setValue('birthday', data.birthday || '');
                setValue('gender', data.gender || '');
                setValue('bio', data.bio || '');
                if (data.profile_pic) {
                    setImagePreview(`${fileUrl}/storage/${data.profile_pic}`);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        document.getElementById('image').click();
    };

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        
        const imageInput = document.getElementById('image');
        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        try {
            const res = await fetch(`${apiUrl}/update-profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Profile updated successfully');
                fetchProfile();
            } else {
                toast.error(result.message || 'Error updating profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

    if (loading) {
        return (
            <div className="container py-5 min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout 
            title={<><User size={28} style={{ color: '#6366F1', marginRight: 10 }} /> My Profile</>}
            subtitle="Manage your personal information and account settings."
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className='card auth-glass-card border-0 p-4 p-md-5 mt-3' style={{ borderRadius: 24, boxShadow: '0 4px 25px rgba(0,0,0,0.03)' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-4">
                            {/* Beautiful circular photo editor with overlay */}
                            <div className="col-md-4 text-center border-end-md pb-4 pb-md-0 border-light d-flex flex-column align-items-center justify-content-center">
                                <div 
                                    className="profile-avatar-wrapper mb-3"
                                    onClick={triggerFileInput}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <div className="bg-gradient-primary w-100 h-100 d-flex align-items-center justify-content-center text-white">
                                            <span className="fs-1 fw-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div className="profile-avatar-overlay">
                                        <Camera size={24} className="mb-1" />
                                        <span>Change Photo</span>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    id="image" 
                                    className="d-none" 
                                    onChange={handleImageChange} 
                                    accept="image/*" 
                                />
                                <h5 className="fw-bold text-dark mb-1">{user?.name}</h5>
                                <span className="badge badge-soft-primary px-3 py-1 rounded-pill mb-3 small">{user?.designation || 'Learner'}</span>
                                <small className="text-muted block">JPG, PNG or GIF. Max 2MB</small>
                            </div>

                            {/* Two column elegant layout */}
                            <div className="col-md-8">
                                <h5 className="fw-bold text-primary mb-4 border-bottom pb-2">Personal Information</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Full Name</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                            {...register('name', { required: 'Name is required' })} 
                                        />
                                        {errors.name && <p className="text-danger small mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Email Address</label>
                                        <input 
                                            type="email" 
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                            {...register('email', { required: 'Email is required' })} 
                                        />
                                        {errors.email && <p className="text-danger small mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Mobile Number</label>
                                        <input type="text" className="form-control" placeholder="+1 (555) 000-0000" {...register('mobile')} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Designation</label>
                                        <input type="text" className="form-control" placeholder="e.g. Software Engineer" {...register('designation')} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Language</label>
                                        <input type="text" className="form-control" placeholder="e.g. English, Arabic" {...register('language')} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Nationality</label>
                                        <input type="text" className="form-control" placeholder="e.g. Moroccan" {...register('nationality')} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Birthday</label>
                                        <input type="date" className="form-control" {...register('birthday')} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">Gender</label>
                                        <select className="form-select" {...register('gender')}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold small">Biography</label>
                                        <textarea className="form-control" rows="4" placeholder="Tell us about yourself, your career path and skills..." {...register('bio')}></textarea>
                                    </div>
                                </div>
                                <div className="mt-4 pt-2">
                                    <button type="submit" className="btn btn-primary px-5 py-3 fw-bold rounded-pill hover-glow d-inline-flex align-items-center gap-2">
                                        Save Changes <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </DashboardLayout>
    )
}

export default Profile
