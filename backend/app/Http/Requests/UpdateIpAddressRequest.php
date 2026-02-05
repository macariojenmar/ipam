<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateIpAddressRequest extends ApiFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('ip_address');

        return [
            'ip' => ['sometimes', 'string', Rule::unique('ip_addresses', 'ip')->ignore($id)],
            'type' => ['sometimes', Rule::in(['IPv4', 'IPv6'])],
            'label' => 'sometimes|string|max:255',
            'comment' => 'nullable|string',
        ];
    }
}
