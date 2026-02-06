<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Requests\Admin\SaveUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $filters = $request->only(['status', 'search']);

        return response()->json(
            User::with('roles:id,name')
                ->search($filters['search'] ?? null)
                ->filterByStatus($filters['status'] ?? null)
                ->latest()
                ->paginate($perPage)
        );
    }

    public function register(RegisterRequest $request)
    {
        User::register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Registration successful. Account pending approval.',
        ]);
    }

    public function updateStatus(UpdateUserStatusRequest $request, $id)
    {
        $user = User::findOrFail($id);

        $user->updateStatus($request->status, Auth::id());

        return response()->json([
            'success' => true,
            'message' => "User status updated to {$request->status}.",
        ]);
    }

    public function create(SaveUserRequest $request)
    {
        $validated = $request->validated();

        User::createWithRole($validated, $validated['role']);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.'
        ]);
    }

    public function update(UpdateUserRequest $request, $id)

    {
        $validated = $request->validated();
        $user = User::findOrFail($id);

        $user->updateWithRole($validated, $validated['role']);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.'
        ]);
    }
}
