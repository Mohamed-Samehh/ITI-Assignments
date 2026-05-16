<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Auth-protected routes — trashed must be registered FIRST so "trashed"
// isn't swallowed by the public GET /posts/{post} wildcard registered below
Route::middleware('auth')->group(function () {
    Route::get('/posts/trashed', [PostController::class, 'trashed'])->name('posts.trashed');
    Route::put('/posts/{id}/restore', [PostController::class, 'restore'])->name('posts.restore');
    Route::resource('posts', PostController::class)->except(['index', 'show']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
});

// Public routes — anyone can browse posts
Route::resource('posts', PostController::class)->only(['index', 'show']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
