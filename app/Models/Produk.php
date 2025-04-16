<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_produk',
        'simbol',
        'jenis',
        'harga_jual',
    ];

    public function rekaps()
    {
        return $this->hasMany(Rekap::class);
    }
    public function stok()
    {
        return $this->hasOne(Stok::class);
    }
}