<?php

namespace App\Models;

use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;


class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'description', 'user_id'];

    protected static function booted()
    {
        // Register model event listeners when the model boots
        static::created(function ($post) { // after model created
            if (empty($post->slug) && $post->title) {
                $base = Str::slug($post->title); // create URL-friendly base from title
                $post->slug = $base . '-' . $post->id; // append id to guarantee uniqueness
                $post->saveQuietly(); // persist slug without firing other events
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
