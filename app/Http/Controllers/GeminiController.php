<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    // --- HÀM XỬ LÝ CHAT VỚI GEMINI AI ---
    public function chat(Request $request)
    {
        // 1. Valid dữ liệu đầu vào
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = $request->input('message');
        $apiKey = config('services.gemini.key'); // Lấy Key từ config

        if (!$apiKey) {
            return response()->json(['error' => 'Chưa cấu hình Gemini API Key.'], 500);
        }

        // 2. TẠO PROMPT NGẦM (System Context) - "Dạy" AI đóng vai nhân viên
        // Đây là bí quyết để AI trả lời đúng trọng tâm bán sách
        $systemPrompt = "Bạn là một nhân viên tư vấn bán sách ảo thông minh và thân thiện của website 'BookStore'. 
        Nhiệm vụ của bạn là lắng nghe nhu cầu của khách hàng, tư vấn các loại sách (Văn học, Lập trình, Kinh doanh, Kỹ năng sống...) phù hợp nhất. 
        Hãy trả lời bằng Tiếng Việt, ngắn gọn, súc tích, chuyên nghiệp và lịch sự. 
        Khi tư vấn, hãy gợi ý các cuốn sách nổi tiếng thế giới phù hợp với yêu cầu. Không được bịa đặt thông tin sai sự thật về sách. 
        Đây là câu hỏi của khách hàng: ";

        $fullPrompt = $systemPrompt . '"' . $userMessage . '"';

        // 3. Gọi API sang Google Gemini (Model flash cho nhanh)
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

        try {
            // Gửi request POST
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $fullPrompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7, // Độ sáng tạo vừa phải, tránh lan man
                    'topK' => 1,
                    'topP' => 1,
                    'maxOutputTokens' => 800, // Giới hạn độ dài câu trả lời
                ]
            ]);

            // 4. Xử lý kết quả trả về
            if ($response->successful()) {
                $data = $response->json();
                // Móc tách câu trả lời từ cấu trúc JSON phức tạp của Google
                $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Xin lỗi, mình không hiểu ý bạn lắm.';
                
                return response()->json([
                    'reply' => trim($aiResponse)
                ]);
            } else {
                Log::error('Gemini API Error: ' . $response->body());
                return response()->json(['error' => 'Lỗi kết nối với AI. Vui lòng thử lại sau.'], $response->status());
            }

        } catch (\Exception $e) {
            Log::error('Gemini Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi hệ thống.'], 500);
        }
    }
}