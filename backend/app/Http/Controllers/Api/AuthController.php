<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        protected UserRepositoryInterface $userRepo
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password_hash'] = Hash::make($data['password']);
        unset($data['password'], $data['password_confirmation']);

        $data['is_approved'] = $data['role'] === 'farmer' ? false : true;

        $user = $this->userRepo->create($data);

        if ($user->role === 'farmer') {
            $user->farmerProfile()->create([
                'stall_name'     => $request->stall_name,
                'contact_person' => $request->contact_person,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user'    => new UserResource($user),
            'token'   => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->userRepo->findByEmail($request->email);
        $user->load('farmerProfile');   //

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Account is deactivated'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => new UserResource($user),
            'token'   => $token,
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()->load('farmerProfile'))); // ← ADD load

    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
