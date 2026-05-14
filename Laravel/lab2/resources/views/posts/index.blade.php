@extends('layouts.app')

@section('content')
    <h1>ITI Blog - All Posts</h1>

    <div style="margin-bottom: 2rem;">
        <a href="/posts/create" class="btn btn-secondary">Create Post</a>
    </div>

    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Posted By</th>
                <th>Created At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($posts as $post)
                <tr>
                    <td>{{ $post->title }}</td>
                    <td>{{ $post->user->name }}</td>
                    <td>{{ $post->created_at->toDateString() }}</td>
                    <td>
                        <div class="actions">
                            <a href="/posts/{{ $post->id }}" class="btn btn-primary">View</a>
                            <a href="/posts/{{ $post->id }}/edit" class="btn btn-secondary">Edit</a>
                            <form class="inline-form" method="POST" action="/posts/{{ $post->id }}" onsubmit="return confirm('Are you sure you want to delete this post? Click Yes to confirm or No to cancel.');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger">Delete</button>
                            </form>
                        </div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 2rem;">
        {{ $posts->links('pagination::bootstrap-4') }}
    </div>
@endsection
