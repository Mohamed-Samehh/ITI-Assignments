@extends('layouts.app')

@section('content')
    <h1>{{ $post->title }}</h1>

    <div class="post-info">
        <h2>Post Info</h2>
        <p><strong>Title :-</strong> {{ $post->title }}</p>
        <p><strong>Description :-</strong> {{ $post->description }}</p>
    </div>

    <div class="post-creator">
        <h3>Post Creator Info</h3>
        <p><strong>Name :-</strong> {{ $post->user->name }}</p>
        <p><strong>Email :-</strong> {{ $post->user->email }}</p>
        <p><strong>Created At :-</strong> {{ $post->created_at }}</p>
    </div>

    <div style="margin-top: 2rem;">
        <a href="/posts" class="btn btn-primary">Back to Posts</a>
        <a href="/posts/{{ $post->id }}/edit" class="btn btn-secondary">Edit</a>
    </div>
@endsection
