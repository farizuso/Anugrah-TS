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
        'keterangan',
        'metode_pembayaran',
        'jumlah_terbayar',
        'bukti_transfer',
        'is_lunas',
        'total',
        'status',
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
}
