<?php

namespace App\Http\Controllers\Admin;

use App\Models\Produk;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\StoreProdukRequest;
use Inertia\Inertia;
use App\Http\Requests\UpdateProdukRequest;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Produk::with('stok')->get();
        return Inertia::render('Admin/Produk/Index', [
            'posts' => $posts
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'nama_produk' => 'required',
                'simbol' => 'required',
                'kategori' => 'required',
                'harga_jual' => 'required',
            ]);

            Produk::create($data);

            return redirect()->route('admin.produk.index')->with('success', 'Data Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan data: ' . $e->getMessage());
        }
    }




    public function getProdukGudang()
    {
        // Ambil semua data produk beserta relasi stok jika ada
        $posts = Produk::with('stok')->get();

        return Inertia::render('StaffGudang/Produk/Index', [
            'posts' => $posts,
        ]);
    }

    public function getProdukPenjualan()
    {
        // Ambil semua data produk beserta relasi stok jika ada
        $posts = Produk::with('stok')->get();

        return Inertia::render('StaffPenjualan/Produk/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function destroy(Produk $produk)
    {
        $produk->delete();

        return redirect()->route('admin.produk.index')->with('success', 'Data Produk berhasil dihapus');
    }

    public function update(Request $request, Produk $produk)
    {
        $produk->update([
            'nama_produk' => $request->nama_produk,
            'simbol' => $request->simbol,
            'kategori' => $request->kategori,
            'harga_jual' => $request->harga_jual
        ]);
        return redirect()->route('admin.produk.index')->with('success', 'data Produk berhasil diubah');
    }

    public function create()
    {
        $posts = Produk::all();
        return Inertia::render('Admin/Produk/Index', [
            'posts' => $posts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */


    /**
     * Display the specified resource.
     */
    public function show(Produk $produk)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Produk $produk)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */
}
