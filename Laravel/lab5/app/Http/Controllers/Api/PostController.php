<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostStoreRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('user')->paginate(10);

        return PostResource::collection($posts);
    }

    public function show(Post $post)
    {
        $post->load('user');

        return new PostResource($post);
    }

    public function store(PostStoreRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $post = Post::create($data);
        $post->load('user');

        return new PostResource($post);
    }
}
