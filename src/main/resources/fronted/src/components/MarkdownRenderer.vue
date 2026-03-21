<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Props {
  content: string
}

const props = defineProps<Props>()

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    // 如果指定了语言且 highlight.js 支持，则高亮
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    // 否则返回普通代码块
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 渲染的 HTML
const renderedHtml = computed(() => {
  if (!props.content) return ''
  return md.render(props.content)
})
</script>

<template>
  <div class="markdown-renderer" v-html="renderedHtml"></div>
</template>

<style scoped lang="less">
.markdown-renderer {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  word-wrap: break-word;

  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin: 16px 0 8px;
    font-weight: 600;
    line-height: 1.4;
  }

  :deep(h1) {
    font-size: 24px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 8px;
  }

  :deep(h2) {
    font-size: 20px;
  }

  :deep(h3) {
    font-size: 18px;
  }

  :deep(p) {
    margin: 8px 0;
  }

  :deep(ul), :deep(ol) {
    margin: 8px 0;
    padding-left: 24px;
  }

  :deep(li) {
    margin: 4px 0;
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding: 8px 16px;
    border-left: 4px solid #722ED1;
    background: #f9f9f9;
    color: #666;
  }

  :deep(code) {
    padding: 2px 6px;
    margin: 0 2px;
    background: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    color: #d63384;
  }

  :deep(pre) {
    margin: 12px 0;
    padding: 0;
    border-radius: 6px;
    overflow-x: auto;

    // 让 highlight.js 的样式生效
    code {
      display: block;
      padding: 16px;
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
    }
  }

  // highlight.js 代码块样式
  :deep(pre.hljs) {
    background: #f6f8fa;
  }

  :deep(code.hljs) {
    padding: 0;
    background: transparent;
    border: none;
    color: inherit;
  }

  :deep(a) {
    color: #722ED1;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(table) {
    margin: 12px 0;
    border-collapse: collapse;
    width: 100%;
  }

  :deep(th), :deep(td) {
    padding: 8px 12px;
    border: 1px solid #e8e8e8;
    text-align: left;
  }

  :deep(th) {
    background: #f5f5f5;
    font-weight: 600;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  :deep(hr) {
    margin: 16px 0;
    border: none;
    border-top: 1px solid #e8e8e8;
  }
}
</style>
