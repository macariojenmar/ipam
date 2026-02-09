<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Auditable;

class IpAddress extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $table = 'ip_addresses';

    protected $fillable = [
        'ip',
        'type',
        'label',
        'comment',
        'user_id',
    ];

    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ip', 'like', "%{$search}%")
                    ->orWhere('label', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    public function scopeFilterByType($query, ?string $type)
    {
        if ($type && $type !== 'all') {
            $query->where('type', $type);
        }

        return $query;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
