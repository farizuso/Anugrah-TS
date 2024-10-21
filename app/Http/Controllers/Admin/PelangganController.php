<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Pelanggan::all();
        return Inertia::render('Admin/Pelanggan/Index', [
            'posts' => $posts
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $posts = Pelanggan::all();
        return Inertia::render('Admin/Pelanggan/Index', [
            'posts' => $posts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->validate([
            'nama_pelanggan' => 'required',
            'alamat' => 'required',
            'no_hp' => 'required',
        ]);
        Pelanggan::create($data);
        return redirect()->route('admin.pelanggan.index')->with('success', 'Data Pelanggan berhasil ditambahkan');
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
        ]);

        $pelanggan = Pelanggan::findOrFail($id);

        $pelanggan->update($validated);

        return redirect()->route('admin.pelanggan.index')->with('success', 'Data Pelanggan berhasil diubah');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
{
    $pelanggan = Pelanggan::findOrFail($id);

    $pelanggan->delete();

    return redirect()->route('admin.pelanggan.index')->with('success', 'Data Pelanggan berhasil dihapus');
}
}
