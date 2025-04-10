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
        'produk_id',   
        'quantity',
        'harga',
        'total',
        'keterangan',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}
