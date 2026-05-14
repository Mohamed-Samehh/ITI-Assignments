@extends('layouts.app')

@section('content')
    <h1>Create New Post</h1>

    <form method="POST" action="/posts" class="card-form">
        @csrf

        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" placeholder="Enter post title" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" placeholder="Enter post description" required></textarea>
        </div>

        <div class="form-group">
            <label for="user_id">Post Creator</label>
            <select id="user_id" name="user_id" required>
                <option value="">Select a user</option>
                @foreach($users as $user)
                    <option value="{{ $user->id }}">{{ $user->name }}</option>
                @endforeach
            </select>
        </div>

        <button type="submit" class="btn btn-secondary">Create</button>
    </form>
@endsection
