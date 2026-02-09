<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\ApiFormRequest;

class UpdatePasswordRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ];
    }
}
