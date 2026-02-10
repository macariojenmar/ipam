<?php

namespace Database\Factories;

use App\Enums\RoleEnum;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'status' => UserStatus::ACTIVE,
            'reviewed_at' => now(),
        ];
    }

    public function superAdmin(): static
    {
        return $this->afterCreating(function (User $user) {
            $user->assignRole(RoleEnum::SUPER_ADMIN->value);
        });
    }

    public function developer(): static
    {
        return $this->afterCreating(function (User $user) {
            $user->assignRole(RoleEnum::DEVELOPER->value);
        });
    }

    public function regularUser(User $reviewer = null): static
    {
        return $this->state(fn (array $attributes) => [
            'reviewed_by' => $reviewer?->id,
        ])->afterCreating(function (User $user) {
            $user->assignRole(RoleEnum::USER->value);
        });
    }
}
