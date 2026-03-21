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
 * 只提取明确标记为 html、css、js 的代码块
 * 支持以下格式：
 * 1. 分离的 ```html、```css、```js 代码块 -> 合并成完整 HTML
 * 2. 单个完整的 ```html 代码块
 * 注意：不会解析未标记语言类型的通用代码块
 */
export function extractHtmlCode(content: string): string {
    if (!content) return ''

    console.log('extractHtmlCode called, content length:', content.length)

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

    console.log('Found code blocks:', blocks.length, blocks.map(b => ({ lang: b.lang, codeLen: b.code.length, codePreview: b.code.substring(0, 50) })))

    // 如果没有找到任何代码块，返回空
    if (blocks.length === 0) {
        return ''
    }

    // 分类提取 html、css、js - 只提取明确标记的代码块
    let htmlCode = ''
    let cssCode = ''
    let jsCode = ''

    for (const block of blocks) {
        console.log('Processing block:', block.lang, 'code length:', block.code.length)
        // 只处理明确标记为 html、css、js 的代码块
        if (block.lang === 'html') {
            htmlCode = block.code
            console.log('Found html block, length:', htmlCode.length)
        } else if (block.lang === 'css') {
            cssCode = block.code
        } else if (block.lang === 'js' || block.lang === 'javascript') {
            jsCode = block.code
        }
        // 不再处理未标记语言类型的通用代码块
    }

    // 只有明确找到页面代码时才构建 HTML
    if (htmlCode || cssCode || jsCode) {
        // 如果只有 css 或 js 没有 html，用空 HTML
        if (!htmlCode) {
            htmlCode = '<body></body>'
        }
        // 检查 HTML 是否已经是完整文档
        if (htmlCode.includes('<html') || htmlCode.includes('<!DOCTYPE')) {
            return injectCodeIntoHtml(htmlCode, cssCode, jsCode)
        } else {
            return buildHtmlDocument(htmlCode, cssCode, jsCode)
        }
    }

    return ''
}
