<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPembelian extends Model
{
    use HasFactory;

    protected $fillable = [
        'tgl_pembelian',
        'supplier_id',
        'total',
        'keterangan',
        'details', // Pastikan details sesuai dengan struktur yang diinginkan
    ];

    protected $casts = [
        'tgl_pembelian' => 'date',  // Menggunakan tipe date di sini
    ];

    /**
     * Relasi dengan Supplier
     */
    public function details()
    {
        return $this->hasMany(LaporanPembelianDetail::class, 'laporan_pembelian_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}