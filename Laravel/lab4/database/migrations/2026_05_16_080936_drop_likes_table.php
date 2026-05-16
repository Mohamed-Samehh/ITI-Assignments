<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('likes');
    }

    public function down(): void
    {
        // Recreated by the original create_likes_table migration if needed
    }
};
