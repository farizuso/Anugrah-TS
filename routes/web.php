<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PelangganController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\LaporanPembelianController;
use App\Http\Controllers\Admin\LaporanPenjualanController;
use App\Http\Controllers\Admin\RekapController;
use App\Http\Controllers\Admin\SupplierController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // ✅ Route Umum
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard/Dashboard');
    })->name('dashboard');

    // ✅ Profile (semua role bisa akses profil)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ✅ ADMIN ONLY ROUTES
    Route::middleware('role:Admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('/dashboard', DashboardController::class)->only(['index']);

        // Produk
        Route::get('/produk', [ProductController::class, 'index'])->name('produk.index');
        Route::post('/produk', [ProductController::class, 'store'])->name('produk.store');
        Route::put('/produk/{produk}', [ProductController::class, 'update'])->name('produk.update');
        Route::delete('/produk/{produk}', [ProductController::class, 'destroy'])->name('produk.destroy');

        // Supplier
        Route::get('/supplier', [SupplierController::class, 'index'])->name('supplier.index');
        Route::post('/supplier', [SupplierController::class, 'store'])->name('supplier.store');
        Route::put('/supplier/{id}', [SupplierController::class, 'update'])->name('supplier.update');
        Route::delete('/supplier/{id}', [SupplierController::class, 'destroy'])->name('supplier.destroy');

        // Pelanggan, Rekap, Laporan
        Route::resource('/pelanggan', PelangganController::class)->names('pelanggan');
        Route::resource('/rekap', RekapController::class)->names('rekap');

        Route::get('/laporanpembelian/export', [LaporanPembelianController::class, 'export'])->name('laporanpembelian.export');
        Route::get('/laporanpembelian', [LaporanPembelianController::class, 'index'])->name('laporanpembelian.index');
        Route::post('/laporanpembelian', [LaporanPembelianController::class, 'store'])->name('laporanpembelian.store');
        Route::put('/laporanpembelian/{id}', [LaporanPembelianController::class, 'update'])->name('laporanpembelian.update');
        Route::delete('/laporanpembelian/{id}', [LaporanPembelianController::class, 'destroy'])->name('laporanpembelian.destroy');

        Route::get('/laporanpenjualan', [LaporanPenjualanController::class, 'index'])->name('laporanpenjualan.index');
        // Uncomment kalau nanti butuh update, delete, store
        // Route::post('/laporanpenjualan', [LaporanPenjualanController::class, 'store'])->name('laporanpenjualan.store');
        // Route::put('/laporanpenjualan/{id}', [LaporanPenjualanController::class, 'update'])->name('laporanpenjualan.update');
        // Route::delete('/laporanpenjualan/{id}', [LaporanPenjualanController::class, 'destroy'])->name('laporanpenjualan.destroy');
    });

    // ✅ STAFF GUDANG
    Route::middleware('role:Staff Gudang')->prefix('gudang')->name('gudang.')->group(function () {
        // Tambahkan route khusus staff gudang di sini
        Route::get('/dashboard', fn() => Inertia::render('Gudang/Dashboard'))->name('dashboard');
    });

    // ✅ STAFF PENJUALAN
    Route::middleware('role:Staff Penjualan')->prefix('penjualan')->name('penjualan.')->group(function () {
        // Tambahkan route khusus staff penjualan di sini
        Route::get('/dashboard', fn() => Inertia::render('Penjualan/Dashboard'))->name('dashboard');
    });
});

require __DIR__ . '/auth.php';