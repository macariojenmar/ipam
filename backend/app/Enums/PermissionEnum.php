<?php

namespace App\Enums;

enum PermissionEnum: string
{
    case CAN_DELETE_IP_ADDRESS = 'can-delete-ip-address';
    case CAN_VIEW_DASHBOARD = 'can-view-dashboard';
    case CAN_APPROVE_USERS = 'can-approve-users';
    case CAN_REJECT_USERS = 'can-reject-users';
    case CAN_UPDATE_USER_STATUS = 'can-update-user-status';
    case CAN_VIEW_USERS = 'can-view-users';
    case CAN_VIEW_IP_MANAGEMENT = 'can-view-ip-management';
    case CAN_VIEW_ROLES_AND_PERMISSIONS = 'can-view-roles-and-permissions';
    case CAN_VIEW_PROFILE = 'can-view-profile';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
