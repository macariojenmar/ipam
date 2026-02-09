<?php

namespace App\Services;

use App\Enums\AuditEvent;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\IpAddress;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuditLogger
{

    public function log(
        AuditEvent $event,
        ?Model $auditable = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): AuditLog {
        $data = [
            'user_id' => Auth::id(),
            'session_id' => session()->getId(),
            'event' => $event,
            'auditable_type' => $auditable ? get_class($auditable) : null,
            'auditable_id' => $auditable?->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description ?? $event->description(),
            'user_ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ];

        return AuditLog::create($data);
    }

    public function logUserCreated(User $user): AuditLog
    {
        return $this->log(
            AuditEvent::USER_CREATED,
            $user,
            null,
            $user->only(['id', 'name', 'email', 'status']),
            "User '{$user->name}' created"
        );
    }

    public function logUserUpdated(User $user, array $oldValues, array $newValues): AuditLog
    {
        $changes = [];
        foreach ($newValues as $key => $value) {
            if (isset($oldValues[$key]) && $oldValues[$key] !== $value) {
                $changes[] = $key;
            }
        }

        $changesStr = implode(', ', $changes);

        return $this->log(
            AuditEvent::USER_UPDATED,
            $user,
            $oldValues,
            $newValues,
            "User '{$user->name}' updated: {$changesStr}"
        );
    }

    public function logUserStatusChanged(User $user, string $oldStatus, string $newStatus): AuditLog
    {
        return $this->log(
            AuditEvent::USER_STATUS_CHANGED,
            $user,
            ['status' => $oldStatus],
            ['status' => $newStatus],
            "User '{$user->name}' status changed from '{$oldStatus}' to '{$newStatus}'"
        );
    }

    public function logUserRoleChanged(User $user, array $oldRoles, array $newRoles): AuditLog
    {
        $oldRoleNames = implode(', ', $oldRoles);
        $newRoleNames = implode(', ', $newRoles);

        return $this->log(
            AuditEvent::USER_ROLE_ASSIGNED,
            $user,
            ['roles' => $oldRoles],
            ['roles' => $newRoles],
            "User '{$user->name}' roles changed from [{$oldRoleNames}] to [{$newRoleNames}]"
        );
    }

    public function logIpCreated(IpAddress $ip): AuditLog
    {
        return $this->log(
            AuditEvent::IP_CREATED,
            $ip,
            null,
            $ip->only(['id', 'ip', 'type', 'label', 'comment']),
            "IP address '{$ip->ip}' ({$ip->label}) created"
        );
    }

    public function logIpUpdated(IpAddress $ip, array $oldValues, array $newValues): AuditLog
    {
        $changes = [];
        foreach ($newValues as $key => $value) {
            if (isset($oldValues[$key]) && $oldValues[$key] !== $value) {
                $changes[] = $key;
            }
        }

        $changesStr = implode(', ', $changes);

        return $this->log(
            AuditEvent::IP_UPDATED,
            $ip,
            $oldValues,
            $newValues,
            "IP address '{$ip->ip}' updated: {$changesStr}"
        );
    }

    public function logIpDeleted(IpAddress $ip): AuditLog
    {
        return $this->log(
            AuditEvent::IP_DELETED,
            $ip,
            $ip->only(['id', 'ip', 'type', 'label', 'comment']),
            null,
            "IP address '{$ip->ip}' ({$ip->label}) deleted"
        );
    }

    public function logIpRestored(IpAddress $ip): AuditLog
    {
        return $this->log(
            AuditEvent::IP_RESTORED,
            $ip,
            null,
            $ip->only(['id', 'ip', 'type', 'label', 'comment']),
            "IP address '{$ip->ip}' ({$ip->label}) restored"
        );
    }

    public function logPermissionCreated(Permission $permission): AuditLog
    {
        return $this->log(
            AuditEvent::PERMISSION_CREATED,
            null,
            null,
            ['id' => $permission->id, 'name' => $permission->name],
            "Permission '{$permission->name}' created"
        );
    }

    public function logPermissionAssigned(Permission $permission, Role $role): AuditLog
    {
        return $this->log(
            AuditEvent::PERMISSION_ASSIGNED,
            null,
            null,
            ['permission' => $permission->name, 'role' => $role->name],
            "Permission '{$permission->name}' assigned to role '{$role->name}'"
        );
    }

    public function logPermissionRevoked(Permission $permission, Role $role): AuditLog
    {
        return $this->log(
            AuditEvent::PERMISSION_REVOKED,
            null,
            ['permission' => $permission->name, 'role' => $role->name],
            null,
            "Permission '{$permission->name}' revoked from role '{$role->name}'"
        );
    }

    public function logLogin(User $user, bool $success): AuditLog
    {
        $event = $success ? AuditEvent::LOGIN_SUCCESS : AuditEvent::LOGIN_FAILED;
        $description = $success
            ? "User '{$user->name}' logged in successfully"
            : "Failed login attempt for '{$user->email}'";

        return $this->log(
            $event,
            $user,
            null,
            null,
            $description
        );
    }

    public function logLogout(User $user): AuditLog
    {
        return $this->log(
            AuditEvent::LOGOUT,
            $user,
            null,
            null,
            "User '{$user->name}' logged out"
        );
    }
}
