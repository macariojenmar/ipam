<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Enums\AuditEvent;
use Illuminate\Support\Carbon;

class AuditLog extends Model
{
    const UPDATED_AT = null; // Audit logs are immutable

    protected $fillable = [
        'user_id',
        'session_id',
        'event',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'description',
        'user_ip',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'event' => AuditEvent::class,
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByEvent($query, AuditEvent|string $event)
    {
        $eventValue = $event instanceof AuditEvent ? $event->value : $event;
        return $query->where('event', $eventValue);
    }

    public function scopeByAuditable($query, string $type, ?int $id = null)
    {
        $query->where('auditable_type', $type);

        if ($id !== null) {
            $query->where('auditable_id', $id);
        }

        return $query;
    }

    public function scopeSearch($query, ?string $search)
    {
        return $query->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($qut) use ($search) {
                        $qut->where('name', 'like', "%{$search}%");
                    });
            });
        });
    }

    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->when($startDate, function ($q) use ($startDate) {
            $q->whereDate('created_at', '>=', Carbon::parse($startDate));
        })->when($endDate, function ($q) use ($endDate) {
            $q->whereDate('created_at', '<=', Carbon::parse($endDate));
        });
    }

    public function getEventDescriptionAttribute(): string
    {
        return $this->event->description();
    }
}
