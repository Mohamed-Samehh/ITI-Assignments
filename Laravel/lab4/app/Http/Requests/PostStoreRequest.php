<?php

namespace App\Http\Requests;

use App\Rules\NoNumbers;
use Illuminate\Foundation\Http\FormRequest;

class PostStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => ['required', 'string', 'min:3', 'unique:posts,title', new NoNumbers],
            'description' => ['required', 'string', 'min:10'],
            'user_id' => ['required', 'exists:users,id'],
            'image' => ['nullable', 'image', 'max:2048'], // optional, max 2MB
        ];
    }
}
