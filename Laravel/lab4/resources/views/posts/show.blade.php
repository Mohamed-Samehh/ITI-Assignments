@extends('layouts.blog')

@section('content')
    <h1>{{ $post->title }}</h1>

    <div class="post-info">
        <h2>Post Info</h2>

        {{-- Image (if uploaded) --}}
        @if($post->image)
            <div style="margin-bottom: 1rem;">
                <img src="{{ asset('storage/' . $post->image) }}" alt="Post image" style="max-width: 100%; border-radius: 4px;">
            </div>
        @endif

        <p><strong>Title :-</strong> {{ $post->title }}</p>
        <p><strong>Slug :-</strong> {{ $post->slug }}</p>
        <p><strong>Description :-</strong> {{ $post->description }}</p>

        {{-- Comments section --}}
        <div style="margin-top: 1.5rem;">
            <strong>Comments ({{ $post->comments->count() }}):</strong>

            @forelse($post->comments as $comment)
                <div style="margin-top: 0.5rem; padding: 0.75rem; background:#f9f9f9; border-radius:4px;">
                    <p style="margin:0 0 0.25rem;">{{ $comment->body }}</p>
                    <small style="color:#888;">
                        By <strong>{{ $comment->user->name }}</strong> &middot; {{ $comment->created_at->toDateString() }}
                    </small>
                </div>
            @empty
                <p style="color:#888; margin-top:0.5rem;">No comments yet.</p>
            @endforelse

            {{-- Comment form — only for logged-in users --}}
            @auth
                <form method="POST" action="{{ route('posts.comments.store', $post) }}" style="margin-top: 1rem;">
                    @csrf

                    @error('body')
                        <p style="color:#e74c3c; margin-bottom:0.5rem;">{{ $message }}</p>
                    @enderror

                    <textarea name="body" placeholder="Write a comment..." style="width:100%; padding:0.5rem; border:1px solid #ddd; border-radius:4px; min-height:80px;">{{ old('body') }}</textarea>
                    <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">Post Comment</button>
                </form>
            @else
                <p style="color:#888; margin-top:0.75rem;">
                    <a href="{{ route('login') }}">Login</a> to leave a comment.
                </p>
            @endauth
        </div>
    </div>

    <div class="post-creator">
        <h3>Post Creator Info</h3>
        <p><strong>Name :-</strong> {{ $post->user->name }}</p>
        <p><strong>Email :-</strong> {{ $post->user->email }}</p>
        {{-- formatted_date uses the accessor we defined on Post --}}
        <p><strong>Created At :-</strong> {{ $post->formatted_date }}</p>
    </div>

    <div style="margin-top: 2rem;">
        <a href="/posts" class="btn btn-primary">Back to Posts</a>
        <a href="/posts/{{ $post->id }}/edit" class="btn btn-secondary">Edit</a>
    </div>
@endsection
