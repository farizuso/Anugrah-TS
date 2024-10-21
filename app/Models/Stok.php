<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stok extends Model
{
    use HasFactory;

    protected $fillable = [
        'produk_id',
        'lokasi_penyimpanan',
        'jumlah_stok',
        'minimum_stok',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
    protected static function booted()
    {
        static::saving(function ($stok) {
            $stok->tgl_update_stok = now(); // Otomatis mengisi dengan tanggal saat ini
        });
    }
}
