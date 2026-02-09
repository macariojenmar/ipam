<?php

namespace Database\Factories;

use App\Models\IpAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IpAddress>
 */
class IpAddressFactory extends Factory
{
    protected $model = IpAddress::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['IPv4', 'IPv6']);
        
        return [
            'ip' => $type === 'IPv4' ? $this->faker->unique()->ipv4 : $this->faker->unique()->ipv6,
            'type' => $type,
            'label' => $this->faker->words(3, true),
            'comment' => $this->faker->sentence(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
