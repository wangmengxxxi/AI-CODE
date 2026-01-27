/**
 * HTML 代码提取与构建工具
 * 从 AI 回复中提取并合并代码
 */

// 用于避免 Vue 编译器解析的标签常量
const SCRIPT_OPEN = '<' + 'script>'
const SCRIPT_CLOSE = '</' + 'script>'
const STYLE_OPEN = '<' + 'style>'
const STYLE_CLOSE = '</' + 'style>'
const HEAD_CLOSE = '</' + 'head>'
const BODY_OPEN = '<' + 'body'
const BODY_CLOSE = '</' + 'body>'
const HTML_CLOSE = '</' + 'html>'

/**
 * 构建完整的 HTML 文档
 */
function buildHtmlDocument(htmlCode: string, cssCode: string, jsCode: string): string {
    const doctype = '<!DOCTYPE html>'
    const htmlOpen = '<html lang="zh-CN">'
    const headOpen = '<head>'
    const meta1 = '<meta charset="UTF-8">'
    const meta2 = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    const title = '<title>预览</title>'

    const styleBlock = cssCode ? `${STYLE_OPEN}\n${cssCode}\n${STYLE_CLOSE}` : ''
    const scriptBlock = jsCode ? `${SCRIPT_OPEN}\n${jsCode}\n${SCRIPT_CLOSE}` : ''

    return `${doctype}
${htmlOpen}
${headOpen}
  ${meta1}
  ${meta2}
  ${title}
  ${styleBlock}
${HEAD_CLOSE}
${BODY_OPEN}>
  ${htmlCode}
  ${scriptBlock}
${BODY_CLOSE}
${HTML_CLOSE}`
}

/**
 * 向已有的 HTML 注入 CSS 和 JS
 */
function injectCodeIntoHtml(htmlCode: string, cssCode: string, jsCode: string): string {
    let result = htmlCode

    // 注入 CSS
    if (cssCode && !htmlCode.includes(cssCode)) {
        const styleTag = `${STYLE_OPEN}\n${cssCode}\n${STYLE_CLOSE}`
        if (result.includes('</head>')) {
            result = result.replace('</head>', `${styleTag}\n</head>`)
        } else if (result.includes('<body')) {
            result = result.replace('<body', `${styleTag}\n<body`)
        }
    }

    // 注入 JS
    if (jsCode && !htmlCode.includes(jsCode)) {
        const scriptTag = `${SCRIPT_OPEN}\n${jsCode}\n${SCRIPT_CLOSE}`
        if (result.includes('</body>')) {
            result = result.replace('</body>', `${scriptTag}\n</body>`)
        } else {
            result += `\n${scriptTag}`
        }
    }

    return result
}

/**
 * 从 AI 回复中提取并合并代码
 * 支持以下格式：
 * 1. 分离的 ```html、```css、```js 代码块 -> 合并成完整 HTML
 * 2. 单个完整的 ```html 代码块
 * 3. 通用的 ``` 代码块（检测是否为 HTML）
 */
export function extractHtmlCode(content: string): string {
    if (!content) return ''

    // 使用全局匹配提取所有代码块
    const codeBlockRegex = /```(\w*)\s*([\s\S]*?)```/g
    const blocks: { lang: string; code: string }[] = []

    let match
    while ((match = codeBlockRegex.exec(content)) !== null) {
        blocks.push({
            lang: match[1].toLowerCase(),
            code: match[2].trim()
        })
    }

    // 如果没有找到任何代码块，返回空
    if (blocks.length === 0) {
        return ''
    }

    // 分类提取 html、css、js
    let htmlCode = ''
    let cssCode = ''
    let jsCode = ''

    for (const block of blocks) {
        if (block.lang === 'html' || block.lang === '') {
            // 检测内容类型
            const trimmed = block.code.trim()
            if (block.lang === 'html' ||
                trimmed.startsWith('<!DOCTYPE') ||
                trimmed.startsWith('<html') ||
                trimmed.startsWith('<head') ||
                trimmed.startsWith('<body') ||
                trimmed.startsWith('<div') ||
                trimmed.startsWith('<h1') ||
                trimmed.startsWith('<section')) {
                if (!htmlCode) {
                    htmlCode = block.code
                }
            } else if (!block.lang && !htmlCode) {
                // 通用代码块，尝试作为 HTML
                htmlCode = block.code
            }
        } else if (block.lang === 'css') {
            cssCode = block.code
        } else if (block.lang === 'js' || block.lang === 'javascript') {
            jsCode = block.code
        }
    }

    // 如果有任何代码，构建完整 HTML
    if (htmlCode || cssCode || jsCode) {
        // 检查 HTML 是否已经是完整文档
        if (htmlCode.includes('<html') || htmlCode.includes('<!DOCTYPE')) {
            return injectCodeIntoHtml(htmlCode, cssCode, jsCode)
        } else {
            return buildHtmlDocument(htmlCode, cssCode, jsCode)
        }
    }

    return ''
}
