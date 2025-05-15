<?php

namespace Database\Factories;

use App\Models\Produk;
use App\Models\Stok;
use Illuminate\Database\Eloquent\Factories\Factory;

class StokFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Stok::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'produk_id' => Produk::factory(),
            'jumlah' => $this->faker->numberBetween(0, 100),
            'updated_at' => now(),
            'created_at' => now(),
        ];
    }
}
