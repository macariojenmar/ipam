<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\IpAddress;
use App\Enums\UserStatus;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'pending_users' => User::where('status', UserStatus::PENDING)->count(),
            'ip_count' => IpAddress::count(),
            'active_users' => User::where('status', UserStatus::ACTIVE)->count(),
        ]);
    }
}
