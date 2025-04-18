<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_supplier',
        'alamat',
        'no_telp',
    ];

    /**
     * Relasi dengan LaporanPembelian
     */
    public function laporanPembelian()
    {
        return $this->hasMany(LaporanPembelian::class);
    }
}