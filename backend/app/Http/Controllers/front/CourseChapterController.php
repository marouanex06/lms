<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\chapter;
use Illuminate\Support\Facades\Validator;

class CourseChapterController extends Controller
{
    public function index($course_id)
    {
        $chapters = chapter::where('course_id', $course_id)->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $chapters
        ], 200);
    }

    public function store(Request $request, $course_id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter = new chapter();
        $chapter->course_id = $course_id;
        $chapter->title = $request->title;
        
        $lastChapter = chapter::where('course_id', $course_id)->orderBy('sort_order', 'desc')->first();
        $chapter->sort_order = $lastChapter ? $lastChapter->sort_order + 1 : 1;
        
        $chapter->save();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter added successfully',
            'data' => $chapter
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $chapter = chapter::find($id);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter->title = $request->title;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter updated successfully',
            'data' => $chapter
        ], 200);
    }

    public function destroy($id)
    {
        $chapter = chapter::find($id);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found'
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter deleted successfully'
        ], 200);
    }

    public function sort(Request $request, $course_id)
    {
        $chapters = $request->input('chapters');
        
        if (is_array($chapters)) {
            foreach ($chapters as $index => $id) {
                chapter::where('id', $id)->where('course_id', $course_id)->update(['sort_order' => $index]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated successfully'
        ], 200);
    }
}
