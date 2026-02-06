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

        $query = User::with('roles:id,name')
            ->search($filters['search'] ?? null)
            ->filterByStatus($filters['status'] ?? null);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->hasRole('Super-Admin')) {
            $query->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'Developer');
            })->where('status', '!=', 'archived');
        }

        return response()->json(
            $query->latest()->paginate($perPage)
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

        if ($request->status === 'archived' && $user->hasRole('Developer')) {
            return response()->json([
                'success' => false,
                'message' => 'Users with Developer role cannot be archived.',
            ], 403);
        }

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
