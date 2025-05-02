<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StokLog extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'produk_id',
        'tipe',
        'jumlah',
        'sisa_stok',
        'keterangan',
        'tanggal',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}
