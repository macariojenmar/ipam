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
        User::factory()->developer()->create([
            'name' => 'Jenmar Macario',
            'email' => 'jenmar@email.com',
        ]);

        // Create 5 Super Admins
        $superAdmins = User::factory()->count(5)->superAdmin()->create();

        // Create 45 Regular Users
        for ($i = 0; $i < 45; $i++) {
            User::factory()->regularUser($superAdmins->random())->create();
        }
    }
}
