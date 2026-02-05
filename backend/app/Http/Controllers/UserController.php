<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Requests\Admin\SaveUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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
        ], 201);
    }

    /**
     * Save/Update user (Admin).
     */
    public function save(SaveUserRequest $request)
    {
        $validated = $request->validated();
        $id = $request->input('id');

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user = User::updateOrCreate(['id' => $id], $userData);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => $id ? 'User updated successfully.' : 'User created successfully.',
            'user' => $user->load('roles')
        ], $id ? 200 : 201);
    }

    /**
     * Update user status (Approve/Archive).
     */
    public function updateStatus(UpdateUserStatusRequest $request, $id)
    {
        $user = User::findOrFail($id);

        $user->updateStatus($request->status, Auth::id());

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
