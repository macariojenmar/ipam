<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IpAddressController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'updatePassword']);
    });
});

Route::middleware('auth:api')->group(function () {

    // Dashboard Stats
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->middleware('permission:' . PermissionEnum::CAN_VIEW_USERS->value);
        Route::post('/create', [UserController::class, 'create'])->middleware('permission:' . PermissionEnum::CAN_VIEW_USERS->value);
        Route::put('/update/{user}', [UserController::class, 'update'])->middleware('permission:' . PermissionEnum::CAN_VIEW_USERS->value);
        Route::patch('/status/{user}', [UserController::class, 'updateStatus'])->middleware('permission:' . PermissionEnum::CAN_APPROVE_USERS->value . '|' . PermissionEnum::CAN_REJECT_USERS->value);
    });

    // IP Management
    Route::prefix('ips')->group(function () {
        Route::get('/', [IpAddressController::class, 'index'])->middleware('permission:' . PermissionEnum::CAN_VIEW_IP_MANAGEMENT->value);
        Route::post('create', [IpAddressController::class, 'create'])->middleware('permission:' . PermissionEnum::CAN_VIEW_IP_MANAGEMENT->value);
        Route::put('update/{id}', [IpAddressController::class, 'update'])->middleware('permission:' . PermissionEnum::CAN_VIEW_IP_MANAGEMENT->value);
        Route::delete('delete/{id}', [IpAddressController::class, 'delete'])->middleware('permission:' . PermissionEnum::CAN_DELETE_IP_ADDRESS->value);
    });

    // Roles and Permissions
    Route::prefix('permissions')->group(function () {
        Route::get('/', [RolePermissionController::class, 'index'])->middleware('permission:' . PermissionEnum::CAN_VIEW_ROLES_AND_PERMISSIONS->value);
        Route::post('/create', [RolePermissionController::class, 'create'])->middleware('permission:' . PermissionEnum::CAN_VIEW_ROLES_AND_PERMISSIONS->value);
        Route::put('/update/{id}', [RolePermissionController::class, 'update'])->middleware('permission:' . PermissionEnum::CAN_VIEW_ROLES_AND_PERMISSIONS->value);
    });

    // Audit Logs
    Route::prefix('audit-logs')->group(function () {
        Route::get('/', [AuditLogController::class, 'index']);
        Route::get('/events', [AuditLogController::class, 'events']);
    })->middleware('permission:' . PermissionEnum::CAN_VIEW_USERS->value);
});

// Public User Registration
Route::post('register', [UserController::class, 'register']);
