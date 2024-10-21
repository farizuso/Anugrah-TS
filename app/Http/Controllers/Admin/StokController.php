<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rekap;
use App\Models\Stok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StokController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $posts = Stok::with('produk')->get();
        return Inertia::render('Admin/Stok/Index', [
            'posts' => $posts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validasi input
            $data = $request->validate([
                'produk_id' => 'required',
                'lokasi_penyimpanan' => 'required',
                'jumlah_stok' => 'required',
                'minimum_stok' => 'required',
            ]);

            
            // Insert ke database
            Stok::create($data);
    
            // Redirect jika sukses
            return redirect()->route('admin.stok.index')->with('success', 'Data Stok berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            // Redirect back with error message
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan data: ' . $e->getMessage());
        }
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request,Stok $stok)
    {
        //
        $data = $request->validate([
            'produk_id' => 'required',
            'lokasi_penyimpanan' => 'required',
            'jumlah_stok' => 'required',
            'minimum_stok' => 'required',
            'tgl_update_stok' => 'required',
        ]);

        $stok->update($data);
        return redirect()->route('admin.stok.index')->with('success', 'Data Stok berhasil diubah');
    }

    /**
     * Update the specified resource in storage.
     */
    public function edit(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $stok = Stok::findOrFail($id);
        $stok->delete();
        return redirect()->route('admin.stok.index')->with('success', 'Data Stok berhasil dihapus');
    }
}
