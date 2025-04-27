<?php

namespace App\Http\Controllers\StaffPenjualan;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use App\Models\SewaTabung;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SewaTabungController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = SewaTabung::with('pelanggan')->latest()->get();

        return Inertia::render('StaffPenjualan/SewaTabung/Index', [
            'posts' => $posts
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        $pelanggans = Pelanggan::all();
        return Inertia::render('SewaTabung/Create', [
            'pelanggans' => $pelanggans
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pelanggan_id' => 'required|exists:pelanggans,id',
            'jumlah_tabung' => 'required|integer|min:1',
            'tgl_sewa' => 'required|date',
        ]);

        $jumlah = $request->jumlah_tabung;
        $jaminan = 1200000; // per tabung

        SewaTabung::create([
            'pelanggan_id' => $request->pelanggan_id,
            'jumlah_tabung' => $jumlah,
            'total_jaminan' => $jumlah * $jaminan,
            'tgl_sewa' => $request->tgl_sewa,
            'status' => 'Disewa',
        ]);

        return redirect()->route('StaffPenjualan/sewa_tabung.index')->with('success', 'Sewa tabung berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SewaTabung $sewaTabung)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SewaTabung $sewaTabung)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatusKembali($id)
    {
        $sewa = SewaTabung::findOrFail($id);
        $sewa->update([
            'tgl_kembali' => now(),
            'status' => 'Dikembalikan'
        ]);

        return back()->with('success', 'Tabung telah dikembalikan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sewa = SewaTabung::findOrFail($id);
        $sewa->delete();

        return back()->with('success', 'Data sewa tabung dihapus.');
    }
}