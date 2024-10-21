<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('stoks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produk_id')->constrained();  // Foreign key constraint
        $table->string('lokasi_penyimpanan');
        $table->integer('jumlah_stok');
        $table->integer('minimum_stok');
        $table->timestamp('tgl_update_stok')->useCurrent(); // Timestamp field for stock update
        $table->timestamps(); // Default timestamps for created_at and updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stoks');
    }
};
