<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\LessonCompletion;
use App\Models\Lesson;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    public function markComplete(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'course_id' => 'required|exists:courses,id'
        ]);

        $user_id = Auth::user()->id;

        $completion = LessonCompletion::updateOrCreate(
            ['user_id' => $user_id, 'lesson_id' => $request->lesson_id],
            ['course_id' => $request->course_id]
        );

        return response()->json([
            'status' => 200,
            'message' => 'Lesson marked as completed',
            'data' => $completion
        ], 200);
    }

    public function getCourseProgress($courseId)
    {
        $user_id = Auth::user()->id;

        $totalLessons = Lesson::whereHas('chapter', function($query) use ($courseId) {
            $query->where('course_id', $courseId);
        })->count();

        if ($totalLessons === 0) {
            return response()->json(['status' => 200, 'percentage' => 0], 200);
        }

        $completedCount = LessonCompletion::where('user_id', $user_id)
            ->where('course_id', $courseId)
            ->count();

        $percentage = round(($completedCount / $totalLessons) * 100);

        return response()->json([
            'status' => 200,
            'percentage' => $percentage,
            'completed_lessons' => LessonCompletion::where('user_id', $user_id)->where('course_id', $courseId)->pluck('lesson_id')
        ], 200);
    }

    public function getAdminStudentProgress(Request $request)
    {
        $userId = Auth::user()->id;
        
        $enrollments = Enrollment::with(['user', 'course'])
            ->whereHas('course', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->get()
            ->map(function ($enrollment) {
                $courseId = $enrollment->course_id;
                $userId = $enrollment->user_id;

                $totalLessons = Lesson::whereHas('chapter', function($query) use ($courseId) {
                    $query->where('course_id', $courseId);
                })->count();

                $completedCount = LessonCompletion::where('user_id', $userId)
                    ->where('course_id', $courseId)
                    ->count();

                $enrollment->progress_percentage = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;
                return $enrollment;
            });

        return response()->json([
            'status' => 200,
            'data' => $enrollments
        ], 200);
    }
}
