<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rekap extends Model
{
    use HasFactory;

    protected $fillable = [
        'tgl_keluar',
        'tgl_kembali',
        'tgl_masuk_pabrik',
        'keterangan',
        'produk_id',
        'pelanggan_id',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class);
    }
}
