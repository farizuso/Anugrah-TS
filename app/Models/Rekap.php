<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rekap extends Model
{
    use HasFactory;

    protected $fillable = [
        'pesanan_id',
        'pelanggan_id',
        'produk_id',
        'nomor_tabung',
        'tanggal_keluar',
        'tanggal_kembali',
        'status',
    ];

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class);
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    public function pelanggan()
    {
        return $this->pesanan->pelanggan;
    }



    public function getNamaPelangganAttribute()
    {
        return $this->pesanan->nama_pelanggan ?? '-';
    }
}
