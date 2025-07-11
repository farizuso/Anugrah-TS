<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\TodoController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\LaporanPembelianController;
use App\Http\Controllers\Admin\LaporanPenjualanController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\StaffGudang\RekapController;
use App\Http\Controllers\StaffGudang\StokLogController;
use App\Http\Controllers\StaffPenjualan\PelangganController;
use App\Http\Controllers\StaffPenjualan\PesananController;
use App\Http\Controllers\StaffPenjualan\SewaTabungController;
use App\Http\Controllers\Dashboard\DashboardController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware('auth',)->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('/todos', TodoController::class)->names('admin.todo');
    Route::resource('/admin/dashboard', DashboardController::class)->names('admin.dashboard');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/produk', [ProductController::class, 'index'])->name('admin.produk.index');
    Route::put('/admin/produk/{produk}', [ProductController::class, 'update'])->name('admin.produk.update');
    Route::delete('/admin/produk/{produk}', [ProductController::class, 'destroy'])->name('admin.produk.destroy');
    Route::post('/admin/produk', [ProductController::class, 'store'])->name('admin.produk.store');

    Route::get('/admin/supplier', [SupplierController::class, 'index'])->name('admin.supplier.index');
    Route::put('/admin/supplier/{id}', [SupplierController::class, 'update'])->name('admin.supplier.update');
    Route::delete('/admin/supplier/{id}', [SupplierController::class, 'destroy'])->name('admin.supplier.destroy');
    Route::post('/admin/supplier', [SupplierController::class, 'store'])->name('admin.supplier.store');

    Route::get('/admin/laporanpembelian', [LaporanPembelianController::class, 'index'])->name('admin.laporanpembelian.index');
    Route::put('/admin/laporanpembelian/{id}', [LaporanPembelianController::class, 'update'])->name('admin.laporanpembelian.update');
    Route::delete('/admin/laporanpembelian/{id}', [LaporanPembelianController::class, 'destroy'])->name('admin.laporanpembelian.destroy');
    Route::post('/admin/laporanpembelian', [LaporanPembelianController::class, 'store'])->name('admin.laporanpembelian.store');
    Route::get('/admin/laporanpembelian/export', [LaporanPembelianController::class, 'export'])->name('admin.laporanpembelian.export');

    Route::get('/admin/rekap', [RekapController::class, 'getRekapAdmin'])->name('admin.rekap.index');

    Route::get('/admin/laporan-penjualan', [PesananController::class, 'getLaporanPenjualanAdmin'])->name('admin.laporanPenjualan.index');
    Route::get('/admin/laporan-penjualan/{id}/detail', [PesananController::class, 'getdetail_pesananAdmin'])->name('admin.laporanPenjualan.detail');

    Route::get('/admin/stok-log', [StokLogController::class, 'getStokLogAdmin'])->name('admin.stok-log.index');
});


Route::middleware(['auth', 'role:staff_gudang'])->group(function () {

    Route::get('/staffgudang/laporanpembelian', [LaporanPembelianController::class, 'getLaporanPembelianGudang'])->name('staffgudang.laporanpembelian.index');
    Route::put('/staffgudang/laporan-pembelian/{id}/konfirmasi', [LaporanPembelianController::class, 'konfirmasi'])->name('staffgudang.laporanpembelian.konfirmasi');

    Route::get('/staffgudang/produk', [ProductController::class, 'getProdukGudang'])->name('staffgudang.produk.index');

    Route::resource('/staffgudang/rekap', RekapController::class)->names('staffgudang.rekap');
    Route::put('/staffgudang/rekap/{id}/konfirmasi-kembali', [RekapController::class, 'konfirmasiKembali'])->name('staffgudang.rekap.konfirmasi-kembali');

    Route::get('/staffgudang/stok-log', [StokLogController::class, 'index'])->name('staffgudang.stok-log.index');
});



Route::middleware(['auth', 'role:staff_penjualan'])->group(function () {
    Route::resource('/staffpenjualan/Pelanggan', PelangganController::class)->names('staffpenjualan.pelanggan');

    Route::resource('/staffpenjualan/Pesanan', PesananController::class)->names('staffpenjualan.pesanan');
    Route::get('/staffpenjualan/invoice/{id}', [PesananController::class, 'invoice'])->name('staffpenjualan.invoice.show');

    Route::get('/staffpenjualan/invoice/{id}/pdf', [PesananController::class, 'invoicePdf'])->name('staffpenjualan.invoice.pdf');
    Route::get('/staffpenjualan/pesanan/{id}/tanda-terima-kosong', [PesananController::class, 'tandaTerimaKosongPdf'])->name('staffpenjualan.tandaTerima.kosong');

    Route::post('/staffpenjualan/pesanan/{id}/konfirmasi', [PesananController::class, 'konfirmasiPembayaran'])->name('staffpenjualan.pesanan.konfirmasi_pembayaran');
    Route::post('/staffpenjualan/pesanan/{id}/ubah-metode', [PesananController::class, 'updateMetodePembayaran'])->name('staffpenjualan.pesanan.update_pembayaran');
    Route::get('/staffpenjualan/pesanan/{id}/detail', [PesananController::class, 'detail_pesanan'])->name('staffpenjualan.pesanan.detail');

    Route::post('/staffpenjualan/pesanan/{id}/kirim', [PesananController::class, 'konfirmasiKirim'])->name('staffpenjualan.pesanan.kirim');

    Route::post('/staffpenjualan/pesanan/{id}/selesai', [PesananController::class, 'tandaiSelesai'])->name('staffpenjualan.pesanan.selesai');


    Route::get('/staffpenjualan/laporan-penjualan', [PesananController::class, 'laporanPenjualan'])->name('staffpenjualan.laporanPenjualan.penjualan');
    Route::get('/staffpenjualan/stok-log', [StokLogController::class, 'getStokLogPenjualan'])->name('staffpenjualan.stok-log.index');

    Route::get('/staffpenjualan/produk', [ProductController::class, 'getProdukPenjualan'])->name('staffpenjualan.produk.index');
});


require __DIR__ . '/auth.php';
