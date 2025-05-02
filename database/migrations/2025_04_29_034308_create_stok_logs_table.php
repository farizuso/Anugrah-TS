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
        Schema::create('stok_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produk_id')->constrained('produks')->cascadeOnDelete(); // mengacu ke tabel produk
            $table->enum('tipe', ['masuk', 'keluar']); // stok masuk atau keluar
            $table->integer('jumlah'); // jumlah masuk/keluar
            $table->integer('sisa_stok')->nullable();

            $table->text('keterangan')->nullable(); // misal: "Pembelian dari supplier A" atau "Pesanan customer B"
            $table->timestamp('tanggal')->useCurrent(); // kapan stok itu tercatat
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_logs');
    }
};
