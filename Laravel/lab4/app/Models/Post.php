<?php

namespace App\Models;

use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;


class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'description', 'image', 'user_id'];

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

    // Polymorphic: a post can have many comments
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    // --- Accessor + Mutator for title ---
    // get: capitalize each word when reading
    // set: trim extra spaces before saving
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucwords($value),
            set: fn($value) => trim($value),
        );
    }

    // Accessor: formatted date like "May 16, 2026"
    protected function formattedDate(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->created_at?->format('M d, Y'),
        );
    }
}
