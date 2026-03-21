import { ref } from 'vue'

/**
 * SSE 流式通信组合函数
 * 用于 AI 代码生成的流式接口
 */
export function useSSE() {
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    let abortController: AbortController | null = null

    /**
     * 中断当前的 SSE 连接
     */
    function abort() {
        if (abortController) {
            abortController.abort()
            abortController = null
            isLoading.value = false
        }
    }

    /**
     * 连接 SSE 流式接口
     * @param appId 应用 ID
     * @param message 用户消息
     * @param onChunk 每次收到数据块的回调
     * @param onComplete 完成时的回调
     * @param onError 错误时的回调
     */
    async function connect(
        appId: number,
        message: string,
        onChunk: (chunk: string) => void,
        onComplete?: () => void,
        onError?: (err: Error) => void
    ) {
        isLoading.value = true
        error.value = null
        abortController = new AbortController()

        try {
            const response = await fetch(
                `http://localhost:8080/app/chat/gen/code?appId=${appId}&message=${encodeURIComponent(message)}`,
                {
                    method: 'GET',
                    credentials: 'include', // 携带 Cookie
                    signal: abortController.signal,
                    headers: {
                        'Accept': 'text/event-stream'
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('无法获取响应流')
            }

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()

                if (done) {
                    break
                }

                // 解码并追加到缓冲区
                buffer += decoder.decode(value, { stream: true })

                // 按行解析
                const lines = buffer.split('\n')
                // 保留最后一个可能不完整的行
                buffer = lines.pop() || ''

                for (const line of lines) {
                    const trimmedLine = line.trim()

                    // 检测结束标识
                    if (trimmedLine.includes('event: done') || trimmedLine === 'event:done') {
                        isLoading.value = false
                        onComplete?.()
                        return
                    }

                    // 解析数据行
                    if (trimmedLine.startsWith('data:')) {
                        const jsonStr = trimmedLine.substring(5).trim()
                        if (jsonStr) {
                            try {
                                const data = JSON.parse(jsonStr)
                                if (data.d !== undefined) {
                                    onChunk(data.d)
                                }
                            } catch (e) {
                                // JSON 解析失败，可能是不完整的数据，跳过
                                console.warn('SSE 数据解析失败:', jsonStr)
                            }
                        }
                    }
                }
            }

            isLoading.value = false
            onComplete?.()

        } catch (err) {
            // 如果是主动中断，不算错误
            if (err instanceof Error && err.name === 'AbortError') {
                isLoading.value = false
                onComplete?.()
                return
            }
            const errorInstance = err instanceof Error ? err : new Error(String(err))
            error.value = errorInstance
            isLoading.value = false
            onError?.(errorInstance)
        }
    }

    return {
        isLoading,
        error,
        connect,
        abort
    }
}
