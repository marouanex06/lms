<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['status' => 403, 'message' => 'Unauthorized'], 403);
        }

        $notifications = $user->unreadNotifications;

        return response()->json([
            'status' => 200,
            'data' => $notifications
        ], 200);
    }

    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $notification = $user->unreadNotifications()->find($id);

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['status' => 200, 'message' => 'Notification marked as read'], 200);
        }

        return response()->json(['status' => 404, 'message' => 'Notification not found'], 404);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        $user->unreadNotifications->markAsRead();

        return response()->json(['status' => 200, 'message' => 'All notifications marked as read'], 200);
    }
}
