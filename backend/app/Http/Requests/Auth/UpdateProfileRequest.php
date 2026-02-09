<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProfileRequest extends ApiFormRequest
{
    public function rules(): array
    {
        $userId = Auth::id();

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
        ];
    }
}
