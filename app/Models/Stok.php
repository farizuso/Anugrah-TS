<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stok extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'produk_id',
        'jumlah_stok',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    public function updateStock($quantity)
    {
        $this->increment('jumlah_stok', $quantity);
    }
}
