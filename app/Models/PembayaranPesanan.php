<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembayaranPesanan extends Model
{
    //
    use HasFactory;

    protected $fillable = ['pesanan_id', 'jumlah_bayar', 'bukti_transfer'];

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class);
    }
}