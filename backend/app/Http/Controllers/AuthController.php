<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Auth;
use App\Services\AuditLogger;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(protected AuditLogger $auditLogger) {}
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            // Log failed login attempt
            $user = User::where('email', $credentials['email'])->first();
            if ($user) {
                $this->auditLogger->logLogin($user, false);
            }
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

            // Log failed login due to status
            $this->auditLogger->logLogin($user, false);

            return response()->json([
                'error' => $statusMessages[$user->status->value] ?? 'Account access denied.'
            ]);
        }

        // Log successful login
        $this->auditLogger->logLogin($user, true);

        return $this->respondWithToken($token);
    }

    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    public function logout()
    {
        $user = Auth::guard('api')->user();

        // Log logout
        if ($user) {
            $this->auditLogger->logLogout($user);
        }

        Auth::guard('api')->logout();

        return response()->json(['message' => 'Successfully logged out'])
            ->withCookie(cookie()->forget(config('jwt.cookie_key_name', 'access_token')));
    }

    public function refresh()
    {
        return $this->respondWithToken(Auth::guard('api')->refresh());
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = Auth::guard('api')->user();
        $user->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::guard('api')->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password does not match nuestro record.'
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.'
        ]);
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
