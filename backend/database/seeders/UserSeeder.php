<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Developer
        $developer = User::create([
            'name' => 'Jenmar Macario',
            'email' => 'jenmar@email.com',
            'password' => Hash::make('password'),
            'status' => UserStatus::ACTIVE,
            'reviewed_at' => now(),
        ]);
        $developer->assignRole('Developer');

        // Create 5 Super Admins
        $superAdmins = collect();

        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'name' => "Super Admin {$i}",
                'email' => "superadmin{$i}@email.com",
                'password' => Hash::make('password'),
                'status' => UserStatus::ACTIVE,
                'reviewed_at' => now(),
            ]);

            $user->assignRole('Super-Admin');
            $superAdmins->push($user);
        }

        // Create 45 Regular Users
        for ($i = 1; $i <= 45; $i++) {
            $reviewer = $superAdmins->random();

            $user = User::create([
                'name' => "User {$i}",
                'email' => "user{$i}@email.com",
                'password' => Hash::make('password'),
                'status' => UserStatus::ACTIVE,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            $user->assignRole('User');
        }
    }
}
