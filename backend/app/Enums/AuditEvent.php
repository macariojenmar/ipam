<?php

namespace App\Enums;

enum AuditEvent: string
{
    // User Management Events
    case USER_CREATED = 'user_created';
    case USER_UPDATED = 'user_updated';
    case USER_DELETED = 'user_deleted';
    case USER_STATUS_CHANGED = 'user_status_changed';
    case USER_ROLE_ASSIGNED = 'user_role_assigned';
    case USER_ROLE_REVOKED = 'user_role_revoked';

        // IP Address Management Events
    case IP_CREATED = 'ip_created';
    case IP_UPDATED = 'ip_updated';
    case IP_DELETED = 'ip_deleted';
    case IP_RESTORED = 'ip_restored';

        // Permission Management Events
    case PERMISSION_CREATED = 'permission_created';
    case PERMISSION_ASSIGNED = 'permission_assigned_to_role';
    case PERMISSION_REVOKED = 'permission_revoked_from_role';

        // Authentication Events
    case LOGIN_SUCCESS = 'login_success';
    case LOGIN_FAILED = 'login_failed';
    case LOGOUT = 'logout';

    public function description(): string
    {
        return match ($this) {
            self::USER_CREATED => 'User account created',
            self::USER_UPDATED => 'User account updated',
            self::USER_DELETED => 'User account deleted',
            self::USER_STATUS_CHANGED => 'User status changed',
            self::USER_ROLE_ASSIGNED => 'Role assigned to user',
            self::USER_ROLE_REVOKED => 'Role revoked from user',

            self::IP_CREATED => 'IP address created',
            self::IP_UPDATED => 'IP address updated',
            self::IP_DELETED => 'IP address deleted',
            self::IP_RESTORED => 'IP address restored',

            self::PERMISSION_CREATED => 'Permission created',
            self::PERMISSION_ASSIGNED => 'Permission assigned to role',
            self::PERMISSION_REVOKED => 'Permission revoked from role',

            self::LOGIN_SUCCESS => 'Successful login',
            self::LOGIN_FAILED => 'Failed login attempt',
            self::LOGOUT => 'User logged out',
        };
    }

    /**
     * Get all event values as an array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Check if the event is restricted to developers only
     */
    public function isRestricted(): bool
    {
        return in_array($this, [
            self::USER_ROLE_ASSIGNED,
            self::USER_ROLE_REVOKED,
            self::PERMISSION_CREATED,
            self::PERMISSION_ASSIGNED,
            self::PERMISSION_REVOKED,
        ]);
    }
}
