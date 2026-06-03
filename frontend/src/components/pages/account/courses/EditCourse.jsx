import React, { useEffect, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import Header from '../../../common/Header'
import Footer from '../../../common/Footer'
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import CourseOutcomes from './CourseOutcomes';
import CourseRequirements from './CourseRequirements';
import CourseImage from './CourseImage';
import CourseChapters from './CourseChapters';

const CourseEdit = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [courseImage, setCourseImage] = useState(null);
    const [courseStatus, setCourseStatus] = useState('0');

    useEffect(() => {
        const fetchOptions = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token || null;
            const res = await fetch(`${apiUrl}/course-options`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setCategories(result.categories || []);
                setLevels(result.levels || []);
                setLanguages(result.languages || []);
            }
        };

        const fetchCourse = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token || null;
            const res = await fetch(`${apiUrl}/courses/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                reset(result.data || result);
                setCourseImage((result.data || result).image);
                setCourseStatus(String((result.data || result).status));
            } else {
                toast.error('Failed to load course');
            }
        };
        
        fetchOptions();
        if (id) fetchCourse();
    }, [id, reset]);

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        const res = await fetch(`${apiUrl}/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            toast.success('Course updated successfully!');
        } else {
            toast.error(result.message || "Error");
        }
    };

    return (
        <>
            <Header />
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center gap-2'>
                                    <h2 className='h3 mb-0 pb-0'>Edit Course</h2>
                                    <span className={`badge ${courseStatus === '1' ? 'bg-success' : 'bg-secondary'}`}>
                                        {courseStatus === '1' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className='d-flex gap-2'>
                                    <button
                                        className={`btn btn-sm ${courseStatus === '1' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                        onClick={async () => {
                                            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
                                            const token = userInfo?.token || null;
                                            const res = await fetch(`${apiUrl}/courses/${id}/toggle-status`, {
                                                method: 'PUT',
                                                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                                            });
                                            const result = await res.json();
                                            if (res.ok) {
                                                toast.success(result.message);
                                                setCourseStatus(String(result.data.status));
                                            }
                                        }}
                                    >
                                        {courseStatus === '1' ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <Link to='/account/my-courses' className='btn btn-primary'>Back</Link>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='row'>
                                <div className='col-md-7'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <h4 className='pb-3 mb-3'>Course Details</h4>
                                                <div className='mb-3'>
                                                    <label className="form-label">Title</label>
                                                    <input type="text" placeholder='Title' className='form-control'
                                                        {...register('title', { required: "Title is required" })} />
                                                    {errors.title && <span className='text-danger'>{errors.title.message}</span>}
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="form-label">Category</label>
                                                    <select className='form-select' {...register('category_id')}>
                                                        <option value="">Select Category</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="form-label">Level</label>
                                                    <select className='form-select' {...register('level_id')}>
                                                        <option value="">Select Level</option>
                                                        {levels.map(lvl => (
                                                            <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="form-label">Language</label>
                                                    <select className='form-select' {...register('language_id')}>
                                                        <option value="">Select Language</option>
                                                        {languages.map(lang => (
                                                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="form-label">Description</label>
                                                    <textarea placeholder='Description' className='form-control' rows={5}
                                                        {...register('description')}></textarea>
                                                </div>
                                                <h4 className='pb-3 mb-3'>Pricing</h4>
                                                <div className='mb-3'>
                                                    <label className="form-label">Price</label>
                                                    <input type="text" placeholder='Price' className='form-control'
                                                        {...register('price')} />
                                                    {errors.price && <span className='text-danger'>{errors.price.message}</span>}
                                                </div>
                                                <div>
                                                    <button className='btn btn-primary'>Save Changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Chapters Section */}
                                    <CourseChapters courseId={id} />
                                </div>
                                <div className='col-md-5'>
                                    {/* Cover Image Section */}
                                    <CourseImage courseId={id} currentImage={courseImage} />
                                    
                                    {/* Outcomes Section */}
                                    <CourseOutcomes courseId={id} />
                                    
                                    {/* Requirements Section */}
                                    <CourseRequirements courseId={id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default CourseEdit;