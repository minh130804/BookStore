<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\Request;

class GeminiController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    // --- HÀM XỬ LÝ CHAT VỚI GEMINI AI ---
    public function chat(Request $request)
    {
        // 1. Valid dữ liệu đầu vào
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $result = $this->geminiService->chat($request->input('message'));

        if ($result['success']) {
            return response()->json([
                'reply' => $result['reply']
            ]);
        } else {
            return response()->json(
                ['error' => $result['error']], 
                $result['status'] ?? 500
            );
        }
    }
}