import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../common/DashboardLayout';
import { apiUrl } from '../../common/config';
import { Star, Check, X, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

    const fetchReviews = () => {
        setLoading(true);
        fetch(`${apiUrl}/admin/reviews`, {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Accept': 'application/json'
            }
        })
        .then(r => r.json())
        .then(result => {
            if (result.status === 200) {
                setReviews(result.data || []);
            }
        })
        .catch(err => {
            console.error(err);
            toast.error('Failed to load reviews');
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${apiUrl}/admin/reviews/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                toast.success('Review status updated');
                // Update local state
                setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
            } else {
                toast.error(result.message || 'Failed to update review status');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating review status');
        }
    };

    return (
        <DashboardLayout 
            title={<><MessageSquare size={28} style={{ color: '#6366F1', marginRight: 10 }} /> Course Reviews</>}
            subtitle="Manage and moderate reviews left by students on your courses."
        >
            <div className="card border-0 shadow-sm mt-4 rounded-4" style={{ overflow: 'hidden' }}>
                <div className="card-header bg-white py-3 border-bottom-0">
                    <h5 className="mb-0" style={{ fontWeight: 700, color: '#1E293B' }}>All Reviews</h5>
                </div>
                
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-5">
                        <MessageSquare size={48} color="#94A3B8" className="mb-3" />
                        <h5 style={{ fontWeight: 600, color: '#475569' }}>No reviews found</h5>
                        <p className="text-muted">Students haven't reviewed any of your courses yet.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 px-4 border-0 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Student / Course</th>
                                    <th className="py-3 px-4 border-0 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Rating</th>
                                    <th className="py-3 px-4 border-0 text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Comment</th>
                                    <th className="py-3 px-4 border-0 text-uppercase text-center" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Status</th>
                                    <th className="py-3 px-4 border-0 text-uppercase text-end" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(review => (
                                    <tr key={review.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex flex-column">
                                                <span style={{ fontWeight: 600, color: '#1E293B' }}>{review.user?.name || 'Unknown User'}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{review.course?.title || 'Unknown Course'}</span>
                                                <span className="d-flex align-items-center mt-1" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                                    <Clock size={12} className="me-1" />
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center" style={{ color: '#F59E0B' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} color={i < review.rating ? '#F59E0B' : '#E2E8F0'} />
                                                ))}
                                                <span className="ms-2" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3" style={{ maxWidth: '300px' }}>
                                            <p className="mb-0 text-truncate text-wrap" style={{ fontSize: '0.9rem', color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {review.status === 1 ? (
                                                <span className="badge" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', padding: '6px 12px', borderRadius: '50px', fontWeight: 600 }}>Approved</span>
                                            ) : (
                                                <span className="badge" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '6px 12px', borderRadius: '50px', fontWeight: 600 }}>Pending</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            {review.status === 0 ? (
                                                <button onClick={() => updateStatus(review.id, 1)} className="btn btn-sm btn-success rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                                    <Check size={14} /> Approve
                                                </button>
                                            ) : (
                                                <button onClick={() => updateStatus(review.id, 0)} className="btn btn-sm btn-outline-warning rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                                    <X size={14} /> Reject
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminReviews;
