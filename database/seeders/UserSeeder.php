<?php

// database/seeders/UserSeeder.php

// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Membuat Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => Hash::make('admin123'), 
        ]);

        User::create([
            'name' => 'Staff Gudang',
            'email' => 'staffgudang@gmail.com',
            'role' => 'staff_gudang',
            'password' => Hash::make('staffgudang123'), 
        ]);

        User::create([
            'name' => 'Staff Penjualan',
            'email' => 'staffpenjualan@gmail.com',
            'role' => 'staff_penjualan',
            'password' => Hash::make('staffpenjualan123'),
        ]);
    }
}