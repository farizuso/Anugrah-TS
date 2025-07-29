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
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_invoice')->unique();
            $table->dateTime('tgl_pesanan');
            $table->foreignId('pelanggan_id');
            $table->integer('total')->default(0); // bisa nullable jika awalnya tidak langsung dihitung
            $table->string('metode_pembayaran')->nullable(); // "tunai", "transfer", "cicilan"
            $table->enum('jenis_pesanan', ['jual', 'sewa', 'campuran'])->default('jual');
            $table->boolean('is_lunas')->default(false);
            $table->string('bukti_transfer')->nullable(); // path/file bukti jika transfer
            $table->integer('jumlah_terbayar')->default(0); // untuk cicilan
            $table->text('keterangan')->nullable();
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};
