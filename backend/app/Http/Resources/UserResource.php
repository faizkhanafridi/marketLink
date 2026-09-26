<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id'        => $this->user_id,
            'username'       => $this->username,
            'email'          => $this->email,
            'contact_number' => $this->contact_number,
            'address'        => $this->address,
            'role'           => $this->role,
            'is_active'      => $this->is_active,
            'is_approved'    => $this->is_approved,
            'created_at'     => $this->created_at,
                    'farmer_profile' => $this->whenLoaded('farmerProfile'), // ← ADD

        ];
    }
}