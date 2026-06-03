import React, { useEffect, useState, useRef } from 'react';
import UserSidebar from '../../../common/UserSidebar';
import Header from '../../../common/Header';
import Footer from '../../../common/Footer';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl, fileUrl } from '../../../common/config';
import JoditEditor from 'jodit-react';

const EditLesson = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const editor = useRef(null);

    const [lesson, setLesson] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [title, setTitle] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('1');
    const [isFreePreview, setIsFreePreview] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [youtubeId, setYoutubeId] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const editorConfig = {
        readonly: false,
        height: 250,
        toolbarAdaptive: false,
    };

    useEffect(() => {
        const fetchLesson = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token || null;

            try {
                const res = await fetch(`${apiUrl}/lessons/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                const result = await res.json();
                if (res.ok && result.data) {
                    const l = result.data;
                    setLesson(l);
                    setTitle(l.title || '');
                    setChapterId(l.chapter_id || '');
                    setDuration(l.duration || '');
                    setDescription(l.description || '');
                    setStatus(l.status !== undefined ? String(l.status) : '1');
                    setIsFreePreview(l.is_free_preview === 'yes');
                    setYoutubeId(l.youtube_id || '');

                    if (l.video) {
                        setVideoPreview(`${fileUrl}/storage/${l.video}`);
                    }

                    // Get course ID to fetch all chapters for this course
                    if (l.chapter && l.chapter.course_id) {
                        setCourseId(l.chapter.course_id);
                        fetchChapters(l.chapter.course_id, token);
                    }
                } else {
                    toast.error('Lesson not found');
                    navigate(-1);
                }
            } catch (error) {
                toast.error('Error loading lesson');
            }
        };

        fetchLesson();
    }, [id]);

    const fetchChapters = async (cId, token) => {
        try {
            const res = await fetch(`${apiUrl}/courses/${cId}/chapters`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setChapters(result.data || []);
            }
        } catch (error) {
            console.error("Failed to load chapters");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsUploading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('chapter_id', chapterId);
        formData.append('is_free_preview', isFreePreview ? 'yes' : 'no');
        formData.append('status', status);
        if (duration) formData.append('duration', duration);
        formData.append('description', description || '');
        if (youtubeId) formData.append('youtube_id', youtubeId);
        if (videoFile) formData.append('video', videoFile);

        try {
            const res = await fetch(`${apiUrl}/lessons/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Lesson updated successfully');
            } else {
                const errors = result.errors;
                if (errors) {
                    Object.values(errors).forEach(errs => errs.forEach(e => toast.error(e)));
                } else {
                    toast.error(result.message || 'Error updating lesson');
                }
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        } else {
            toast.error('Please drop a valid video file');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    if (!lesson) {
        return (
            <>
                <Header />
                <section className='section-4'>
                    <div className='container'>
                        <div className='text-center py-5'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h3 mb-0 pb-0'>Edit Lesson</h2>
                                <button onClick={() => navigate(-1)} className='btn btn-primary'>Back</button>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    {/* Left Column - Basic Information */}
                                    <div className='col-md-8'>
                                        <div className="card border-0 shadow mb-4">
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-1">Basic Information</h5>
                                                <hr />

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Title</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Chapter</label>
                                                    <select
                                                        className="form-select"
                                                        value={chapterId}
                                                        onChange={(e) => setChapterId(e.target.value)}
                                                    >
                                                        <option value="">Select a Chapter</option>
                                                        {chapters.map(ch => (
                                                            <option key={ch.id} value={ch.id}>{ch.title}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Duration (in minutes)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={duration}
                                                        onChange={(e) => setDuration(e.target.value)}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Description</label>
                                                    <JoditEditor
                                                        ref={editor}
                                                        value={description}
                                                        config={editorConfig}
                                                        onBlur={newContent => setDescription(newContent)}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Status</label>
                                                    <select
                                                        className="form-select"
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    >
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                </div>

                                                <div className="form-check mb-4">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="freeLessonCheck"
                                                        checked={isFreePreview}
                                                        onChange={(e) => setIsFreePreview(e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor="freeLessonCheck">
                                                        Free Lesson
                                                    </label>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="btn btn-primary px-4"
                                                    disabled={isUploading}
                                                    style={{ backgroundColor: '#20b2aa', borderColor: '#20b2aa' }}
                                                >
                                                    {isUploading ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Video Upload */}
                                    <div className='col-md-4'>
                                        <div className="card border-0 shadow mb-4">
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-1">Video</h5>
                                                <hr />

                                                {/* YouTube ID Field */}
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">YouTube Video ID</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="e.g. dQw4w9WgXcQ"
                                                        value={youtubeId}
                                                        onChange={(e) => setYoutubeId(e.target.value)}
                                                    />
                                                    <small className="text-muted">Paste the YouTube video ID (not the full URL)</small>
                                                    {youtubeId && (
                                                        <div className="mt-2" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden' }}>
                                                            <iframe
                                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                                                title="YouTube preview"
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-muted small text-center mb-2">— OR upload a video file —</p>

                                                {videoPreview ? (
                                                    <div className="mb-3">
                                                        <video
                                                            src={videoPreview}
                                                            controls
                                                            className="w-100 rounded"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger mt-2 w-100"
                                                            onClick={() => {
                                                                setVideoFile(null);
                                                                setVideoPreview(null);
                                                            }}
                                                        >
                                                            Remove Video
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`border border-2 border-dashed rounded p-4 text-center ${isDragOver ? 'border-primary bg-light' : ''}`}
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: isDragOver ? '#f0f7ff' : '#f8f9fa',
                                                            borderColor: isDragOver ? '#0d6efd' : '#dee2e6',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                                        onDragLeave={() => setIsDragOver(false)}
                                                        onDrop={handleFileDrop}
                                                        onClick={() => document.getElementById('videoFileInput').click()}
                                                    >
                                                        <p className="text-muted mb-0">
                                                            Drag & Drop your files or <span className="text-decoration-underline fw-semibold" style={{ cursor: 'pointer' }}>Browse</span>
                                                        </p>
                                                    </div>
                                                )}

                                                <input
                                                    type="file"
                                                    id="videoFileInput"
                                                    className="d-none"
                                                    accept="video/mp4, video/webm, video/ogg"
                                                    onChange={handleFileSelect}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default EditLesson;
