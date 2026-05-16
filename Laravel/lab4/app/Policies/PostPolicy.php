<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    // Only the post owner can edit or update
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    // Only the post owner can delete
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    // Only the post owner can restore their own trashed post
    public function restore(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
