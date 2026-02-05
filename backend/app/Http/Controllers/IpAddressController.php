<?php

namespace App\Http\Controllers;

use App\Models\IpAddress;
use App\Http\Requests\StoreIpAddressRequest;
use App\Http\Requests\UpdateIpAddressRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IpAddressController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $filters = $request->only(['search']);

        return response()->json(
            IpAddress::search($filters['search'] ?? null)
                ->latest()
                ->paginate($perPage)
        );
    }

    public function create(StoreIpAddressRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        IpAddress::create($data);

        return response()->json([
            'success' => true,
            'message' => 'IP address created successfully.',
        ]);
    }

    public function update(UpdateIpAddressRequest $request, $id)
    {
        $ip = IpAddress::findOrFail($id);

        $ip->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'IP address updated successfully.'
        ]);
    }

    public function delete($id)
    {
        $ip = IpAddress::findOrFail($id);

        $ip->delete();

        return response()->json([
            'success' => true,
            'message' => 'IP address deleted successfully (soft delete).'
        ]);
    }
}
