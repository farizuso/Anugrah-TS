<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;


class LaporanPembelian extends Model
{
    use HasFactory;

    protected $fillable = [
        'tgl_pembelian',
        'supplier_id',
        'total',
        'ppn',
        'grand_total',
        'metode_pembayaran',
        'keterangan',
        'details', // Pastikan details sesuai dengan struktur yang diinginkan
        'status',

    ];

    protected $casts = [
        'tgl_pembelian' => 'datetime',
    ];

    // protected function tglPembelian(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn($value) => Carbon::parse($value)->timezone('Asia/Jakarta'),
    //     );
    // }


    public function details()
    {
        return $this->hasMany(LaporanPembelianDetail::class, 'laporan_pembelian_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}
