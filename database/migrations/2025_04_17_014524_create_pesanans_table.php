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
            $table->date('tgl_pesanan');
            $table->foreignId('pelanggan_id');
            $table->integer('total')->default(0); // bisa nullable jika awalnya tidak langsung dihitung
            $table->text('keterangan')->nullable();
            $table->string('status')->default('Belum Dikonfirmasi');
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
