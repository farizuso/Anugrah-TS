<?php

// database/seeders/RolesSeeder.php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        // Membuat role
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'Staff Gudang']);
        Role::create(['name' => 'Staff Penjualan']);
    }
}