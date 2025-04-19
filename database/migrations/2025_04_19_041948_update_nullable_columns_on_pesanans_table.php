<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pesanans', function (Blueprint $table) {
            // Ubah metode_pembayaran jadi nullable
            $table->string('metode_pembayaran')->nullable()->change();

            // (Opsional) keterangan juga bisa nullable
            $table->text('keterangan')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pesanans', function (Blueprint $table) {
            // Balikkan ke tidak nullable (jika perlu rollback)
            $table->string('metode_pembayaran')->nullable(false)->change();
            $table->text('keterangan')->nullable(false)->change();
        });
    }
};