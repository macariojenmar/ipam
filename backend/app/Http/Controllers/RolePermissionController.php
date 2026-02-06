<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Enums\RoleEnum;

class RolePermissionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $permissions = Permission::with('roles')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->paginate($perPage);

        $allRoles = RoleEnum::values();

        $formattedData = $permissions->getCollection()->map(function ($permission) use ($allRoles) {
            $roleStates = [];
            foreach ($allRoles as $roleName) {
                $roleStates[$roleName] = $permission->roles->contains('name', $roleName);
            }

            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'roles' => $roleStates,
            ];
        });

        $permissions->setCollection($formattedData);

        return response()->json($permissions);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'guard_name' => 'api'
        ]);

        // Auto-assign to Developer
        $developerRole = Role::where('name', RoleEnum::DEVELOPER->value)->first();
        if ($developerRole) {
            $developerRole->givePermissionTo($permission);
        }

        // Return the same format as index for the grid
        $allRoles = RoleEnum::values();
        $roleStates = [];
        foreach ($allRoles as $roleName) {
            // Refetch roles for the new permission (it should have Developer now)
            $roleStates[$roleName] = $permission->fresh()->roles->contains('name', $roleName);
        }

        return response()->json([
            'id' => $permission->id,
            'name' => $permission->name,
            'roles' => $roleStates,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
            'enabled' => 'required|boolean',
        ]);

        $permission = Permission::findOrFail($id);
        $role = Role::where('name', $request->role)->firstOrFail();

        if ($request->enabled) {
            $role->givePermissionTo($permission);
        } else {
            $role->revokePermissionTo($permission);
        }

        return response()->json(['success' => true]);
    }
}
