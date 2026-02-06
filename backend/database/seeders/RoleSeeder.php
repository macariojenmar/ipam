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
            'can-delete-ip-address',
            'can-view-dashboard',
            'can-approve-users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // Create Roles and Assign Permissions

        // Developer
        $devRole = Role::create(['name' => 'Developer', 'guard_name' => 'api']);
        $devRole->givePermissionTo(Permission::all());

        // Super-Admin
        $adminRole = Role::create(['name' => 'Super-Admin', 'guard_name' => 'api']);
        $adminRole->givePermissionTo([
            'can-delete-ip-address',
            'can-view-dashboard',
            'can-approve-users',
        ]);

        // User
        Role::create(['name' => 'User', 'guard_name' => 'api']);
    }
}
