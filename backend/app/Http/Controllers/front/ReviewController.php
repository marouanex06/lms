<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $review = Review::updateOrCreate(
            ['user_id' => Auth::user()->id, 'course_id' => $request->course_id],
            ['rating' => $request->rating, 'comment' => $request->comment, 'status' => 0] // Pending approval
        );

        return response()->json([
            'status' => 200,
            'message' => 'Review submitted successfully and is pending approval.',
            'data' => $review
        ], 200);
    }

    public function getCourseReviews($courseId)
    {
        $reviews = Review::with('user:id,name,profile_pic')
            ->where('course_id', $courseId)
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $reviews
        ], 200);
    }

    public function getAdminReviews()
    {
        $userId = Auth::user()->id;
        
        // Get reviews for courses owned by this admin
        $reviews = Review::with(['user:id,name,profile_pic', 'course:id,title'])
            ->whereHas('course', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $reviews
        ], 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['status' => 404, 'message' => 'Review not found'], 404);
        }

        $review->status = $request->status;
        $review->save();

        return response()->json([
            'status' => 200,
            'message' => 'Review status updated successfully',
            'data' => $review
        ], 200);
    }
}
