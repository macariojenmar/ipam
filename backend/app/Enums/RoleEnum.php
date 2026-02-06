<?php

namespace App\Enums;

enum RoleEnum: string
{
    case DEVELOPER = 'Developer';
    case SUPER_ADMIN = 'Super-Admin';
    case USER = 'User';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
