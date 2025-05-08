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
        'tanggal_keluar',
        'tanggal_kembali',
        'nomor_tabung',
        'status',
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
