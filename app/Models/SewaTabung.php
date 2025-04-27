<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SewaTabung extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'pelanggan_id',
        'jumlah_tabung',
        'total_jaminan',
        'tgl_sewa',
        'tgl_kembali',
        'status',
    ];

    protected $dates = ['tgl_sewa', 'tgl_kembali'];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class);
    }

    public function getStatusSewaAttribute(): string
    {
        if ($this->status === 'Dikembalikan') {
            return 'Dikembalikan';
        }

        if (!$this->tgl_kembali) {
            $selisih = Carbon::parse($this->tgl_sewa)->diffInMonths(now());
            return $selisih > 6 ? 'Hangus' : 'Disewa';
        }

        return $this->status;
    }
}