<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\outcome;
use Illuminate\Support\Facades\Validator;

class CourseOutcomeController extends Controller
{
    public function index($course_id)
    {
        $outcomes = outcome::where('course_id', $course_id)->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $outcomes
        ], 200);
    }

    public function store(Request $request, $course_id)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome = new outcome();
        $outcome->course_id = $course_id;
        $outcome->text = $request->text;
        
        $lastOutcome = outcome::where('course_id', $course_id)->orderBy('sort_order', 'desc')->first();
        $outcome->sort_order = $lastOutcome ? $lastOutcome->sort_order + 1 : 1;
        
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome added successfully',
            'data' => $outcome
        ], 200);
    }

    public function destroy($id)
    {
        $outcome = outcome::find($id);
        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome deleted successfully'
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome = outcome::find($id);
        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $outcome->text = $request->text;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome updated successfully',
            'data' => $outcome
        ], 200);
    }

    public function sort(Request $request, $course_id)
    {
        $outcomes = $request->input('outcomes'); // array of ordered IDs
        
        if (is_array($outcomes)) {
            foreach ($outcomes as $index => $id) {
                outcome::where('id', $id)->where('course_id', $course_id)->update(['sort_order' => $index]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated successfully'
        ], 200);
    }
}
