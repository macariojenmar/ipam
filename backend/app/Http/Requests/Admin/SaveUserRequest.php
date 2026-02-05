<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;

class SaveUserRequest extends ApiFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->input('id');

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => $id ? 'nullable|string|min:8' : 'required|string|min:8',
            'role' => 'required|string',
            'status' => 'required|string',
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email is already taken.',
            'password.required' => 'A password is required for new users.',
            'password.min' => 'Password must be at least 8 characters.',
            'role.required' => 'User role is required.',
            'status.required' => 'User status is required.',
        ];
    }
}
