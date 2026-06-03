import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../common/config';
import { toast } from 'react-toastify';
import { FaBars, FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaChevronDown, FaChevronUp, FaPlayCircle } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LessonModal from './LessonModal';

const ChapterItem = ({ chapter, provided, snapshot, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chapter.title);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [showLessonModal, setShowLessonModal] = useState(false);

    const fetchLessons = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/chapters/${chapter.id}/lessons`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setLessons(result.data || []);
            }
        } catch (error) {
            toast.error("Failed to load lessons");
        }
    };

    useEffect(() => {
        if (isExpanded) {
            fetchLessons();
        }
    }, [isExpanded]);

    const handleSaveTitle = () => {
        onUpdate(chapter.id, editTitle);
        setIsEditing(false);
    };

    const handleDeleteLesson = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lesson? The video will be permanently removed.")) return;
        
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/lessons/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            if (res.ok) {
                toast.success('Lesson deleted successfully');
                fetchLessons();
            } else {
                toast.error('Failed to delete lesson');
            }
        } catch (error) {
            toast.error('Error deleting lesson');
        }
    };

    const handleDragEndLessons = async (result) => {
        if (!result.destination) return;

        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLessons(items); // Optimistic UI

        const orderedIds = items.map(item => item.id);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/chapters/${chapter.id}/lessons/sort`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lessons: orderedIds })
            });

            if (!res.ok) {
                toast.error('Failed to save lesson order');
                fetchLessons();
            }
        } catch (error) {
            toast.error('Error saving lesson order');
            fetchLessons();
        }
    };

    return (
        <div 
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`card mb-3 border-1 ${snapshot.isDragging ? 'shadow-sm border-primary' : ''}`}
            style={{...provided.draggableProps.style}}
        >
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center flex-grow-1">
                    <div {...provided.dragHandleProps} className="me-3 text-muted" style={{ cursor: 'grab' }}>
                        <FaBars />
                    </div>
                    
                    <button 
                        className="btn btn-link text-dark text-decoration-none p-0 me-3 d-flex align-items-center" 
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <FaChevronUp className="text-muted" size={12}/> : <FaChevronDown className="text-muted" size={12} />}
                    </button>

                    {isEditing ? (
                        <div className="d-flex w-50">
                            <input 
                                type="text" 
                                className="form-control form-control-sm me-2" 
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                autoFocus
                            />
                            <button type="button" className="btn btn-sm btn-success me-1" onClick={handleSaveTitle}>
                                <FaCheck />
                            </button>
                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <span className="fw-bold" onClick={() => setIsExpanded(!isExpanded)} style={{cursor: 'pointer'}}>
                            {chapter.title}
                        </span>
                    )}
                </div>
                
                {!isEditing && (
                    <div>
                        <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => setShowLessonModal(true)}>
                            <FaPlus /> Lesson
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => setIsEditing(true)}>
                            <FaEdit />
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(chapter.id)}>
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="card-body bg-light border-top">
                    {lessons.length > 0 ? (
                        <DragDropContext onDragEnd={handleDragEndLessons}>
                            <Droppable droppableId={`lessonsList-${chapter.id}`}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {lessons.map((lesson, index) => (
                                            <Draggable key={lesson.id.toString()} draggableId={lesson.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`card mb-2 ${snapshot.isDragging ? 'shadow-sm' : ''}`}
                                                        style={{...provided.draggableProps.style}}
                                                    >
                                                        <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <div {...provided.dragHandleProps} className="me-3 text-muted" style={{ cursor: 'grab' }}>
                                                                    <FaBars size={12} />
                                                                </div>
                                                                <FaPlayCircle className="text-primary me-2" />
                                                                <span>{lesson.title}</span>
                                                                {lesson.is_free_preview === 'yes' && (
                                                                    <span className="badge bg-success ms-2" style={{ fontSize: '0.65rem' }}>Free</span>
                                                                )}
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {lesson.duration && <span className="text-muted small me-3">{lesson.duration} min</span>}
                                                                <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleDeleteLesson(lesson.id)}>
                                                                    <FaTrash size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
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
                        <p className="text-muted mb-0 small text-center py-2">No lessons in this chapter. Click "Add Lesson" to start.</p>
                    )}
                </div>
            )}

            {showLessonModal && (
                <LessonModal 
                    chapterId={chapter.id} 
                    onClose={() => setShowLessonModal(false)} 
                    onLessonAdded={() => {
                        setIsExpanded(true);
                        fetchLessons();
                    }}
                />
            )}
        </div>
    );
};

export default ChapterItem;
