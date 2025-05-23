<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'role' => $this->faker->randomElement(['admin', 'staff_gudang', 'staff_penjualan']),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }

    /**
     * Configure the model to have admin role.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
            ];
        });
    }

    /**
     * Configure the model to have staff_gudang role.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function staffGudang()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'staff_gudang',
            ];
        });
    }

    /**
     * Configure the model to have staff_penjualan role.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function staffPenjualan()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'staff_penjualan',
            ];
        });
    }
}
