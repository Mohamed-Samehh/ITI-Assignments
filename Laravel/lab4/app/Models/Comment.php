<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['commentable_type', 'commentable_id', 'user_id', 'body'];

    // The user who wrote this comment
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // morphTo: this comment belongs to either a Post or a User
    public function commentable()
    {
        return $this->morphTo();
    }
}
