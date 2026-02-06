<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IpAddressController;
use App\Http\Controllers\UserController;
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

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'create']);
        Route::put('{user}', [UserController::class, 'update']);
        Route::patch('{user}/status', [UserController::class, 'updateStatus']);

    });

    // IP Management
    Route::prefix('ips')->group(function () {
        Route::get('/', [IpAddressController::class, 'index']);
        Route::post('create', [IpAddressController::class, 'create']);
        Route::put('update/{id}', [IpAddressController::class, 'update']);
        Route::delete('delete/{id}', [IpAddressController::class, 'delete']);
    });
});

// Public User Registration
Route::post('register', [UserController::class, 'register']);
