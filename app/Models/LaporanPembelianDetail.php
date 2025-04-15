<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPembelianDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'laporan_pembelian_id',
        'produk_id',
        'harga',
        'quantity',
    ];

    /**
     * Relasi dengan Produk
     */
    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    /**
     * Relasi dengan LaporanPembelian
     */
    public function laporan()
    {
        return $this->belongsTo(LaporanPembelian::class, 'laporan_pembelian_id');
    }
}