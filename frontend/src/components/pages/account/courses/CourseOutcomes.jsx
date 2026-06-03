import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../common/config';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaBars, FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CourseOutcomes = ({ courseId }) => {
    const [outcomes, setOutcomes] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchOutcomes = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/outcomes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setOutcomes(result.data || []);
            }
        } catch (error) {
            toast.error("Failed to load outcomes");
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchOutcomes();
        }
    }, [courseId]);

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/outcomes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (res.ok) {
                toast.success('Outcome added successfully');
                reset();
                fetchOutcomes();
            } else {
                toast.error(result.message || 'Error adding outcome');
            }
        } catch (error) {
            toast.error('Error adding outcome');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this outcome?")) return;
        
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/outcomes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            if (res.ok) {
                toast.success('Outcome deleted successfully');
                fetchOutcomes();
            } else {
                toast.error('Failed to delete outcome');
            }
        } catch (error) {
            toast.error('Error deleting outcome');
        }
    };

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(outcomes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Optimistically update UI
        setOutcomes(items);

        // Save new order to backend
        const orderedIds = items.map(item => item.id);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/outcomes/sort`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ outcomes: orderedIds })
            });

            if (!res.ok) {
                toast.error('Failed to save new order');
                fetchOutcomes(); // Revert on failure
            }
        } catch (error) {
            toast.error('Error saving new order');
            fetchOutcomes(); // Revert on failure
        }
    };

    const handleEdit = (outcome) => {
        setEditingId(outcome.id);
        setEditText(outcome.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleUpdate = async (id) => {
        if (!editText.trim()) {
            toast.error("Outcome text cannot be empty");
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/outcomes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: editText })
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Outcome updated successfully');
                setEditingId(null);
                fetchOutcomes();
            } else {
                toast.error(result.message || 'Error updating outcome');
            }
        } catch (error) {
            toast.error('Error updating outcome');
        }
    };

    return (
        <div className="card border-0 shadow mb-4">
            <div className="card-body p-4">
                <h4 className='mb-1'>Course Outcomes</h4>
                <p className='text-muted mb-4'>What students will learn from this course</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <div className="input-group">
                        <input 
                            type="text" 
                            className={`form-control ${errors.text ? 'is-invalid' : ''}`} 
                            placeholder="e.g. Build a full-stack app"
                            {...register('text', { required: 'Please enter an outcome' })}
                        />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                    {errors.text && <span className='text-danger mt-1 d-block'>{errors.text.message}</span>}
                </form>

                <div>
                    {outcomes.length > 0 ? (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="outcomesList">
                                {(provided) => (
                                    <ul 
                                        className="list-group list-group-flush" 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                    >
                                        {outcomes.map((outcome, index) => (
                                            <Draggable key={outcome.id.toString()} draggableId={outcome.id.toString()} index={index} isDragDisabled={editingId !== null}>
                                                {(provided, snapshot) => (
                                                    <li 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`list-group-item d-flex justify-content-between align-items-center px-0 ${snapshot.isDragging ? 'bg-light' : ''}`}
                                                        style={{...provided.draggableProps.style}}
                                                    >
                                                        <div className="d-flex align-items-center flex-grow-1">
                                                            <div {...provided.dragHandleProps} className="me-3 d-flex align-items-center text-muted" style={{ cursor: editingId ? 'default' : 'grab' }}>
                                                                <FaBars />
                                                            </div>
                                                            {editingId === outcome.id ? (
                                                                <input 
                                                                    type="text" 
                                                                    className="form-control form-control-sm"
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span>{outcome.text}</span>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2 ms-3">
                                                            {editingId === outcome.id ? (
                                                                <>
                                                                    <button className="btn btn-sm btn-success py-0 px-2" onClick={() => handleUpdate(outcome.id)}>Save</button>
                                                                    <button className="btn btn-sm btn-secondary py-0 px-2" onClick={cancelEdit}>Cancel</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaEdit 
                                                                        className="text-primary"
                                                                        style={{ cursor: 'pointer', fontSize: '1rem' }}
                                                                        onClick={() => handleEdit(outcome)}
                                                                    />
                                                                    <FaTrash 
                                                                        className="text-danger"
                                                                        style={{ cursor: 'pointer', fontSize: '1rem' }}
                                                                        onClick={() => handleDelete(outcome.id)}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : (
                        <p className="text-muted">No outcomes added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseOutcomes;
