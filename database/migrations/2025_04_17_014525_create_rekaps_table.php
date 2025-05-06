<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('rekaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')->constrained()->onDelete('cascade');
            $table->foreignId('pelanggan_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('produk_id')->nullable()->constrained()->onDelete('set null');
            $table->string('nomor_tabung');
            $table->enum('status', ['keluar', 'kembali']);
            $table->dateTime('tanggal_keluar')->nullable();
            $table->dateTime('tanggal_kembali')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekaps');
    }
};
