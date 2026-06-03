import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../common/config';
import { toast } from 'react-toastify';

const LessonModal = ({ courseId, chapters, onClose, onLessonAdded }) => {
    const [title, setTitle] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!chapterId) {
            toast.error('Please select a chapter');
            return;
        }
        if (!title.trim()) {
            toast.error('Please enter a lesson title');
            return;
        }

        setIsSaving(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/chapters/${chapterId}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Lesson created successfully');
                onLessonAdded();
                onClose();
            } else {
                toast.error(result.message || 'Failed to create lesson');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Create Lesson</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Chapter</label>
                                <select
                                    className="form-select"
                                    value={chapterId}
                                    onChange={(e) => setChapterId(e.target.value)}
                                    disabled={isSaving}
                                >
                                    <option value="">Select a Chapter</option>
                                    {chapters.map(ch => (
                                        <option key={ch.id} value={ch.id}>{ch.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Lesson title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={isSaving}
                                style={{ backgroundColor: '#20b2aa', borderColor: '#20b2aa' }}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LessonModal;
