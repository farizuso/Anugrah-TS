<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_botol',
        'nama_produk',
        'simbol',
        'harga',
    ];

    public function rekaps()
    {
        return $this->hasMany(Rekap::class);
    }
    public function stoks()
    {
        return $this->hasMany(Stok::class);
    }
}
