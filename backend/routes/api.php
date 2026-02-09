<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IpAddressController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth:api')->group(function () {

    // Dashboard Stats
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->middleware('permission:can-view-users');
        Route::post('/create', [UserController::class, 'create'])->middleware('permission:can-view-users');
        Route::put('/update/{user}', [UserController::class, 'update'])->middleware('permission:can-view-users');
        Route::patch('/status/{user}', [UserController::class, 'updateStatus'])->middleware('permission:can-approve-users|can-reject-users');
    });

    // IP Management
    Route::prefix('ips')->group(function () {
        Route::get('/', [IpAddressController::class, 'index'])->middleware('permission:can-view-ip-management');
        Route::post('create', [IpAddressController::class, 'create'])->middleware('permission:can-view-ip-management');
        Route::put('update/{id}', [IpAddressController::class, 'update'])->middleware('permission:can-view-ip-management');
        Route::delete('delete/{id}', [IpAddressController::class, 'delete'])->middleware('permission:can-delete-ip-address');
    });

    // Roles and Permissions
    Route::prefix('permissions')->group(function () {
        Route::get('/', [RolePermissionController::class, 'index'])->middleware('permission:can-view-roles-and-permissions');
        Route::post('/create', [RolePermissionController::class, 'create'])->middleware('permission:can-view-roles-and-permissions');
        Route::put('/update/{id}', [RolePermissionController::class, 'update'])->middleware('permission:can-view-roles-and-permissions');
    });

    // Audit Logs
    Route::prefix('audit-logs')->group(function () {
        Route::get('/', [AuditLogController::class, 'index']);
        Route::get('/events', [AuditLogController::class, 'events']);
    })->middleware('permission:can-view-users');
});

// Public User Registration
Route::post('register', [UserController::class, 'register']);
