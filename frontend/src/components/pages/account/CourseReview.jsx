import React, { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { apiUrl } from '../../common/config';
import { toast } from 'react-toastify';

const CourseReview = ({ courseId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (comment.length < 5) {
            toast.error('Comment must be at least 5 characters');
            return;
        }

        setSubmitting(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;

        try {
            const res = await fetch(`${apiUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    course_id: courseId,
                    rating: rating,
                    comment: comment
                })
            });

            const result = await res.json();
            if (res.ok) {
                toast.success('Thank you for your review!');
                setComment('');
                setRating(0);
                if (onReviewSubmitted) onReviewSubmitted();
            } else {
                toast.error(result.message || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Leave a Review</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label d-block">Rating</label>
                        <Rating
                            onClick={handleRating}
                            initialValue={rating}
                            size={30}
                            transition
                            allowFraction={false}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Your Comment</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Share your experience with this course..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary px-4" 
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseReview;
