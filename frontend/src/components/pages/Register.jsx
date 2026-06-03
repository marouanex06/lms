import React from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/config'
import { toast } from 'react-hot-toast'
import { User, Mail, Lock, ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'motion/react'

const Register = () => {
    const navigate = useNavigate();
    const {
        handleSubmit, register, formState: { errors }, setError
    } = useForm();

    const onSubmit = async (data) => {
        await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.status === 200) {
                toast.success(result.message)
                navigate('/account/login');
            } else {
                const errors = result.errors;
                Object.keys(errors).forEach(field => {
                    setError(field, { message: errors[field][0] })
                })
            }
        })
    }

    return (
        <Layout>
            <div className='container-fluid py-5 min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden bg-light'>
                {/* Floating decorative background blobs */}
                <div className="bg-blob-primary" style={{ top: '10%', right: '15%' }}></div>
                <div className="bg-blob-accent" style={{ bottom: '15%', left: '15%' }}></div>

                <div className='container position-relative z-1'>
                    <div className='row justify-content-center'>
                        <div className='col-12 col-sm-10 col-md-8 col-lg-5'>
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className='card auth-glass-card border-0 p-4 p-md-5'>
                                    <div className='text-center mb-5'>
                                        <div className="bg-gradient-primary text-white p-3 d-inline-flex align-items-center justify-content-center rounded-4 shadow-md mb-3">
                                            <BookOpen size={28} />
                                        </div>
                                        <h3 className='fw-bold mb-2 text-gradient'>Create Account</h3>
                                        <p className='text-muted small'>Start your learning journey with Smart Learning</p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='mb-4'>
                                            <label className='form-label fw-semibold small' htmlFor="name">Full Name</label>
                                            <div className="input-icon-group">
                                                <User size={18} className="input-icon" />
                                                <input 
                                                    {...register("name", { 
                                                        required: "Name is required", 
                                                    })}                                 
                                                    type="text" 
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                                    placeholder='John Doe' 
                                                />   
                                            </div>
                                            {errors.name && (
                                                <p className='text-danger small mt-1 mb-0' style={{ fontSize: '0.8rem' }}>{errors.name.message}</p>
                                            )}                            
                                        </div>

                                        <div className='mb-4'>
                                            <label className='form-label fw-semibold small' htmlFor="email">Email Address</label>
                                            <div className="input-icon-group">
                                                <Mail size={18} className="input-icon" />
                                                <input 
                                                    {...register("email", { 
                                                        required: "Email is required", 
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        } 
                                                    })}   
                                                    type="text" 
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                                    placeholder='name@example.com' 
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className='text-danger small mt-1 mb-0' style={{ fontSize: '0.8rem' }}>{errors.email.message}</p>
                                            )}    
                                        </div>

                                        <div className='mb-4'>
                                            <label className='form-label fw-semibold small' htmlFor="password">Password</label>
                                            <div className="input-icon-group">
                                                <Lock size={18} className="input-icon" />
                                                <input 
                                                    {...register("password", { 
                                                        required: "Password is required", 
                                                    })}     
                                                    type="password" 
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                                                    placeholder='••••••••' 
                                                />   
                                            </div>
                                            {errors.password && (
                                                <p className='text-danger small mt-1 mb-0' style={{ fontSize: '0.8rem' }}>{errors.password.message}</p>
                                            )}                                 
                                        </div>

                                        <button className='btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 hover-glow mb-4'>
                                            Register <ArrowRight size={18} />
                                        </button>

                                        <div className='text-center'>
                                            <span className='text-muted small'>Already have an account? </span>
                                            <Link to={`/account/login`} className='fw-bold text-primary text-decoration-none small transition-all hover-lift'>
                                                Sign In
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Register
