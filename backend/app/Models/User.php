<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use App\Enums\UserStatus;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Traits\Auditable;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles, Auditable;

    protected $guard_name = 'api';

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $appends = ['all_permissions', 'role_names'];

    public function getAllPermissionsAttribute()
    {
        return $this->getAllPermissions()->pluck('name');
    }

    public function getRoleNamesAttribute()
    {
        return $this->getRoleNames();
    }

    protected $hidden = [
        'password',
        'remember_token',
        'permissions',
        'roles',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
        ];
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    public function scopeFilterByStatus($query, ?string $status)
    {
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        return $query;
    }

    public function scopeFilterByRole($query, ?string $role)
    {
        if ($role && $role !== 'all') {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        return $query;
    }

    public static function register(array $data)
    {
        DB::transaction(function () use ($data, &$user) {
            $user = self::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'status' => UserStatus::PENDING,
            ]);

            $user->assignRole(RoleEnum::USER->value);
        });
    }

    public static function createWithRole(array $data, string $role): self
    {
        return DB::transaction(function () use ($data, $role) {
            $user = self::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'status' => $data['status'],
                'password' => Hash::make($data['password']),
            ]);

            $user->syncRoles([$role]);

            return $user;
        });
    }

    public function updateWithRole(array $data, string $role): bool
    {
        return DB::transaction(function () use ($data, $role) {
            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'status' => $data['status'],
            ];

            if (!empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            $this->update($userData);

            $this->syncRoles([$role]);

            return true;
        });
    }

    public function updateStatus(string $status, ?int $reviewerId = null): bool
    {
        $data = ['status' => $status];

        if ($status === 'approved') {
            $data['status'] = UserStatus::ACTIVE;
        }

        $data['reviewed_by'] = $reviewerId;
        $data['reviewed_at'] = now();

        return $this->update($data);
    }
}
