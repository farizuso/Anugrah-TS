<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'tgl_pesanan',
        'pelanggan_id',
        'total',
        'status',
        'jumlah_terbayar',
        'metode_pembayaran',
        'jenis_pesanan',
        'keterangan',
        'is_lunas',
        'bukti_transfer',
    ];



    protected $casts = [
        'tgl_pesanan' => 'date',
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id');
    }

    public function details()
    {
        return $this->hasMany(PesananDetail::class, 'pesanan_id');
    }


    public function riwayat_pembayaran()
    {
        return $this->hasMany(PembayaranPesanan::class);
    }


    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    public function rekaps()
    {
        return $this->hasMany(Rekap::class);
    }
}
