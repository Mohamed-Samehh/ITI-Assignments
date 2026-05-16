@extends('layouts.blog')

@section('content')
    <h1>Edit Post</h1>

    <form method="POST" action="/posts/{{ $post->id }}" class="card-form" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        @if($errors->any())
            <div class="errors">
                <ul>
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" value="{{ old('title', $post->title) }}">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description">{{ old('description', $post->description) }}</textarea>
        </div>

        <div class="form-group">
            <label for="user_id">Post Creator</label>
            <select id="user_id" name="user_id">
                @foreach($users as $user)
                    <option value="{{ $user->id }}" @if(old('user_id', $post->user_id) == $user->id) selected @endif>{{ $user->name }}</option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="image">Image (optional - leave blank to keep current)</label>
            @if($post->image)
                <div style="margin-bottom: 0.5rem;">
                    <img src="{{ asset('storage/' . $post->image) }}" alt="Current image" style="max-height: 150px;">
                </div>
            @endif
            <input type="file" id="image" name="image" accept="image/*">
        </div>

        <button type="submit" class="btn btn-secondary">Update</button>
    </form>
@endsection
