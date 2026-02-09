<?php

namespace App\Http\Controllers;

use App\Models\IpAddress;
use App\Http\Requests\StoreIpAddressRequest;
use App\Http\Requests\UpdateIpAddressRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\RoleEnum;
use App\Services\AuditLogger;

class IpAddressController extends Controller
{
    public function __construct(protected AuditLogger $auditLogger) {}
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $filters = $request->only(['search', 'type']);

        return response()->json(
            IpAddress::with('user:id,name')
                ->search($filters['search'] ?? null)
                ->filterByType($filters['type'] ?? null)
                ->latest()
                ->paginate($perPage)
        );
    }

    public function create(StoreIpAddressRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        $ip = IpAddress::create($data);

        // Log IP creation
        $this->auditLogger->logIpCreated($ip);

        return response()->json([
            'success' => true,
            'message' => 'IP address created successfully.',
        ]);
    }

    public function update(UpdateIpAddressRequest $request, $id)
    {
        $ip = IpAddress::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $data = $request->validated();

        $isAdmin = $user->hasRole([RoleEnum::DEVELOPER->value, RoleEnum::SUPER_ADMIN->value]);
        $isOwner = $user->id === $ip->user_id;

        if (!$isAdmin && !$isOwner) {

            $data = $request->only(['label', 'comment']);
        }

        // Capture old values for audit
        $oldValues = $ip->only(array_keys($data));

        $ip->update($data);

        // Capture new values for audit
        $newValues = $ip->fresh()->only(array_keys($data));

        // Log IP update
        $this->auditLogger->logIpUpdated($ip, $oldValues, $newValues);

        return response()->json([
            'success' => true,
            'message' => 'IP address updated successfully.'
        ]);
    }

    public function delete($id)
    {
        $ip = IpAddress::findOrFail($id);

        // Log IP deletion before soft delete
        $this->auditLogger->logIpDeleted($ip);

        $ip->delete();

        return response()->json([
            'success' => true,
            'message' => 'IP address deleted successfully.'
        ]);
    }
}
