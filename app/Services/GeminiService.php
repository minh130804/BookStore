<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    /**
     * Send user message to Google Gemini API along with predefined bookstore chatbot context prompt.
     */
    public function chat(string $userMessage)
    {
        $apiKey = config('services.gemini.key');

        if (!$apiKey) {
            return [
                'success' => false,
                'error' => 'Chưa cấu hình Gemini API Key.',
                'status' => 500
            ];
        }

        $systemPrompt = "Bạn là một nhân viên tư vấn bán sách ảo thông minh và thân thiện của website 'BookStore'. 
        Nhiệm vụ của bạn là lắng nghe nhu cầu của khách hàng, tư vấn các loại sách (Văn học, Lập trình, Kinh doanh, Kỹ năng sống...) phù hợp nhất. 
        Hãy trả lời bằng Tiếng Việt, ngắn gọn, súc tích, chuyên nghiệp và lịch sự. 
        Khi tư vấn, hãy gợi ý các cuốn sách nổi tiếng thế giới phù hợp với yêu cầu. Không được bịa đặt thông tin sai sự thật về sách. 
        Đây là câu hỏi của khách hàng: ";

        $fullPrompt = $systemPrompt . '"' . $userMessage . '"';

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

        try {
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
                    'temperature' => 0.7,
                    'topK' => 1,
                    'topP' => 1,
                    'maxOutputTokens' => 800,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Xin lỗi, mình không hiểu ý bạn lắm.';
                
                return [
                    'success' => true,
                    'reply' => trim($aiResponse)
                ];
            } else {
                Log::error('Gemini API Error: ' . $response->body());
                return [
                    'success' => false,
                    'error' => 'Lỗi kết nối với AI. Vui lòng thử lại sau.',
                    'status' => $response->status()
                ];
            }

        } catch (\Exception $e) {
            Log::error('Gemini Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Đã xảy ra lỗi hệ thống.',
                'status' => 500
            ];
        }
    }
}
