@extends('layouts.blog')

@section('content')
    <h1>Create New Post</h1>

    <form method="POST" action="/posts" class="card-form" enctype="multipart/form-data">
        @csrf

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
            <input type="text" id="title" name="title" placeholder="Enter post title" value="{{ old('title') }}" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" placeholder="Enter post description" required>{{ old('description') }}</textarea>
        </div>

        <div class="form-group">
            <label for="user_id">Post Creator</label>
            <select id="user_id" name="user_id" required>
                <option value="">Select a user</option>
                @foreach($users as $user)
                    <option value="{{ $user->id }}" @if(old('user_id') == $user->id) selected @endif>{{ $user->name }}</option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="image">Image (optional)</label>
            <input type="file" id="image" name="image" accept="image/*">
        </div>

        <button type="submit" class="btn btn-secondary">Create</button>
    </form>
@endsection
