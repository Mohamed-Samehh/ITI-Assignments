<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Http\Requests\PostStoreRequest;
use App\Http\Requests\PostUpdateRequest;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::paginate(10);
        return view('posts.index', ['posts' => $posts]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        return view('posts.create', ['users' => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostStoreRequest $request)
    {
        $data = $request->validated();

        // If an image was uploaded, store it in storage/app/public/posts/
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        Post::create($data);

        return redirect('/posts');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        $users = User::all();
        return view('posts.edit', ['post' => $post, 'users' => $users]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostUpdateRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
            // delete last image
        }

        $post->update($data);

        return redirect('/posts');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();
        return redirect('/posts');
    }

    // Show all soft-deleted posts
    public function trashed()
    {
        $posts = Post::onlyTrashed()->paginate(10);
        return view('posts.trashed', compact('posts'));
    }

    // Restore a soft-deleted post
    public function restore($id)
    {
        $post = Post::onlyTrashed()->findOrFail($id);

        $this->authorize('restore', $post);

        $post->restore();
        return redirect()->route('posts.trashed');
    }
}
