import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/config'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/Auth'
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'motion/react'

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const {
        handleSubmit, register, formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        await fetch(`${apiUrl}/login`, {
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
                const userInfo = {
                    name: result.name,
                    email: data.email,
                    id: result.id,
                    token: result.token,
                    role: result.role,
                }
                localStorage.setItem('userInfoLms', JSON.stringify(userInfo));
                // Save profile so admin can see this user's name in Student Progress
                localStorage.setItem(`userProfile_${result.id}`, JSON.stringify({ name: result.name, email: data.email }));
                login(userInfo)
                navigate('/account/dashboard');
            } else {
                toast.error(result.message)
            }
        })
        .catch(err => {
            toast.error("Network error. Please try again.")
            console.error(err);
        });
    }

    return (
        <Layout>
            <div className='container-fluid py-5 min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden bg-light'>
                {/* Floating decorative background blobs */}
                <div className="bg-blob-primary" style={{ top: '10%', left: '15%' }}></div>
                <div className="bg-blob-accent" style={{ bottom: '15%', right: '15%' }}></div>

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
                                        <h3 className='fw-bold mb-2 text-gradient'>Welcome Back</h3>
                                        <p className='text-muted small'>Please sign in to access your learning portal</p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                            Sign In <ArrowRight size={18} />
                                        </button>

                                        <div className='text-center'>
                                            <span className='text-muted small'>Don't have an account? </span>
                                            <Link to={`/account/register`} className='fw-bold text-primary text-decoration-none small transition-all hover-lift'>
                                                Register Here
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

export default Login
