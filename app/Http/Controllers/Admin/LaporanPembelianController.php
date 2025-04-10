<?php

namespace App\Http\Controllers\Admin;

use App\Models\LaporanPembelian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class LaporanPembelianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = LaporanPembelian::all();
        return Inertia::render('Admin/LaporanPembelian/Index', [
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LaporanPembelian $laporanPembelian)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LaporanPembelian $laporanPembelian)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LaporanPembelian $laporanPembelian)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LaporanPembelian $laporanPembelian)
    {
        //
    }
}
