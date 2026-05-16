<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Store a new comment on a post
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'body' => ['required', 'string', 'min:3'],
        ]);

        // morphMany sets commentable_type + commentable_id automatically
        $post->comments()->create([
            'body'    => $request->body,
            'user_id' => auth()->id(),
        ]);

        return back();
    }
}
