<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\ApiFormRequest;

class UpdateUserRequest extends ApiFormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    $id = $this->route('user');

    return [
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users,email,' . $id,
      'password' => 'nullable|string|min:8',
      'role' => 'required|string',
      'status' => 'required|string',
    ];
  }
}
