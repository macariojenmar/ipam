<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\IpAddress;
use App\Enums\UserStatus;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function stats()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $pendingQuery = User::where('status', UserStatus::PENDING);
        $activeQuery = User::where('status', UserStatus::ACTIVE);

        if ($user->hasRole(RoleEnum::SUPER_ADMIN->value)) {
            $excludeDevs = function ($query) {
                $query->whereDoesntHave('roles', function ($q) {
                    $q->where('name', RoleEnum::DEVELOPER->value);
                });
            };

            $excludeDevs($pendingQuery);
            $excludeDevs($activeQuery);
        }

        return response()->json([
            'pending_users' => $pendingQuery->count(),
            'ip_count' => IpAddress::count(),
            'active_users' => $activeQuery->count(),
        ]);
    }
}
