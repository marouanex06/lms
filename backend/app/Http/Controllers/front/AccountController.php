<?php

namespace App\Http\Controllers\front;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class AccountController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ],400);
        }


        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            $admin->notify(new \App\Notifications\NewUserNotification($user));
        }

        return response()->json([
            'status' => 200,
            'message' => 'Registration successful',
        ],200);
    }
    

    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'id' => Auth::user()->id,
                'role' => $user->role
            ],200);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Either Email/Password is incorrect'
            ],401);
        }
    }
   
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => 'required|min:6',
            'confirm_password' => 'required|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user = User::find(Auth::user()->id);

        if (Hash::check($request->old_password, $user->password)) {
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 200,
                'message' => 'Password changed successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Old password does not match'
            ], 400);
        }
    }

    public function getProfile()
    {
        $user = User::find(Auth::user()->id);
        return response()->json([
            'status' => 200,
            'data' => $user
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = User::find(Auth::user()->id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'mobile' => 'nullable|numeric',
            'designation' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:100',
            'birthday' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $data = $request->except('image');
        
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->profile_pic) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->profile_pic);
            }
            $path = $request->file('image')->store('profiles', 'public');
            $data['profile_pic'] = $path;
        }

        $user->update($data);

        return response()->json([
            'status' => 200,
            'message' => 'Profile updated successfully',
            'data' => $user
        ], 200);
    }
}
