<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Enums\AuditEvent;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search');
        $event = $request->query('event');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = AuditLog::with('user:id,name')
            ->search($search)
            ->when($event, fn($q) => $q->byEvent($event))
            ->inDateRange($startDate, $endDate);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasRole(RoleEnum::DEVELOPER->value)) {
            $restrictedEvents = collect(AuditEvent::cases())
                ->filter(fn($e) => $e->isRestricted())
                ->map(fn($e) => $e->value)
                ->toArray();

            $query->whereNotIn('event', $restrictedEvents);
        }

        $query->latest();

        return response()->json($query->paginate($perPage));
    }

    public function events()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $isDeveloper = $user->hasRole(RoleEnum::DEVELOPER->value);

        $events = collect(AuditEvent::cases())
            ->filter(fn($event) => $isDeveloper || !$event->isRestricted())
            ->map(function ($event) {
                return [
                    'value' => $event->value,
                    'label' => $event->description(),
                ];
            })
            ->values();

        return response()->json($events);
    }
}
