<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\lesson;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CourseLessonController extends Controller
{
    public function index($chapter_id)
    {
        $lessons = lesson::where('chapter_id', $chapter_id)->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $lessons
        ], 200);
    }

    public function store(Request $request, $chapter_id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'video' => 'nullable|mimes:mp4,webm,ogg|max:102400', // max 100MB for testing
            'youtube_id' => 'nullable|string|max:20',
            'is_free_preview' => 'nullable|string|in:yes,no',
            'duration' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson = new lesson();
        $lesson->chapter_id = $chapter_id;
        $lesson->title = $request->title;
        $lesson->is_free_preview = $request->input('is_free_preview', 'no');
        $lesson->duration = $request->input('duration', null);
        $lesson->description = $request->input('description', null);
        $lesson->youtube_id = $request->input('youtube_id', null);
        
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('lessons', 'public');
            $lesson->video = $path;
        }

        $lastLesson = lesson::where('chapter_id', $chapter_id)->orderBy('sort_order', 'desc')->first();
        $lesson->sort_order = $lastLesson ? $lastLesson->sort_order + 1 : 1;
        
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson added successfully',
            'data' => $lesson
        ], 200);
    }

    public function show($id)
    {
        $lesson = lesson::with('chapter.course')->find($id);
        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $lesson = lesson::find($id);
        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'chapter_id' => 'required|exists:chapters,id',
            'video' => 'nullable|mimes:mp4,webm,ogg|max:102400',
            'youtube_id' => 'nullable|string|max:20',
            'is_free_preview' => 'nullable|string|in:yes,no',
            'status' => 'nullable|integer|in:1,0',
            'duration' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson->title = $request->title;
        $lesson->chapter_id = $request->chapter_id;
        $lesson->is_free_preview = $request->input('is_free_preview', 'no');
        $lesson->status = $request->input('status', 1);
        $lesson->duration = $request->input('duration', null);
        $lesson->description = $request->input('description', null);
        $lesson->youtube_id = $request->input('youtube_id', null);
        
        if ($request->hasFile('video')) {
            // Delete old video if exists
            if ($lesson->video) {
                Storage::disk('public')->delete($lesson->video);
            }
            $path = $request->file('video')->store('lessons', 'public');
            $lesson->video = $path;
        }
        
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson updated successfully',
            'data' => $lesson
        ], 200);
    }

    public function destroy($id)
    {
        $lesson = lesson::find($id);
        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        // Delete video from storage if it exists
        if ($lesson->video) {
            Storage::disk('public')->delete($lesson->video);
        }

        $lesson->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson deleted successfully'
        ], 200);
    }

    public function sort(Request $request, $chapter_id)
    {
        $lessons = $request->input('lessons');
        
        if (is_array($lessons)) {
            foreach ($lessons as $index => $id) {
                lesson::where('id', $id)->where('chapter_id', $chapter_id)->update(['sort_order' => $index]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated successfully'
        ], 200);
    }
}
