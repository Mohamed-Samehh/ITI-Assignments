<?php

namespace App\Http\Requests;

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
            'title' => ['required', 'string', 'min:3', 'unique:posts,title'],
            'description' => ['required', 'string', 'min:10'],
        ];
    }
}
