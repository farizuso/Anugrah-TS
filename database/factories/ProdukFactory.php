<?php

namespace Database\Factories;

use App\Models\Produk;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProdukFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Produk::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $categories = ['Gas', 'Tabung', 'Aksesoris', 'Lainnya'];

        return [
            'nama_produk' => $this->faker->unique()->words(3, true),
            'simbol' => strtoupper($this->faker->unique()->lexify('???')),
            'kategori' => $this->faker->randomElement($categories),
            'harga_jual' => $this->faker->numberBetween(10000, 1000000),
        ];
    }
}
