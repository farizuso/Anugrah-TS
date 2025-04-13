<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPembelian extends Model
{
    use HasFactory;

    protected $fillable = [
        'tgl_pembelian',
        'nama_supplier',
        'total',
        'keterangan',
    ];

    public function details()
    {
        return $this->hasMany(LaporanPembelianDetail::class, 'laporan_pembelian_id');
    }
}