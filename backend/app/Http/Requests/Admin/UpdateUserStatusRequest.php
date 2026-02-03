<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;
use App\Enums\UserStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateUserStatusRequest extends ApiFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(UserStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Please enter a status.',
            'status.enum' => 'Please enter a valid status.',
        ];
    }
}
