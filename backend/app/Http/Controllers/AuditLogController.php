<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Enums\AuditEvent;
use Illuminate\Http\Request;

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
            ->inDateRange($startDate, $endDate)
            ->latest();

        return response()->json($query->paginate($perPage));
    }

    public function events()
    {
        $events = collect(AuditEvent::cases())->map(function ($event) {
            return [
                'value' => $event->value,
                'label' => $event->description(),
            ];
        });

        return response()->json($events);
    }
}
