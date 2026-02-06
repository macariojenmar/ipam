<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class StoreIpAddressRequest extends ApiFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ip' => [
                'required',
                'string',
                Rule::unique('ip_addresses', 'ip')->whereNull('deleted_at'),
            ],
            'type' => ['required', Rule::in(['IPv4', 'IPv6'])],
            'label' => 'required|string|max:255',
            'comment' => 'nullable|string',
        ];
    }
}
