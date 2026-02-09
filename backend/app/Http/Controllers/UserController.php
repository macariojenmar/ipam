<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Requests\Admin\SaveUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use Illuminate\Http\Request;
use App\Enums\RoleEnum;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(protected AuditLogger $auditLogger) {}

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $filters = $request->only(['status', 'search']);

        $query = User::with('roles:id,name')
            ->search($filters['search'] ?? null)
            ->filterByStatus($filters['status'] ?? null);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->hasRole(RoleEnum::SUPER_ADMIN->value)) {
            $query->whereDoesntHave('roles', function ($q) {
                $q->where('name', RoleEnum::DEVELOPER->value);
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

        if ($request->status === 'archived' && $user->hasRole(RoleEnum::DEVELOPER->value)) {
            return response()->json([
                'success' => false,
                'message' => 'Users with Developer role cannot be archived.',
            ], 403);
        }

        $oldStatus = $user->status->value;
        $user->updateStatus($request->status, Auth::id());

        // Log status change
        $this->auditLogger->logUserStatusChanged($user, $oldStatus, $request->status);

        return response()->json([
            'success' => true,
            'message' => "User status updated to {$request->status}.",
        ]);
    }

    public function create(SaveUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::createWithRole($validated, $validated['role']);

        // Log user creation
        $this->auditLogger->logUserCreated($user);
        $this->auditLogger->logUserRoleChanged($user, [], [$validated['role']]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.'
        ]);
    }

    public function update(UpdateUserRequest $request, $id)

    {
        $validated = $request->validated();
        $user = User::findOrFail($id);

        // Capture old values for audit
        $oldValues = $user->only(['name', 'email', 'status']);
        $oldRoles = $user->getRoleNames()->toArray();

        $user->updateWithRole($validated, $validated['role']);

        // Capture new values for audit
        $newValues = $user->fresh()->only(['name', 'email', 'status']);
        $newRoles = [$validated['role']];

        // Log user update
        $this->auditLogger->logUserUpdated($user, $oldValues, $newValues);

        // Log role changes if different
        if ($oldRoles != $newRoles) {
            $this->auditLogger->logUserRoleChanged($user, $oldRoles, $newRoles);
        }

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.'
        ]);
    }
}
