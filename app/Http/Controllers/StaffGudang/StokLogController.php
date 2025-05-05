<?php

namespace App\Http\Controllers\StaffGudang;

use App\Http\Controllers\Controller;
use App\Models\StokLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokLogController extends Controller
{
    //

    public function index(Request $request)
    {
        // Kalau mau nanti bisa tambahkan filter tanggal, produk, dsb.

        $stokLogs = StokLog::with('produk')
            ->orderBy('tanggal', 'desc')
            ->paginate(20);

        return Inertia::render('StaffGudang/StokLogs/Index', [
            'stokLogs' => $stokLogs,
        ]);
    }

    public function getStokLogPenjualan()
    {
        // Kalau mau nanti bisa tambahkan filter tanggal, produk, dsb.

        $stokLogs = StokLog::with('produk')
            ->orderBy('tanggal', 'desc')
            ->paginate(20);

        return Inertia::render('StaffPenjualan/StokLogs/Index', [
            'stokLogs' => $stokLogs,
        ]);
    }

    public function getStokLogAdmin()
    {
        // Kalau mau nanti bisa tambahkan filter tanggal, produk, dsb.

        $stokLogs = StokLog::with('produk')
            ->orderBy('tanggal', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/StokLogs/Index', [
            'stokLogs' => $stokLogs,
        ]);
    }
}
