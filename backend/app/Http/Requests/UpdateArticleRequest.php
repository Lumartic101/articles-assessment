<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title'   => ['sometimes','required','string','max:255'],
            'content' => ['sometimes','required','string','min:20'],
            'image'   => ['nullable','image','mimes:jpg,jpeg,png,webp','max:2048']
        ];
    }
}
