<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $postId = $this->route('post') ? $this->route('post')->id : null;

        return [
            'title' => ['required', 'string', 'min:3', Rule::unique('posts', 'title')->ignore($postId)],
            'description' => ['required', 'string', 'min:10'],
            'user_id' => ['required', 'exists:users,id'],
            'image' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
