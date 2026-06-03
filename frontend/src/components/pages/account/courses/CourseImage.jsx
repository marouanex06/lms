import React, { useState, useEffect } from 'react';
import { apiUrl, fileUrl } from '../../../common/config';
import { toast } from 'react-toastify';

const CourseImage = ({ courseId, currentImage }) => {
    const resolveImage = (img) => {
        if (!img) return null;
        return img.startsWith('http') ? img : `${fileUrl}/storage/${img}`;
    };

    const [imagePreview, setImagePreview] = useState(resolveImage(currentImage));
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Update the preview when the currentImage prop changes (e.g. initial fetch)
    useEffect(() => {
        if (currentImage) {
            setImagePreview(resolveImage(currentImage));
        }
    }, [currentImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); // Show local preview instantly
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first");
            return;
        }

        setIsUploading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || 'Image updated successfully!');
                setImagePreview(result.image_url);
            } else {
                if (result.errors?.image) {
                    toast.error(result.errors.image[0]);
                } else {
                    toast.error(result.message || "Failed to upload image");
                }
            }
        } catch (error) {
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="card border-0 shadow mb-4">
            <div className="card-body p-4">
                <h4 className='pb-3 mb-3 border-bottom'>Cover Image</h4>
                
                {imagePreview ? (
                    <div className="mb-3">
                        <img 
                            src={imagePreview} 
                            alt="Course Cover" 
                            className="img-fluid rounded" 
                            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }} 
                        />
                    </div>
                ) : (
                    <div className="mb-3 text-center p-5 bg-light rounded text-muted border">
                        <p className="mb-0">No cover image uploaded yet.</p>
                    </div>
                )}

                <div className="mb-3">
                    <input 
                        type="file" 
                        className="form-control" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        onChange={handleFileChange} 
                    />
                    <small className="text-muted d-block mt-2">Max 2MB. JPG, PNG, or WebP.</small>
                </div>
                
                <button 
                    className="btn btn-primary w-100" 
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Update Cover Image'}
                </button>
            </div>
        </div>
    );
};

export default CourseImage;
