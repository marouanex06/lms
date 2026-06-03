<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\enrollment;

class EnrollmentController extends Controller
{
    public function enroll(Request $request, $courseId)
    {
        $userId = $request->user()->id;

        $existing = enrollment::where('user_id', $userId)->where('course_id', $courseId)->first();
        if ($existing) {
            return response()->json([
                'status' => 409,
                'message' => 'You are already enrolled in this course'
            ], 409);
        }

        $enrollment = new enrollment();
        $enrollment->user_id = $userId;
        $enrollment->course_id = $courseId;
        $enrollment->save();

        $admin = \App\Models\User::where('role', 'admin')->first();
        if ($admin) {
            $course = \App\Models\Course::find($courseId);
            if ($course) {
                $admin->notify(new \App\Notifications\NewEnrollmentNotification($request->user(), $course));
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Enrolled successfully',
            'data' => $enrollment
        ], 200);
    }

    public function checkEnrollment(Request $request, $courseId)
    {
        $userId = $request->user()->id;
        $enrolled = enrollment::where('user_id', $userId)->where('course_id', $courseId)->exists();

        return response()->json([
            'status' => 200,
            'data' => ['enrolled' => $enrolled]
        ], 200);
    }

    public function myEnrollments(Request $request)
    {
        $userId = $request->user()->id;
        $enrollments = enrollment::with(['course.level', 'course.category', 'course.chapters.lessons'])
            ->where('user_id', $userId)
            ->get();

        $courses = $enrollments->map(function($e) {
            $course = $e->course;
            if (!$course) return null;

            $totalLessons = \App\Models\Lesson::whereHas('chapter', function($query) use ($course) {
                $query->where('course_id', $course->id);
            })->count();

            $completedCount = \App\Models\LessonCompletion::where('user_id', $e->user_id)
                ->where('course_id', $course->id)
                ->count();

            $course->progress_percentage = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;
            return $course;
        })->filter();

        return response()->json([
            'status' => 200,
            'data' => $courses->values()
        ], 200);
    }
}
