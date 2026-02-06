<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;

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
        foreach (PermissionEnum::values() as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // Create Roles and Assign Permissions

        // Developer
        $devRole = Role::create(['name' => RoleEnum::DEVELOPER->value, 'guard_name' => 'api']);
        $devRole->givePermissionTo(Permission::all());

        // Super-Admin
        $adminRole = Role::create(['name' => RoleEnum::SUPER_ADMIN->value, 'guard_name' => 'api']);
        $adminRole->givePermissionTo([
            PermissionEnum::CAN_DELETE_IP_ADDRESS->value,
            PermissionEnum::CAN_VIEW_DASHBOARD->value,
            PermissionEnum::CAN_APPROVE_USERS->value,
            PermissionEnum::CAN_REJECT_USERS->value,
            PermissionEnum::CAN_VIEW_USERS->value,
            PermissionEnum::CAN_VIEW_IP_MANAGEMENT->value,
        ]);

        // User
        $userRole = Role::create(['name' => RoleEnum::USER->value, 'guard_name' => 'api']);
        $userRole->givePermissionTo([
            PermissionEnum::CAN_VIEW_IP_MANAGEMENT->value
        ]);
    }
}
