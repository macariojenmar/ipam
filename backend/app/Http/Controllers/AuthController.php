<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @param  LoginRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::guard('api')->user();

        // Check user status
        if ($user->status !== UserStatus::ACTIVE) {
            Auth::guard('api')->logout();
            return response()->json(['error' => 'Account is pending for approval.'], 403);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Successfully logged out'])
            ->withCookie(cookie()->forget(config('jwt.cookie_key_name', 'access_token')));
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(Auth::guard('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
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
