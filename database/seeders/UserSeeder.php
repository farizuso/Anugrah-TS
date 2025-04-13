<?php

// database/seeders/UserSeeder.php

// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Membuat Admin
        $adminRole = Role::where('name', 'Admin')->first();
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin123'),
        ]);
        $admin->roles()->attach($adminRole);

        // Membuat Staff Gudang
        $staffGudangRole = Role::where('name', 'Staff Gudang')->first();
        $staffGudang = User::create([
            'name' => 'Staff Gudang User',
            'email' => 'staffgudang@gmail.com',
            'password' => bcrypt('staffgudang123'),
        ]);
        $staffGudang->roles()->attach($staffGudangRole);

        // Membuat Staff Penjualan
        $staffPenjualanRole = Role::where('name', 'Staff Penjualan')->first();
        $staffPenjualan = User::create([
            'name' => 'Staff Penjualan User',
            'email' => 'staffpenjualan@gmail.com',
            'password' => bcrypt('staffpenjualan123'),
        ]);
        $staffPenjualan->roles()->attach($staffPenjualanRole);
    }
}