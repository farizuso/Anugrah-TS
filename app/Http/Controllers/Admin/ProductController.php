<?php

namespace App\Http\Controllers\Admin;

use App\Models\Produk;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\StoreProdukRequest;
use Inertia\Inertia;
use App\Http\Requests\UpdateProdukRequest;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Inertia::render('Admin/Produk/Index');
        $posts = Produk::all();
        return Inertia::render('Admin/Produk/Index',[
            'posts' => $posts
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'no_botol' => 'required',
            'nama_produk' => 'required',
            'simbol' => 'required',
            'harga' => 'required',
        ]);

        Produk::create($data);

        return redirect()->route('admin.produk.index')->with('success', 'Data Produk berhasil ditambahkan');
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
            'no_botol' => $request->no_botol,
            'nama_produk' => $request->nama_produk,
            'simbol' => $request->simbol,
            'harga' =>$request->harga
        ]);
        return redirect()->route('admin.produk.index')->with('success', 'data Produk berhasil diubah');
    }
    
    public function create()
    {
        $posts = Produk::all();
        return Inertia::render('Admin/Produk/Index',[
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
