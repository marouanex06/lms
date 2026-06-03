<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\requirement;
use Illuminate\Support\Facades\Validator;

class CourseRequirementController extends Controller
{
    public function index($course_id)
    {
        $requirements = requirement::where('course_id', $course_id)->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $requirements
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

        $requirement = new requirement();
        $requirement->course_id = $course_id;
        $requirement->text = $request->text;
        
        $lastRequirement = requirement::where('course_id', $course_id)->orderBy('sort_order', 'desc')->first();
        $requirement->sort_order = $lastRequirement ? $lastRequirement->sort_order + 1 : 1;
        
        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement added successfully',
            'data' => $requirement
        ], 200);
    }

    public function destroy($id)
    {
        $requirement = requirement::find($id);
        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        $requirement->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement deleted successfully'
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

        $requirement = requirement::find($id);
        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        $requirement->text = $request->text;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement updated successfully',
            'data' => $requirement
        ], 200);
    }

    public function sort(Request $request, $course_id)
    {
        $requirements = $request->input('requirements');
        
        if (is_array($requirements)) {
            foreach ($requirements as $index => $id) {
                requirement::where('id', $id)->where('course_id', $course_id)->update(['sort_order' => $index]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated successfully'
        ], 200);
    }
}
