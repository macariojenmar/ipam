<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // James Doe - Developer
        $james = User::create([
            'name' => 'James Doe',
            'email' => 'james@email.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'approved_at' => now(),
        ]);
        $james->assignRole('Developer');

        // Jane Doe - Super-Admin
        $jane = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@email.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'approved_at' => now(),
        ]);
        $jane->assignRole('Super-Admin');

        // John Smith - Regular User (Approved by Jane)
        $john = User::create([
            'name' => 'John Smith',
            'email' => 'john@email.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'approved_by' => $jane->id,
            'approved_at' => now(),
        ]);
        $john->assignRole('User');
    }
}
