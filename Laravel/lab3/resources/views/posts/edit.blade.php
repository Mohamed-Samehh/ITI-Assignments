@extends('layouts.app')

@section('content')
    <h1>Edit Post</h1>

    <form method="POST" action="/posts/{{ $post->id }}" class="card-form">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" value="{{ $post->title }}" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required>{{ $post->description }}</textarea>
        </div>

        <div class="form-group">
            <label for="user_id">Post Creator</label>
            <select id="user_id" name="user_id" required>
                @foreach($users as $user)
                    <option value="{{ $user->id }}" @if($post->user_id == $user->id) selected @endif>{{ $user->name }}</option>
                @endforeach
            </select>
        </div>

        <button type="submit" class="btn btn-secondary">Update</button>
    </form>
@endsection
