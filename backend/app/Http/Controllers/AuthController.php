<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::guard('api')->user();

        $statusMessages = [
            UserStatus::PENDING->value  => 'Your account is awaiting approval.',
            UserStatus::REJECTED->value => 'Your account was not approved.',
            UserStatus::ARCHIVED->value => 'This account is no longer active.',
        ];

        if ($user->status !== UserStatus::ACTIVE) {
            Auth::guard('api')->logout();

            return response()->json([
                'error' => $statusMessages[$user->status->value] ?? 'Account access denied.'
            ]);
        }

        return $this->respondWithToken($token);
    }

    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Successfully logged out'])
            ->withCookie(cookie()->forget(config('jwt.cookie_key_name', 'access_token')));
    }

    public function refresh()
    {
        return $this->respondWithToken(Auth::guard('api')->refresh());
    }

    protected function respondWithToken($token)
    {
        $ttl = Auth::guard('api')->factory()->getTTL() * 60;
        $cookieName = config('jwt.cookie_key_name', 'access_token');

        return response()->json([
            'user' => Auth::guard('api')->user(),
            'expires_in' => $ttl
        ])->cookie(
            $cookieName,
            $token,
            $ttl / 60, // minutes
            '/',      // path
            null,     // domain
            false,    // secure (set to true in production)
            true,     // httpOnly
            false,    // raw
            'Lax'     // sameSite
        );
    }
}
