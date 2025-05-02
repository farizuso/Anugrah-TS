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

    public function stokLogs()
    {
        return $this->hasMany(StokLog::class);
    }
}
