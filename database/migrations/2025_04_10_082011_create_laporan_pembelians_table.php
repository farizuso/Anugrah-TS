<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ForeignIdColumnDefinition;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laporan_pembelians', function (Blueprint $table) {
            $table->id();
            $table->date('tgl_pembelian');
            $table->foreignId('supplier_id');
            $table->integer('total')->default(0); // bisa nullable jika awalnya tidak langsung dihitung
            $table->text('keterangan')->nullable();
            $table->string('status')->default('Belum Dikonfirmasi'); // bisa nullable jika awalnya belum dikonfirmasi();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_pembelians');
    }
};