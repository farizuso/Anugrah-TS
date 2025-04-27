<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pelanggan',
        'alamat',
        'no_hp',
    ];

    public function rekaps()
    {
        return $this->hasMany(Rekap::class);
    }

    public function sewa_tabung()
    {
        return $this->hasMany(SewaTabung::class);
    }
}
