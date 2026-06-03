import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../common/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LessonModal from './LessonModal';

const CourseChapters = ({ courseId }) => {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [expandedChapterId, setExpandedChapterId] = useState(null);
    const [chapterLessons, setChapterLessons] = useState({});
    const [editChapterId, setEditChapterId] = useState(null);
    const [editChapterTitle, setEditChapterTitle] = useState('');
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [isReorderingChapters, setIsReorderingChapters] = useState(false);
    const [reorderingLessonsChapterId, setReorderingLessonsChapterId] = useState(null);

    const fetchChapters = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/chapters`, {
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
            toast.error("Failed to load chapters");
        }
    };

    useEffect(() => {
        if (courseId) fetchChapters();
    }, [courseId]);

    const fetchLessons = async (chapterId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/chapters/${chapterId}/lessons`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setChapterLessons(prev => ({ ...prev, [chapterId]: result.data || [] }));
            }
        } catch (error) {
            toast.error("Failed to load lessons");
        }
    };

    const toggleChapter = (chapterId) => {
        if (expandedChapterId === chapterId) {
            setExpandedChapterId(null);
        } else {
            setExpandedChapterId(chapterId);
            fetchLessons(chapterId);
        }
    };

    // --- Chapter CRUD ---
    const handleCreateChapter = async (e) => {
        e.preventDefault();
        if (!newChapterTitle.trim()) {
            toast.error('Please enter a chapter title');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/chapters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newChapterTitle })
            });

            if (res.ok) {
                toast.success('Chapter created');
                setNewChapterTitle('');
                fetchChapters();
            } else {
                toast.error('Failed to create chapter');
            }
        } catch (error) {
            toast.error('Error creating chapter');
        }
    };

    const handleUpdateChapter = async (chapterId) => {
        if (!editChapterTitle.trim()) {
            toast.error('Chapter title cannot be empty');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/chapters/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: editChapterTitle })
            });

            if (res.ok) {
                toast.success('Chapter updated');
                setEditChapterId(null);
                fetchChapters();
            } else {
                toast.error('Failed to update chapter');
            }
        } catch (error) {
            toast.error('Error updating chapter');
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm("Delete this chapter and all its lessons?")) return;

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/chapters/${chapterId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (res.ok) {
                toast.success('Chapter deleted');
                if (expandedChapterId === chapterId) setExpandedChapterId(null);
                fetchChapters();
            } else {
                toast.error('Failed to delete chapter');
            }
        } catch (error) {
            toast.error('Error deleting chapter');
        }
    };

    // --- Lesson CRUD ---
    const handleDeleteLesson = async (lessonId, chapterId) => {
        if (!window.confirm("Delete this lesson and its video?")) return;

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (res.ok) {
                toast.success('Lesson deleted');
                fetchLessons(chapterId);
            } else {
                toast.error('Failed to delete lesson');
            }
        } catch (error) {
            toast.error('Error deleting lesson');
        }
    };

    // --- Reorder Handlers ---
    const handleChapterDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setChapters(items);

        const orderedIds = items.map(item => item.id);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            await fetch(`${apiUrl}/courses/${courseId}/chapters/sort`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chapters: orderedIds })
            });
        } catch (error) {
            toast.error('Error saving order');
            fetchChapters();
        }
    };

    const handleLessonDragEnd = async (result, chapterId) => {
        if (!result.destination) return;
        const lessons = Array.from(chapterLessons[chapterId] || []);
        const [reorderedItem] = lessons.splice(result.source.index, 1);
        lessons.splice(result.destination.index, 0, reorderedItem);
        setChapterLessons(prev => ({ ...prev, [chapterId]: lessons }));

        const orderedIds = lessons.map(item => item.id);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            await fetch(`${apiUrl}/chapters/${chapterId}/lessons/sort`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lessons: orderedIds })
            });
        } catch (error) {
            toast.error('Error saving lesson order');
            fetchLessons(chapterId);
        }
    };

    return (
        <div className="card border-0 shadow mt-4 mb-4">
            <div className="card-body p-4">
                {/* Create Chapter Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Create Chapter</h5>
                    <span
                        className="fw-bold text-dark"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowLessonModal(true)}
                    >
                        + Create Lesson
                    </span>
                </div>

                <form onSubmit={handleCreateChapter} className="mb-4">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Chapter"
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary px-4"
                        style={{ backgroundColor: '#20b2aa', borderColor: '#20b2aa' }}
                    >
                        Save
                    </button>
                </form>

                {/* Chapters List */}
                {chapters.length > 0 && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Chapters</h5>
                            <span
                                className="fw-bold text-dark"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsReorderingChapters(!isReorderingChapters)}
                            >
                                {isReorderingChapters ? 'Done' : 'Reorder Chapters'}
                            </span>
                        </div>

                        {isReorderingChapters ? (
                            <DragDropContext onDragEnd={handleChapterDragEnd}>
                                <Droppable droppableId="chapterReorder">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {chapters.map((ch, index) => (
                                                <Draggable key={ch.id.toString()} draggableId={ch.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`border rounded p-3 mb-2 bg-white d-flex align-items-center ${snapshot.isDragging ? 'shadow' : ''}`}
                                                            style={{ ...provided.draggableProps.style, cursor: 'grab' }}
                                                        >
                                                            <span className="me-3 text-muted">☰</span>
                                                            <span>{ch.title}</span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        ) : (
                            <div>
                                {chapters.map((chapter) => {
                                    const isExpanded = expandedChapterId === chapter.id;
                                    const lessons = chapterLessons[chapter.id] || [];
                                    const isReorderingLessons = reorderingLessonsChapterId === chapter.id;

                                    return (
                                        <div key={chapter.id} className="border rounded mb-2 bg-white">
                                            {/* Chapter Header Row */}
                                            <div
                                                className="d-flex justify-content-between align-items-center p-3"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleChapter(chapter.id)}
                                            >
                                                <span className="fw-medium">{chapter.title}</span>
                                                <span className="text-muted">{isExpanded ? '∧' : '∨'}</span>
                                            </div>

                                            {/* Expanded Body */}
                                            {isExpanded && (
                                                <div className="border-top p-3">
                                                    {/* Lessons Header */}
                                                    {lessons.length > 0 && (
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <h6 className="fw-bold mb-0">Lessons</h6>
                                                            <span
                                                                className="fw-bold text-dark small"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setReorderingLessonsChapterId(
                                                                        isReorderingLessons ? null : chapter.id
                                                                    );
                                                                }}
                                                            >
                                                                {isReorderingLessons ? 'Done' : 'Reorder Lessons'}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Lessons List */}
                                                    {isReorderingLessons ? (
                                                        <DragDropContext onDragEnd={(result) => handleLessonDragEnd(result, chapter.id)}>
                                                            <Droppable droppableId={`lessonReorder-${chapter.id}`}>
                                                                {(provided) => (
                                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                        {lessons.map((lesson, index) => (
                                                                            <Draggable key={lesson.id.toString()} draggableId={`lesson-${lesson.id}`} index={index}>
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={`border rounded p-2 px-3 mb-2 bg-light d-flex align-items-center ${snapshot.isDragging ? 'shadow' : ''}`}
                                                                                        style={{ ...provided.draggableProps.style, cursor: 'grab' }}
                                                                                    >
                                                                                        <span className="me-3 text-muted">☰</span>
                                                                                        <span className="text-dark">{lesson.title}</span>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </DragDropContext>
                                                    ) : (
                                                        <>
                                                            {lessons.map(lesson => (
                                                                <div
                                                                    key={lesson.id}
                                                                    className="d-flex justify-content-between align-items-center border rounded p-2 px-3 mb-2"
                                                                    style={{ backgroundColor: lesson.is_free_preview === 'yes' ? '#fff8e1' : '#f8f9fa' }}
                                                                >
                                                                    <span className="text-dark">{lesson.title}</span>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        {lesson.duration && (
                                                                            <span className="text-muted small">{lesson.duration} mins</span>
                                                                        )}
                                                                        {lesson.is_free_preview === 'yes' && (
                                                                            <span className="badge" style={{ backgroundColor: '#20b2aa', fontSize: '0.7rem' }}>Preview</span>
                                                                        )}
                                                                        <FaEdit
                                                                            className="text-primary"
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={() => navigate(`/account/courses/lessons/edit/${lesson.id}`)}
                                                                        />
                                                                        <FaTrash
                                                                            className="text-danger"
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={() => handleDeleteLesson(lesson.id, chapter.id)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {lessons.length === 0 && (
                                                                <p className="text-muted small mb-2">No lessons yet.</p>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Chapter Edit / Title */}
                                                    {editChapterId === chapter.id ? (
                                                        <div className="mt-3">
                                                            <input
                                                                type="text"
                                                                className="form-control mb-2"
                                                                value={editChapterTitle}
                                                                onChange={(e) => setEditChapterTitle(e.target.value)}
                                                            />
                                                        </div>
                                                    ) : null}

                                                    {/* Action Buttons */}
                                                    <div className="d-flex justify-content-end gap-3 mt-3 pt-3 border-top">
                                                        {editChapterId === chapter.id ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-success px-3"
                                                                    onClick={(e) => { e.stopPropagation(); handleUpdateChapter(chapter.id); }}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-secondary px-3"
                                                                    onClick={(e) => { e.stopPropagation(); setEditChapterId(null); }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="text-muted small">Chapter Actions:</span>
                                                                    <FaEdit
                                                                        className="text-primary"
                                                                        style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditChapterId(chapter.id);
                                                                            setEditChapterTitle(chapter.title);
                                                                        }}
                                                                        title="Edit Chapter Title"
                                                                    />
                                                                    <FaTrash
                                                                        className="text-danger"
                                                                        style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                                                                        onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }}
                                                                        title="Delete Chapter"
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Lesson Creation Modal */}
            {showLessonModal && (
                <LessonModal
                    courseId={courseId}
                    chapters={chapters}
                    onClose={() => setShowLessonModal(false)}
                    onLessonAdded={() => {
                        fetchChapters();
                        if (expandedChapterId) fetchLessons(expandedChapterId);
                    }}
                />
            )}
        </div>
    );
};

export default CourseChapters;
