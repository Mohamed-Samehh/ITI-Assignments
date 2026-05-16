@extends('layouts.blog')

@section('content')
    <h1>Trashed Posts</h1>

    <div style="margin-bottom: 2rem;">
        <a href="/posts" class="btn btn-primary">Back to Posts</a>
    </div>

    @if($posts->isEmpty())
        <p>No trashed posts found.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Deleted At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($posts as $post)
                    <tr>
                        <td>{{ $post->title }}</td>
                        <td>{{ $post->deleted_at->toDateString() }}</td>
                        <td>
                            <form class="inline-form" method="POST" action="{{ route('posts.restore', $post->id) }}">
                                @csrf
                                @method('PUT')
                                <button type="submit" class="btn btn-secondary">Restore</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div style="margin-top: 2rem;">
            {{ $posts->links('pagination::bootstrap-4') }}
        </div>
    @endif
@endsection
