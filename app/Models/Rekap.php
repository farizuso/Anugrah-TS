<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rekap extends Model
{
    protected $fillable = [
        'pesanan_id',
        'pelanggan_id',
        'produk_id',
        'nomor_tabung',
        'status',
        'tanggal_keluar',
        'tanggal_kembali',
    ];

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class);
    }

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class);
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}
