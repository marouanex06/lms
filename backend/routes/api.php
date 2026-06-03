<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\CourseOutcomeController;
use App\Http\Controllers\front\CourseRequirementController;
use App\Http\Controllers\front\CourseChapterController;
use App\Http\Controllers\front\CourseLessonController;
use App\Http\Controllers\front\EnrollmentController;
use App\Http\Controllers\front\ProgressController;
use App\Http\Controllers\front\ReviewController;
use App\Http\Controllers\front\AdminNotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required)
Route::get('/public/courses', [CourseController::class, 'publicIndex']);
Route::get('/public/courses/{id}', [CourseController::class, 'publicShow']);
Route::get('/public/course-options', [CourseController::class, 'publicOptions']);

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::group(["middleware" => ["auth:sanctum"]], function () {
    // Shared Auth Routes
    Route::get('/logout', [AccountController::class, 'logout']);
    Route::post('/change-password', [AccountController::class, 'changePassword']);
    Route::get('/profile', [AccountController::class, 'getProfile']);
    Route::post('/update-profile', [AccountController::class, 'updateProfile']);
    
    // Student Specific Routes
    Route::post('/enroll/{courseId}', [EnrollmentController::class, 'enroll']);
    Route::get('/enrollment/{courseId}', [EnrollmentController::class, 'checkEnrollment']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    
    // Progress Tracking
    Route::post('/lesson-complete', [ProgressController::class, 'markComplete']);
    Route::get('/course-progress/{courseId}', [ProgressController::class, 'getCourseProgress']);
    
    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews/course/{courseId}', [ReviewController::class, 'getCourseReviews']);

    // Admin/Instructor Routes
    Route::group(["middleware" => ["admin"]], function () {
        Route::get('/admin/notifications', [AdminNotificationController::class, 'index']);
        Route::put('/admin/notifications/mark-read', [AdminNotificationController::class, 'markAllAsRead']);
        Route::put('/admin/notifications/{id}/mark-read', [AdminNotificationController::class, 'markAsRead']);

        Route::get('/dashboard-stats', [CourseController::class, 'dashboardStats']);
        Route::get('/admin/student-progress', [ProgressController::class, 'getAdminStudentProgress']);
        
        Route::get('/admin/reviews', [ReviewController::class, 'getAdminReviews']);
        Route::put('/admin/reviews/{id}/status', [ReviewController::class, 'updateStatus']);
        
        Route::get('/course-options', [CourseController::class, 'options']);
        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::post('/courses/{id}/image', [CourseController::class, 'updateImage']);
        Route::put('/courses/{id}/toggle-status', [CourseController::class, 'toggleStatus']);
        
        Route::get('/courses/{id}/outcomes', [CourseOutcomeController::class, 'index']);
        Route::post('/courses/{id}/outcomes', [CourseOutcomeController::class, 'store']);
        Route::put('/outcomes/{id}', [CourseOutcomeController::class, 'update']);
        Route::delete('/outcomes/{id}', [CourseOutcomeController::class, 'destroy']);
        Route::put('/courses/{id}/outcomes/sort', [CourseOutcomeController::class, 'sort']);
        
        Route::get('/courses/{id}/requirements', [CourseRequirementController::class, 'index']);
        Route::post('/courses/{id}/requirements', [CourseRequirementController::class, 'store']);
        Route::put('/requirements/{id}', [CourseRequirementController::class, 'update']);
        Route::delete('/requirements/{id}', [CourseRequirementController::class, 'destroy']);
        Route::put('/courses/{id}/requirements/sort', [CourseRequirementController::class, 'sort']);
        
        Route::get('/courses/{id}/chapters', [CourseChapterController::class, 'index']);
        Route::post('/courses/{id}/chapters', [CourseChapterController::class, 'store']);
        Route::put('/chapters/{id}', [CourseChapterController::class, 'update']);
        Route::put('/courses/{id}/chapters/sort', [CourseChapterController::class, 'sort']);
        Route::delete('/chapters/{id}', [CourseChapterController::class, 'destroy']);
        
        Route::get('/chapters/{id}/lessons', [CourseLessonController::class, 'index']);
        Route::post('/chapters/{id}/lessons', [CourseLessonController::class, 'store']);
        Route::put('/chapters/{id}/lessons/sort', [CourseLessonController::class, 'sort']);
        Route::get('/lessons/{id}', [CourseLessonController::class, 'show']);
        Route::post('/lessons/{id}', [CourseLessonController::class, 'update']); 
        Route::delete('/lessons/{id}', [CourseLessonController::class, 'destroy']);
    });
});