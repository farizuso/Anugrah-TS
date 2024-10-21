<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = [
            'name' => "admin",
            'email' => "admin@gmail.com",
            'password' => bcrypt('admin123')
        ];

        \App\Models\User::create($admin);
    }
}
