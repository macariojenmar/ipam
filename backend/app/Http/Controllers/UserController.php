<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Signup a new user.
     */
    public function register(RegisterRequest $request)
    {
        $user = User::register($request->validated());

        return response()->json([
            'message' => 'Registration successful. Account pending approval.',
            'user' => $user
        ], 210);
    }

    /**
     * Update user status (Approve/Archive).
     */
    public function updateStatus(UpdateUserStatusRequest $request, $id)
    {
        $user = User::findOrFail($id);

        $user->updateStatus($request->status, auth()->id());

        return response()->json([
            'message' => "User status updated to {$request->status}.",
            'user' => $user
        ]);
    }

    /**
     * List all users.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $filters = $request->only(['status', 'search']);

        return response()->json(User::listPaginated($perPage, $filters));
    }
}
