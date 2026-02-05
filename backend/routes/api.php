<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::prefix('auth')->middleware('api')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});

// Public User Registration
Route::post('register', [UserController::class, 'register']);

// Protected User Management
Route::prefix('users')->middleware('auth:api')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('save', [UserController::class, 'save']);
    Route::patch('{user}/status', [UserController::class, 'updateStatus']);
});
