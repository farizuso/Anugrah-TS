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
        'kategori',
        'harga_jual',
        // 'jenis',
    ];

    public function rekaps()
    {
        return $this->hasMany(Rekap::class);
    }
    public function stok()
    {
        return $this->hasOne(Stok::class);
    }

    // public function pesanans()
    // {
    //     return $this->belongsToMany(Pesanan::class, 'pesanan_details', 'produk_id', 'pesanan_id')
    //         ->withPivot('quantity', 'harga')
    //         ->withTimestamps();
    // }
}
