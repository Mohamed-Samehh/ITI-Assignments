<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Remove the direct post_id foreign key
            $table->dropForeign(['post_id']);
            $table->dropColumn('post_id');

            // Add polymorphic columns: commentable_type + commentable_id
            $table->string('commentable_type');
            $table->unsignedBigInteger('commentable_id');
            $table->index(['commentable_type', 'commentable_id']);
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropMorphs('commentable');
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
        });
    }
};
