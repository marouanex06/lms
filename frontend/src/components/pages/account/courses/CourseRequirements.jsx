import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../common/config';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaBars, FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CourseRequirements = ({ courseId }) => {
    const [requirements, setRequirements] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchRequirements = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/requirements`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setRequirements(result.data || []);
            }
        } catch (error) {
            toast.error("Failed to load requirements");
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchRequirements();
        }
    }, [courseId]);

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/requirements`, {
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
                toast.success('Requirement added successfully');
                reset();
                fetchRequirements();
            } else {
                toast.error(result.message || 'Error adding requirement');
            }
        } catch (error) {
            toast.error('Error adding requirement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this requirement?")) return;
        
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        
        try {
            const res = await fetch(`${apiUrl}/requirements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            if (res.ok) {
                toast.success('Requirement deleted successfully');
                fetchRequirements();
            } else {
                toast.error('Failed to delete requirement');
            }
        } catch (error) {
            toast.error('Error deleting requirement');
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(requirements);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Optimistically update UI
        setRequirements(items);

        // Save new order to backend
        const orderedIds = items.map(item => item.id);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/requirements/sort`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ requirements: orderedIds })
            });

            if (!res.ok) {
                toast.error('Failed to save new order');
                fetchRequirements(); // Revert on failure
            }
        } catch (error) {
            toast.error('Error saving new order');
            fetchRequirements(); // Revert on failure
        }
    };

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleEdit = (requirement) => {
        setEditingId(requirement.id);
        setEditText(requirement.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleUpdate = async (id) => {
        if (!editText.trim()) {
            toast.error("Requirement text cannot be empty");
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/requirements/${id}`, {
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
                toast.success('Requirement updated successfully');
                setEditingId(null);
                fetchRequirements();
            } else {
                toast.error(result.message || 'Error updating requirement');
            }
        } catch (error) {
            toast.error('Error updating requirement');
        }
    };

    return (
        <div className="card border-0 shadow mb-4">
            <div className="card-body p-4">
                <h4 className='mb-1'>Course Requirements</h4>
                <p className='text-muted mb-4'>What students need to know before starting</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <div className="input-group">
                        <input 
                            type="text" 
                            className={`form-control ${errors.text ? 'is-invalid' : ''}`} 
                            placeholder="e.g. Basic HTML and CSS"
                            {...register('text', { required: 'Please enter a requirement' })}
                        />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                    {errors.text && <span className='text-danger mt-1 d-block'>{errors.text.message}</span>}
                </form>

                <div>
                    {requirements.length > 0 ? (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="requirementsList">
                                {(provided) => (
                                    <ul 
                                        className="list-group list-group-flush" 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                    >
                                        {requirements.map((requirement, index) => (
                                            <Draggable key={requirement.id.toString()} draggableId={requirement.id.toString()} index={index} isDragDisabled={editingId !== null}>
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
                                                            {editingId === requirement.id ? (
                                                                <input 
                                                                    type="text" 
                                                                    className="form-control form-control-sm"
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span>{requirement.text}</span>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2 ms-3">
                                                            {editingId === requirement.id ? (
                                                                <>
                                                                    <button className="btn btn-sm btn-success py-0 px-2" onClick={() => handleUpdate(requirement.id)}>Save</button>
                                                                    <button className="btn btn-sm btn-secondary py-0 px-2" onClick={cancelEdit}>Cancel</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaEdit 
                                                                        className="text-primary"
                                                                        style={{ cursor: 'pointer', fontSize: '1rem' }}
                                                                        onClick={() => handleEdit(requirement)}
                                                                    />
                                                                    <FaTrash 
                                                                        className="text-danger"
                                                                        style={{ cursor: 'pointer', fontSize: '1rem' }}
                                                                        onClick={() => handleDelete(requirement.id)}
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
                        <p className="text-muted">No requirements added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseRequirements;
