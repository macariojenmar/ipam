<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'can-add-ip-address',
            'can-edit-ip-address',
            'can-delete-ip-address',
            'can-view-audit-logs',
            'can-approve-users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Roles and Assign Permissions
        
        // Developer: All permissions
        $devRole = Role::create(['name' => 'Developer']);
        $devRole->givePermissionTo(Permission::all());

        // Super-Admin: All management and audit permissions
        $adminRole = Role::create(['name' => 'Super-Admin']);
        $adminRole->givePermissionTo([
            'can-add-ip-address',
            'can-edit-ip-address',
            'can-delete-ip-address',
            'can-view-audit-logs',
            'can-approve-users',
        ]);

        // User: Basic permissions
        $userRole = Role::create(['name' => 'User']);
        $userRole->givePermissionTo([
            'can-add-ip-address',
            'can-edit-ip-address',
        ]);
    }
}
