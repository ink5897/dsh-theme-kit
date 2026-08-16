window.__ModuleLoader__.load({
  id: "dsh-theme-kit",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react_jsx_runtime = require("react/jsx-runtime");
    let react = require("react");
    const React = react; // 键盘桌宠用 React.createElement
    // 键盘桌宠样式注入辅助（styles.insert(css) 返回卸载函数）
    const styles = {
      insert(cssText) {
        const el = document.createElement("style");
        el.textContent = cssText;
        document.head.appendChild(el);
        return () => { try { el.remove(); } catch { /* 忽略 */ } };
      },
    };

    let primitives = require("@deepseek-ai/dsh-client-ui-primitives");

    const NS = "settings.appearance";

    function hexToRgb(hex) {
      const n = parseInt(/^#?([0-9a-f]{6})$/i.exec(hex)[1], 16);
      return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
    }
    function rgba(hex, a) {
      return "rgba(" + hexToRgb(hex) + "," + a + ")";
    }
    function mix(a, b, p) {
      return "color-mix(in srgb, " + a + " " + p + "%, " + b + ")";
    }
    // 根据强调色亮度自动决定「字在强调色上」的颜色（浅底用深字，深底用白字）
    function onAccentFor(hex) {
      const n = parseInt(/^#?([0-9a-f]{6})$/i.exec(hex)[1], 16);
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#16181b" : "#ffffff";
    }

    // ── 官方默认色板（design-platform.css），保证可读──────────────────────
    const DARK_BASE = {
      "--dsw-alias-brand-primary": "#f9fafb",
      "--dsw-alias-brand-text": "#f9fafb",
      "--dsw-alias-brand-primary-invert": "#151517",
      "--dsw-alias-brand-primary-new-colorprimary-new-color": "#679efe",
      "--dsw-alias-bg-base": "#151517",
      "--dsw-alias-bg-layer-1": "#232324",
      "--dsw-alias-bg-layer-2": "#2c2c2e",
      "--dsw-alias-bg-layer-3": "#353638",
      "--dsw-alias-bg-module-platform": "#353638",
      "--dsw-alias-bg-multi-select": "#212123",
      "--dsw-alias-bg-overlay": "#61666b",
      "--dsw-alias-bg-skeleton": "rgba(255,255,255,0.08)",
      "--dsw-alias-bg-mask-1": "rgba(0,0,0,0.5)",
      "--dsw-alias-bg-mask-2": "rgba(0,0,0,0.2)",
      "--dsw-alias-bg-mask-3": "rgba(0,0,0,0.48)",
      "--dsw-alias-bg-mask-photo": "rgba(0,0,0,0.88)",
      "--dsw-alias-bg-mask-drop": "rgba(39,39,48,0.7)",
      "--dsw-alias-border-l1": "rgba(255,255,255,0.06)",
      "--dsw-alias-border-l2": "rgba(255,255,255,0.12)",
      "--dsw-alias-border-l3": "rgba(255,255,255,0.16)",
      "--dsw-alias-border-l4": "rgba(255,255,255,0.2)",
      "--dsw-alias-border-inverted": "rgba(255,255,255,0.06)",
      "--dsw-alias-border-inverted2": "rgba(255,255,255,0.08)",
      "--dsw-alias-border-l2-darkmode-thin": "rgba(255,255,255,0.06)",
      "--dsw-alias-button-primary-fill": "#f9fafb",
      "--dsw-alias-button-primary-hover": "#ebeef2",
      "--dsw-alias-button-primary-dimmed": "#43454a",
      "--dsw-alias-button-contrast-fill": "#f9fafb",
      "--dsw-alias-button-elevated-fill": "#43454a",
      "--dsw-alias-button-floating-fill": "#2c2c2e",
      "--dsw-alias-button-floating-hover": "#353638",
      "--dsw-alias-button-ghost-active-border": "#adb2b8",
      "--dsw-alias-button-ghost-active-fill": "#43454a",
      "--dsw-alias-button-ghost-active-hover": "#353638",
      "--dsw-alias-button-info-fill": "#679efe",
      "--dsw-alias-button-info-hover": "#4176e6",
      "--dsw-alias-button-tool-bar-fill": "rgba(84,85,87,0.5)",
      "--dsw-alias-button-tool-bar-fill-invisible": "rgba(31,31,31,0.36)",
      "--dsw-alias-button-tool-bar-hover": "rgba(84,85,87,0.6)",
      "--dsw-alias-interactive-bg-active": "rgba(255,255,255,0.14)",
      "--dsw-alias-interactive-bg-hover-accent": "rgba(255,255,255,0.24)",
      "--dsw-alias-interactive-bg-hover-danger": "rgba(242,90,90,0.15)",
      "--dsw-alias-interactive-bg-hover-solid": "#353638",
      "--dsw-alias-interactive-bg-hover": "rgba(255,255,255,0.08)",
      "--dsw-alias-label-primary": "#f9fafb",
      "--dsw-alias-label-secondary": "#cfd3d6",
      "--dsw-alias-label-tertiary": "#adb2b8",
      "--dsw-alias-label-caption": "#adb2b8",
      "--dsw-alias-label-dimmed": "#cfd3d6",
      "--dsw-alias-label-primary-bluish": "#f9fafb",
      "--dsw-alias-label-primary-dimmed": "#ebeef2",
      "--dsw-alias-label-primary-foreground": "#0f1115",
      "--dsw-alias-label-primary-inverted": "#353638",
      "--dsw-alias-markdown-code-block": "#1b1b1c",
      "--dsw-alias-markdown-code-block-banner": "#2c2c2e",
      "--dsw-alias-markdown-code-segment-selected": "#353638",
      "--dsw-alias-markdown-code-segment-unselected": "#1b1b1c",
      "--dsw-alias-markdown-inline-code": "#2c2c2e",
      "--dsw-alias-markdown-placeholder": "#2c2c2e",
      "--dsw-alias-markdown-tag": "#2c2c2e",
      "--dsw-alias-markdown-citation": "#353638",
      "--dsw-alias-scrollbar-bg-l1": "#3c3c3d",
      "--dsw-alias-scrollbar-bg-l2": "#545557",
      "--dsw-alias-scrollbar-hover-l1": "#545557",
      "--dsw-alias-scrollbar-hover-l2": "#65676b",
      "--dsw-alias-state-business-primary": "#679efe",
      "--dsw-alias-state-business-tertiary": "#34415b",
      "--dsw-alias-state-success-primary": "#22c55e",
      "--dsw-alias-state-success-secondary": "#4fce83",
      "--dsw-alias-state-success-tertiary": "#233c2c",
      "--dsw-alias-state-warn-label": "#d69a3a",
      "--dsw-alias-state-warn-primary": "#f59e0b",
      "--dsw-alias-state-warn-secondary": "#f7ad31",
      "--dsw-alias-state-warn-tertiary": "#3f2f10",
      "--dsw-alias-state-error-primary": "#f25a5a",
      "--dsw-alias-state-error-secondary": "#f25a5a",
      "--dsw-alias-toast-bg": "#43454a",
      "--dsw-alias-tooltip-bg": "#43454a",
      "--dsw-specific-bubble": "#2c2c2e",
      "--dsw-specific-bubble-highlight": "#43454a",
      "--dsw-specific-input-major": "#2c2c2e",
      "--dsw-specific-login-input": "#1b1b1c",
      "--dsw-specific-menu": "#353638",
      "--dsw-specific-selector": "#353638",
      "--dsw-specific-sidebar-fill": "#1b1b1c",
      "--dsw-specific-sidebar-nav-item-active": "#43454a",
      "--dsw-specific-sidebar-nav-item-active-accent": "#353638",
      "--dsw-specific-sidebar-nav-item-hover": "#2c2c2e",
      "--dsw-specific-tip": "#353638",
    };

    const LIGHT_BASE = {
      "--dsw-alias-brand-primary": "#0f1115",
      "--dsw-alias-brand-text": "#0f1115",
      "--dsw-alias-brand-primary-invert": "#f9fafb",
      "--dsw-alias-brand-primary-new-colorprimary-new-color": "#4176e6",
      "--dsw-alias-bg-base": "#ffffff",
      "--dsw-alias-bg-layer-1": "#ffffff",
      "--dsw-alias-bg-layer-2": "#ffffff",
      "--dsw-alias-bg-layer-3": "#ffffff",
      "--dsw-alias-bg-module-platform": "#f9fafb",
      "--dsw-alias-bg-multi-select": "#f9fafb",
      "--dsw-alias-bg-overlay": "#e9ecf2",
      "--dsw-alias-bg-skeleton": "rgba(0,0,0,0.04)",
      "--dsw-alias-bg-mask-1": "rgba(0,0,0,0.24)",
      "--dsw-alias-bg-mask-2": "rgba(0,0,0,0.12)",
      "--dsw-alias-bg-mask-3": "rgba(0,0,0,0.48)",
      "--dsw-alias-bg-mask-photo": "rgba(0,0,0,0.88)",
      "--dsw-alias-bg-mask-drop": "rgba(255,255,255,0.7)",
      "--dsw-alias-border-l1": "rgba(0,0,0,0.04)",
      "--dsw-alias-border-l2": "rgba(0,0,0,0.1)",
      "--dsw-alias-border-l3": "rgba(0,0,0,0.12)",
      "--dsw-alias-border-l4": "rgba(0,0,0,0.16)",
      "--dsw-alias-border-inverted": "rgba(0,0,0,0)",
      "--dsw-alias-border-inverted2": "rgba(0,0,0,0)",
      "--dsw-alias-border-l2-darkmode-thin": "rgba(0,0,0,0.1)",
      "--dsw-alias-button-primary-fill": "#0f1115",
      "--dsw-alias-button-primary-hover": "#43454a",
      "--dsw-alias-button-primary-dimmed": "#ebeef2",
      "--dsw-alias-button-contrast-fill": "#43454a",
      "--dsw-alias-button-elevated-fill": "#ffffff",
      "--dsw-alias-button-floating-fill": "#ffffff",
      "--dsw-alias-button-floating-hover": "#f1f3f5",
      "--dsw-alias-button-ghost-active-border": "#81858c",
      "--dsw-alias-button-ghost-active-fill": "#ebeef2",
      "--dsw-alias-button-ghost-active-hover": "#e9ecf2",
      "--dsw-alias-button-info-fill": "#4176e6",
      "--dsw-alias-button-info-hover": "#679efe",
      "--dsw-alias-button-tool-bar-fill": "rgba(84,85,87,0.5)",
      "--dsw-alias-button-tool-bar-fill-invisible": "rgba(31,31,31,0.36)",
      "--dsw-alias-button-tool-bar-hover": "rgba(84,85,87,0.6)",
      "--dsw-alias-interactive-bg-active": "rgba(38,49,72,0.1)",
      "--dsw-alias-interactive-bg-hover-accent": "rgba(38,49,72,0.14)",
      "--dsw-alias-interactive-bg-hover-danger": "rgba(236,19,19,0.05)",
      "--dsw-alias-interactive-bg-hover-solid": "#f1f3f5",
      "--dsw-alias-interactive-bg-hover": "rgba(38,49,72,0.06)",
      "--dsw-alias-label-primary": "#0f1115",
      "--dsw-alias-label-secondary": "#61666b",
      "--dsw-alias-label-tertiary": "#81858c",
      "--dsw-alias-label-caption": "#81858c",
      "--dsw-alias-label-dimmed": "#e5e5e5",
      "--dsw-alias-label-primary-bluish": "#0e3074",
      "--dsw-alias-label-primary-dimmed": "#151517",
      "--dsw-alias-label-primary-foreground": "#ffffff",
      "--dsw-alias-label-primary-inverted": "#ffffff",
      "--dsw-alias-markdown-code-block": "#f9fafb",
      "--dsw-alias-markdown-code-block-banner": "#f9fafb",
      "--dsw-alias-markdown-code-segment-selected": "#ffffff",
      "--dsw-alias-markdown-code-segment-unselected": "#f1f3f5",
      "--dsw-alias-markdown-inline-code": "#ebeef2",
      "--dsw-alias-markdown-placeholder": "#f9fafb",
      "--dsw-alias-markdown-tag": "#f1f3f5",
      "--dsw-alias-markdown-citation": "#ebeef2",
      "--dsw-alias-scrollbar-bg-l1": "#e5e5e5",
      "--dsw-alias-scrollbar-bg-l2": "#e5e5e5",
      "--dsw-alias-scrollbar-hover-l1": "#d4d4d4",
      "--dsw-alias-scrollbar-hover-l2": "#d4d4d4",
      "--dsw-alias-state-business-primary": "#4176e6",
      "--dsw-alias-state-business-tertiary": "#e4edfd",
      "--dsw-alias-state-success-primary": "#22c55e",
      "--dsw-alias-state-success-secondary": "#4fce83",
      "--dsw-alias-state-success-tertiary": "#e6fae6",
      "--dsw-alias-state-warn-label": "#dd8629",
      "--dsw-alias-state-warn-primary": "#f59e0b",
      "--dsw-alias-state-warn-secondary": "#f7ad31",
      "--dsw-alias-state-warn-tertiary": "#fef5e7",
      "--dsw-alias-state-error-primary": "#ec1313",
      "--dsw-alias-state-error-secondary": "#f25a5a",
      "--dsw-alias-toast-bg": "#353638",
      "--dsw-alias-tooltip-bg": "#2c2c2e",
      "--dsw-specific-bubble": "#edf3fe",
      "--dsw-specific-bubble-highlight": "#d3e2ff",
      "--dsw-specific-input-major": "#ffffff",
      "--dsw-specific-login-input": "#f9fafb",
      "--dsw-specific-menu": "#ffffff",
      "--dsw-specific-selector": "#f9fafb",
      "--dsw-specific-sidebar-fill": "#f9fafb",
      "--dsw-specific-sidebar-nav-item-active": "#ebeef2",
      "--dsw-specific-sidebar-nav-item-active-accent": "#e4edfd",
      "--dsw-specific-sidebar-nav-item-hover": "#f1f3f5",
      "--dsw-specific-tip": "#f9fafb",
    };

    // 主题模板：官方基+ 用强调色做「色相偏移」，让界侧边各层/文字
    // 都吃进强调色，同时保持官方明度（可读）。每个预设只给一accent
    // 预设可另custom 覆盖表，最后合并（如整版自定义配色的莫兰迪）
    function buildPreset(mode, a) {
      const base = mode === "dark" ? DARK_BASE : LIGHT_BASE;
      const onAccent = onAccentFor(a.accent);
      const tint = (key, keep) => mix(base[key], a.accent, keep);
      const overrides = {
        // 强调主色
        "--dsw-alias-state-business-primary": a.accent,
        "--dsw-alias-label-primary-foreground": onAccent,
        "--dsw-alias-button-primary-fill": a.accent,
        "--dsw-alias-button-primary-hover": a.accentStrong,
        "--dsw-alias-button-info-fill": a.accent,
        "--dsw-alias-button-info-hover": a.accentStrong,
        // 背景 / 侧边/ 各层表面（色相偏移）
        "--dsw-alias-bg-base": tint("--dsw-alias-bg-base", 90),
        "--dsw-alias-bg-layer-1": tint("--dsw-alias-bg-layer-1", 88),
        "--dsw-alias-bg-layer-2": tint("--dsw-alias-bg-layer-2", 86),
        "--dsw-alias-bg-layer-3": tint("--dsw-alias-bg-layer-3", 84),
        "--dsw-alias-bg-module-platform": tint("--dsw-alias-bg-module-platform", 86),
        "--dsw-alias-bg-overlay": tint("--dsw-alias-bg-overlay", 82),
        "--dsw-specific-sidebar-fill": tint("--dsw-specific-sidebar-fill", 86),
        // 按钮家族（新会话 / 悬浮 / 幽灵 / 对比也吃强调色）
        "--dsw-alias-button-elevated-fill": tint("--dsw-alias-button-elevated-fill", 84),
        "--dsw-alias-button-floating-fill": tint("--dsw-alias-button-floating-fill", 88),
        "--dsw-alias-button-floating-hover": tint("--dsw-alias-button-floating-hover", 84),
        "--dsw-alias-button-contrast-fill": tint("--dsw-alias-button-contrast-fill", 88),
        "--dsw-alias-button-ghost-active-fill": tint("--dsw-alias-button-ghost-active-fill", 84),
        "--dsw-alias-button-ghost-active-hover": tint("--dsw-alias-button-ghost-active-hover", 84),
        "--dsw-alias-button-ghost-active-border": tint("--dsw-alias-button-ghost-active-border", 84),
        // 文字（轻微色相偏移，保持高对比；灰色说明字向主文字靠拢，看得更“重”）
        "--dsw-alias-label-primary": tint("--dsw-alias-label-primary", 95),
        "--dsw-alias-label-secondary": tint("--dsw-alias-label-secondary", 91),
        "--dsw-alias-label-tertiary": mix(mix(base["--dsw-alias-label-tertiary"], base["--dsw-alias-label-primary"], 70), a.accent, 92),
        "--dsw-alias-label-caption": mix(mix(base["--dsw-alias-label-caption"], base["--dsw-alias-label-primary"], 70), a.accent, 92),
        "--dsw-alias-brand-primary": tint("--dsw-alias-brand-primary", 95),
        "--dsw-alias-brand-text": tint("--dsw-alias-brand-text", 95),
        // 气泡 / 输入/ 菜单 / 代码块表
        "--dsw-specific-bubble": tint("--dsw-specific-bubble", 84),
        "--dsw-specific-input-major": tint("--dsw-specific-input-major", 90),
        "--dsw-specific-menu": tint("--dsw-specific-menu", 86),
        "--dsw-specific-selector": tint("--dsw-specific-selector", 86),
        "--dsw-specific-tip": tint("--dsw-specific-tip", 86),
        "--dsw-alias-markdown-code-block": tint("--dsw-alias-markdown-code-block", 88),
        "--dsw-alias-markdown-inline-code": tint("--dsw-alias-markdown-inline-code", 86),
        // 边框与滚动条（轻微强调色偏移，让“整界可见部分”都吃主题）
        "--dsw-alias-border-l1": tint("--dsw-alias-border-l1", 95),
        "--dsw-alias-border-l2": tint("--dsw-alias-border-l2", 93),
        "--dsw-alias-border-l3": tint("--dsw-alias-border-l3", 91),
        "--dsw-alias-border-l4": tint("--dsw-alias-border-l4", 89),
        "--dsw-alias-scrollbar-bg-l1": tint("--dsw-alias-scrollbar-bg-l1", 86),
        "--dsw-alias-scrollbar-bg-l2": tint("--dsw-alias-scrollbar-bg-l2", 86),
        "--dsw-alias-scrollbar-hover-l1": tint("--dsw-alias-scrollbar-hover-l1", 80),
        "--dsw-alias-scrollbar-hover-l2": tint("--dsw-alias-scrollbar-hover-l2", 80),
        // 浅色强调（激活/ 选中 / 高亮
        "--dsw-alias-state-business-tertiary": a.accentSoft,
        "--dsw-alias-button-primary-dimmed": a.accentSoft,
        "--dsw-alias-bg-multi-select": a.accentSoft,
        "--dsw-specific-sidebar-nav-item-active-accent": a.accentSoft,
        "--dsw-specific-sidebar-nav-item-active": a.accentSoft,
        "--dsw-specific-sidebar-nav-item-hover": tint("--dsw-specific-sidebar-nav-item-hover", 88),
        "--dsw-specific-bubble-highlight": a.accentSoft,
        // 交互/ 工具栏（触摸/悬停选项也吃强调色）
        "--dsw-alias-interactive-bg-hover-accent": rgba(a.accent, 0.3),
        "--dsw-alias-interactive-bg-active": rgba(a.accent, 0.22),
        "--dsw-alias-interactive-bg-hover": rgba(a.accent, 0.16),
        "--dsw-alias-interactive-bg-hover-solid": tint("--dsw-alias-interactive-bg-hover-solid", 78),
        "--dsw-alias-button-tool-bar-fill": rgba(a.accent, 0.42),
        "--dsw-alias-button-tool-bar-hover": rgba(a.accent, 0.58),
        "--dsw-alias-button-tool-bar-fill-invisible": rgba(a.accent, 0.3),
      };
      return { ...base, ...overrides, ...(a.custom || {}) };
    }

    const PRESET_GROUPS = [
      {
        id: "morandi", nameKey: "groupMorandi",
        themes: [
          {
            id: "morandi", nameKey: "presetMori", mode: "light",
            accent: "#8A4632", accentStrong: "#733A29", accentSoft: "#E7D4CB",
            // 撞色莫兰v3：暖沙背#F1E8D9 蓝灰栏框 #9DB0BE，图标志用深陶土 #8A4632
            // 按钮/文字用深灰绿 #3F443F 做锚点色—四色撞色
            custom: {
              "--dsw-alias-bg-base": "#F1E8D9",
              "--dsw-alias-bg-layer-1": "#A6B8C5",
              "--dsw-alias-bg-layer-2": "#9DB0BE",
              "--dsw-alias-bg-layer-3": "#93A6B4",
              "--dsw-alias-bg-module-platform": "#A6B8C5",
              "--dsw-alias-bg-overlay": "#B8C7D2",
              "--dsw-specific-sidebar-fill": "#9DB0BE",
              "--dsw-alias-label-primary": "#3F443F",
              "--dsw-alias-label-secondary": "#5F665F",
              "--dsw-alias-label-tertiary": "#7A8178",
              "--dsw-alias-label-caption": "#7A8178",
              "--dsw-alias-button-primary-fill": "#3F443F",
              "--dsw-alias-button-primary-hover": "#343834",
              "--dsw-alias-button-elevated-fill": "#9DB0BE",
              "--dsw-alias-button-floating-hover": "#8FA2B0",
              "--dsw-alias-label-primary-foreground": "#F1E8D9",
              "--dsw-specific-input-major": "#F6EFE2",
              "--dsw-specific-menu": "#E7D4CB",
              "--dsw-specific-selector": "#A6B8C5",
              "--dsw-specific-tip": "#A6B8C5",
              "--dsw-specific-bubble": "#9DB0BE",
              "--dsw-specific-sidebar-nav-item-active": "#E7D4CB",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(231,212,203,0.4)",
              "--dsw-alias-markdown-code-block": "#A6B8C5",
              "--dsw-alias-markdown-inline-code": "#B8C7D2",
            },
          },
          {
            id: "soycake", nameKey: "presetSoyCake", mode: "light",
            accent: "#7F7B7F", accentStrong: "#676367", accentSoft: "#DCD9DC",
            custom: {
              "--dsw-alias-bg-base": "#F6EDDD",
              "--dsw-alias-bg-layer-1": "#D9DDE3",
              "--dsw-alias-bg-layer-2": "#C7CED6",
              "--dsw-alias-bg-layer-3": "#B3BCC6",
              "--dsw-alias-bg-module-platform": "#D9DDE3",
              "--dsw-alias-bg-overlay": "#F0EAE0",
              "--dsw-specific-sidebar-fill": "#C7CED6",
              "--dsw-alias-label-primary": "#4E4A4E",
              "--dsw-alias-label-secondary": "#6B676B",
              "--dsw-alias-label-tertiary": "#898589",
              "--dsw-alias-label-caption": "#898589",
              "--dsw-alias-button-primary-fill": "#4E4A4E",
              "--dsw-alias-button-primary-hover": "#413D41",
              "--dsw-alias-button-elevated-fill": "#C7CED6",
              "--dsw-alias-button-floating-hover": "#B3BCC6",
              "--dsw-alias-label-primary-foreground": "#F6EDDD",
              "--dsw-specific-input-major": "#FBF7EF",
              "--dsw-specific-menu": "#E3E7ED",
              "--dsw-specific-selector": "#D7DBE1",
              "--dsw-specific-tip": "#E9ECF0",
              "--dsw-specific-bubble": "#DBD9D9",
              "--dsw-specific-sidebar-nav-item-active": "#B3BCC6",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(199,206,214,0.45)",
              "--dsw-alias-markdown-code-block": "#E0E4E9",
              "--dsw-alias-markdown-inline-code": "#EBEDF1",
            },
          },
          {
            id: "lilac", nameKey: "presetLilac", mode: "light",
            accent: "#7A4E2A", accentStrong: "#6B4526", accentSoft: "#E6D3B4",
            custom: {
              "--dsw-alias-bg-base": "#E9E2B6",
              "--dsw-alias-bg-layer-1": "#C09F74",
              "--dsw-alias-bg-layer-2": "#B08B5C",
              "--dsw-alias-bg-layer-3": "#A37E52",
              "--dsw-alias-bg-module-platform": "#C09F74",
              "--dsw-alias-bg-overlay": "#CDB389",
              "--dsw-specific-sidebar-fill": "#B08B5C",
              "--dsw-alias-label-primary": "#4A4A4C",
              "--dsw-alias-label-secondary": "#5E5E60",
              "--dsw-alias-label-tertiary": "#7C7C7E",
              "--dsw-alias-label-caption": "#7C7C7E",
              "--dsw-alias-button-primary-fill": "#4A4A4C",
              "--dsw-alias-button-primary-hover": "#3F3F41",
              "--dsw-alias-button-elevated-fill": "#B08B5C",
              "--dsw-alias-button-floating-hover": "#A37E52",
              "--dsw-alias-label-primary-foreground": "#E9E2B6",
              "--dsw-specific-input-major": "#F2EDD0",
              "--dsw-specific-menu": "#E6D3B4",
              "--dsw-specific-selector": "#C09F74",
              "--dsw-specific-tip": "#C09F74",
              "--dsw-specific-bubble": "#B08B5C",
              "--dsw-specific-sidebar-nav-item-active": "#E6D3B4",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(230,211,180,0.4)",
              "--dsw-alias-markdown-code-block": "#C09F74",
              "--dsw-alias-markdown-inline-code": "#CDB389",
            },
          },
          {
            id: "clay", nameKey: "presetClay", mode: "light",
            accent: "#2F4F42", accentStrong: "#28423A", accentSoft: "#D5E5E0",
            custom: {
              "--dsw-alias-bg-base": "#EAE3D2",
              "--dsw-alias-bg-layer-1": "#B5CBD5",
              "--dsw-alias-bg-layer-2": "#A8C0CC",
              "--dsw-alias-bg-layer-3": "#99B3C0",
              "--dsw-alias-bg-module-platform": "#B5CBD5",
              "--dsw-alias-bg-overlay": "#C6D7DE",
              "--dsw-specific-sidebar-fill": "#A8C0CC",
              "--dsw-alias-label-primary": "#33403A",
              "--dsw-alias-label-secondary": "#55625C",
              "--dsw-alias-label-tertiary": "#77847D",
              "--dsw-alias-label-caption": "#77847D",
              "--dsw-alias-button-primary-fill": "#33403A",
              "--dsw-alias-button-primary-hover": "#2A352F",
              "--dsw-alias-button-elevated-fill": "#A8C0CC",
              "--dsw-alias-button-floating-hover": "#99B3C0",
              "--dsw-alias-label-primary-foreground": "#EAE3D2",
              "--dsw-specific-input-major": "#F1EBDB",
              "--dsw-specific-menu": "#D5E5E0",
              "--dsw-specific-selector": "#B5CBD5",
              "--dsw-specific-tip": "#B5CBD5",
              "--dsw-specific-bubble": "#A8C0CC",
              "--dsw-specific-sidebar-nav-item-active": "#D5E5E0",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(213,229,224,0.4)",
              "--dsw-alias-markdown-code-block": "#B5CBD5",
              "--dsw-alias-markdown-inline-code": "#C6D7DE",
            },
          },
          {
            id: "teal", nameKey: "presetTeal", mode: "light",
            accent: "#566F44", accentStrong: "#475C37", accentSoft: "#D9E2C8",
            custom: {
              "--dsw-alias-bg-base": "#EFE8D8",
              "--dsw-alias-bg-layer-1": "#B6AEBE",
              "--dsw-alias-bg-layer-2": "#A79FAE",
              "--dsw-alias-bg-layer-3": "#99909F",
              "--dsw-alias-bg-module-platform": "#B6AEBE",
              "--dsw-alias-bg-overlay": "#C7C0CE",
              "--dsw-specific-sidebar-fill": "#A79FAE",
              "--dsw-alias-label-primary": "#4A444E",
              "--dsw-alias-label-secondary": "#635D67",
              "--dsw-alias-label-tertiary": "#7E7882",
              "--dsw-alias-label-caption": "#7E7882",
              "--dsw-alias-button-primary-fill": "#4A444E",
              "--dsw-alias-button-primary-hover": "#403B44",
              "--dsw-alias-button-elevated-fill": "#A79FAE",
              "--dsw-alias-button-floating-hover": "#99909F",
              "--dsw-alias-label-primary-foreground": "#EFE8D8",
              "--dsw-specific-input-major": "#F4EEE0",
              "--dsw-specific-menu": "#D9E2C8",
              "--dsw-specific-selector": "#B6AEBE",
              "--dsw-specific-tip": "#B6AEBE",
              "--dsw-specific-bubble": "#A79FAE",
              "--dsw-specific-sidebar-nav-item-active": "#D9E2C8",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(217,226,200,0.4)",
              "--dsw-alias-markdown-code-block": "#B6AEBE",
              "--dsw-alias-markdown-inline-code": "#C7C0CE",
            },
          },
          {
            id: "berrybreeze", nameKey: "presetBerryBreeze", mode: "light",
            accent: "#775C56", accentStrong: "#5F4842", accentSoft: "#E8D8D4",
            custom: {
              "--dsw-alias-bg-base": "#F8F4E8",
              "--dsw-alias-bg-layer-1": "#E3F0EA",
              "--dsw-alias-bg-layer-2": "#FFD3D4",
              "--dsw-alias-bg-layer-3": "#EAB5B7",
              "--dsw-alias-bg-module-platform": "#E3F0EA",
              "--dsw-alias-bg-overlay": "#FBF0E6",
              "--dsw-specific-sidebar-fill": "#FFD3D4",
              "--dsw-alias-label-primary": "#5B4540",
              "--dsw-alias-label-secondary": "#78625D",
              "--dsw-alias-label-tertiary": "#96827D",
              "--dsw-alias-label-caption": "#96827D",
              "--dsw-alias-button-primary-fill": "#775C56",
              "--dsw-alias-button-primary-hover": "#634B46",
              "--dsw-alias-button-elevated-fill": "#FFD3D4",
              "--dsw-alias-button-floating-hover": "#EAB5B7",
              "--dsw-alias-label-primary-foreground": "#F8F4E8",
              "--dsw-specific-input-major": "#FCFAF3",
              "--dsw-specific-menu": "#DFF2ED",
              "--dsw-specific-selector": "#C6E6DC",
              "--dsw-specific-tip": "#E4F4EF",
              "--dsw-specific-bubble": "#D5EBE4",
              "--dsw-specific-sidebar-nav-item-active": "#EAB5B7",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,211,212,0.4)",
              "--dsw-alias-markdown-code-block": "#E1F2EC",
              "--dsw-alias-markdown-inline-code": "#EBF6F2",
            },
          },
          {
            id: "hermes", nameKey: "presetHermes", mode: "light",
            accent: "#6A4D52", accentStrong: "#5A3F44", accentSoft: "#E7D8D3",
            custom: {
              "--dsw-alias-bg-base": "#F2EDE6",
              "--dsw-alias-bg-layer-1": "#F5EFE6",
              "--dsw-alias-bg-layer-2": "#D96A3B",
              "--dsw-alias-bg-layer-3": "#C95F2F",
              "--dsw-alias-bg-module-platform": "#F5EFE6",
              "--dsw-alias-bg-overlay": "#F2D9C6",
              "--dsw-specific-sidebar-fill": "#D96A3B",
              "--dsw-alias-label-primary": "#6A4D52",
              "--dsw-alias-label-secondary": "#634D51",
              "--dsw-alias-label-tertiary": "#6E5A5E",
              "--dsw-alias-label-caption": "#6E5A5E",
              "--dsw-alias-button-primary-fill": "#6A4D52",
              "--dsw-alias-button-primary-hover": "#5A3F44",
              "--dsw-alias-button-elevated-fill": "#D96A3B",
              "--dsw-alias-button-floating-hover": "#C95F2F",
              "--dsw-alias-label-primary-foreground": "#F2EDE6",
              "--dsw-specific-input-major": "#F7F3EC",
              "--dsw-specific-menu": "#F2D2B8",
              "--dsw-specific-selector": "#F5EFE6",
              "--dsw-specific-tip": "#F5EFE6",
              "--dsw-specific-bubble": "#F2D2B8",
              "--dsw-specific-sidebar-nav-item-active": "#C95F2F",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.18)",
              "--dsw-alias-markdown-code-block": "#F5EFE6",
              "--dsw-alias-markdown-inline-code": "#F2D9C6",
            },
          },
          {
            id: "cocoa", nameKey: "presetCocoa", mode: "light",
            accent: "#5E8C87", accentStrong: "#4E7A75", accentSoft: "#CFE3E0",
            custom: {
              "--dsw-alias-bg-base": "#EDE7D5",
              "--dsw-alias-bg-layer-1": "#C0D8D4",
              "--dsw-alias-bg-layer-2": "#B4CFCB",
              "--dsw-alias-bg-layer-3": "#A7C3BF",
              "--dsw-alias-bg-module-platform": "#C0D8D4",
              "--dsw-alias-bg-overlay": "#D0E2DF",
              "--dsw-specific-sidebar-fill": "#B4CFCB",
              "--dsw-alias-label-primary": "#5C4444",
              "--dsw-alias-label-secondary": "#70595A",
              "--dsw-alias-label-tertiary": "#887273",
              "--dsw-alias-label-caption": "#887273",
              "--dsw-alias-button-primary-fill": "#5C4444",
              "--dsw-alias-button-primary-hover": "#4C3535",
              "--dsw-alias-button-elevated-fill": "#B4CFCB",
              "--dsw-alias-button-floating-hover": "#A7C3BF",
              "--dsw-alias-label-primary-foreground": "#EDE7D5",
              "--dsw-specific-input-major": "#F4EFE0",
              "--dsw-specific-menu": "#CFE3E0",
              "--dsw-specific-selector": "#C0D8D4",
              "--dsw-specific-tip": "#C0D8D4",
              "--dsw-specific-bubble": "#B4CFCB",
              "--dsw-specific-sidebar-nav-item-active": "#CFE3E0",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(207,227,224,0.4)",
              "--dsw-alias-markdown-code-block": "#C0D8D4",
              "--dsw-alias-markdown-inline-code": "#D0E2DF",
            },
          },
          {
            id: "peachnut", nameKey: "presetPeachNut", mode: "light",
            accent: "#7C5549", accentStrong: "#64433A", accentSoft: "#EBD8D0",
            custom: {
              "--dsw-alias-bg-base": "#FFF0D9",
              "--dsw-alias-bg-layer-1": "#F2DFE6",
              "--dsw-alias-bg-layer-2": "#DDA4B4",
              "--dsw-alias-bg-layer-3": "#C98FA2",
              "--dsw-alias-bg-module-platform": "#F2DFE6",
              "--dsw-alias-bg-overlay": "#FDEEDF",
              "--dsw-specific-sidebar-fill": "#DDA4B4",
              "--dsw-alias-label-primary": "#5F4136",
              "--dsw-alias-label-secondary": "#7A5C52",
              "--dsw-alias-label-tertiary": "#967C74",
              "--dsw-alias-label-caption": "#967C74",
              "--dsw-alias-button-primary-fill": "#7C5549",
              "--dsw-alias-button-primary-hover": "#67463B",
              "--dsw-alias-button-elevated-fill": "#DDA4B4",
              "--dsw-alias-button-floating-hover": "#C98FA2",
              "--dsw-alias-label-primary-foreground": "#FFF0D9",
              "--dsw-specific-input-major": "#FFF8EC",
              "--dsw-specific-menu": "#CFE2F2",
              "--dsw-specific-selector": "#C0D9EC",
              "--dsw-specific-tip": "#D9E8F5",
              "--dsw-specific-bubble": "#78A5CE",
              "--dsw-specific-sidebar-nav-item-active": "#C98FA2",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(221,164,180,0.4)",
              "--dsw-alias-markdown-code-block": "#DDEBF5",
              "--dsw-alias-markdown-inline-code": "#EAF2F9",
            },
          },
          {
            id: "autumn", nameKey: "presetAutumn", mode: "light",
            accent: "#5C4B62", accentStrong: "#4C3D51", accentSoft: "#E4DBE8",
            custom: {
              "--dsw-alias-bg-base": "#F5EDD8",
              "--dsw-alias-bg-layer-1": "#D2C49B",
              "--dsw-alias-bg-layer-2": "#C9B98A",
              "--dsw-alias-bg-layer-3": "#BEAE7C",
              "--dsw-alias-bg-module-platform": "#D2C49B",
              "--dsw-alias-bg-overlay": "#E0D4B3",
              "--dsw-specific-sidebar-fill": "#C9B98A",
              "--dsw-alias-label-primary": "#463B4C",
              "--dsw-alias-label-secondary": "#645A69",
              "--dsw-alias-label-tertiary": "#7F7684",
              "--dsw-alias-label-caption": "#7F7684",
              "--dsw-alias-button-primary-fill": "#463B4C",
              "--dsw-alias-button-primary-hover": "#3B3240",
              "--dsw-alias-button-elevated-fill": "#C9B98A",
              "--dsw-alias-button-floating-hover": "#BEAE7C",
              "--dsw-alias-label-primary-foreground": "#F5EDD8",
              "--dsw-specific-input-major": "#F8F2E2",
              "--dsw-specific-menu": "#E4DBE8",
              "--dsw-specific-selector": "#D2C49B",
              "--dsw-specific-tip": "#D2C49B",
              "--dsw-specific-bubble": "#C9B98A",
              "--dsw-specific-sidebar-nav-item-active": "#E4DBE8",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(228,219,232,0.4)",
              "--dsw-alias-markdown-code-block": "#D2C49B",
              "--dsw-alias-markdown-inline-code": "#E0D4B3",
            },
          },
          {
            id: "mintmocha", nameKey: "presetMintMocha", mode: "light",
            accent: "#594842", accentStrong: "#483A35", accentSoft: "#D9CDC8",
            custom: {
              "--dsw-alias-bg-base": "#DEE9DC",
              "--dsw-alias-bg-layer-1": "#C9D2C4",
              "--dsw-alias-bg-layer-2": "#B7C0AF",
              "--dsw-alias-bg-layer-3": "#9FAA96",
              "--dsw-alias-bg-module-platform": "#C9D2C4",
              "--dsw-alias-bg-overlay": "#E9EFE6",
              "--dsw-specific-sidebar-fill": "#B7C0AF",
              "--dsw-alias-label-primary": "#4A3A34",
              "--dsw-alias-label-secondary": "#68564F",
              "--dsw-alias-label-tertiary": "#87766F",
              "--dsw-alias-label-caption": "#87766F",
              "--dsw-alias-button-primary-fill": "#594842",
              "--dsw-alias-button-primary-hover": "#685049",
              "--dsw-alias-button-elevated-fill": "#B7C0AF",
              "--dsw-alias-button-floating-hover": "#9FAA96",
              "--dsw-alias-label-primary-foreground": "#EFF2EB",
              "--dsw-specific-input-major": "#F3F6F0",
              "--dsw-specific-menu": "#D3DCCE",
              "--dsw-specific-selector": "#C4CEC0",
              "--dsw-specific-tip": "#DCE4D7",
              "--dsw-specific-bubble": "#C9D2C4",
              "--dsw-specific-sidebar-nav-item-active": "#9FAA96",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(183,192,175,0.45)",
              "--dsw-alias-markdown-code-block": "#D5DDD1",
              "--dsw-alias-markdown-inline-code": "#E3E8DE",
            },
          },
          {
            id: "clearwater", nameKey: "presetClearwater", mode: "light",
            accent: "#3E6300", accentStrong: "#335200", accentSoft: "#D5E2C8",
            custom: {
              "--dsw-alias-bg-base": "#FCF7DF",
              "--dsw-alias-bg-layer-1": "#D8DEE6",
              "--dsw-alias-bg-layer-2": "#A79ABA",
              "--dsw-alias-bg-layer-3": "#9084A8",
              "--dsw-alias-bg-module-platform": "#D8DEE6",
              "--dsw-alias-bg-overlay": "#E9E7EC",
              "--dsw-specific-sidebar-fill": "#A79ABA",
              "--dsw-alias-label-primary": "#414B32",
              "--dsw-alias-label-secondary": "#5E6A4C",
              "--dsw-alias-label-tertiary": "#7F8A6C",
              "--dsw-alias-label-caption": "#7F8A6C",
              "--dsw-alias-button-primary-fill": "#3E6300",
              "--dsw-alias-button-primary-hover": "#335200",
              "--dsw-alias-button-elevated-fill": "#A79ABA",
              "--dsw-alias-button-floating-hover": "#9084A8",
              "--dsw-alias-label-primary-foreground": "#FCF7DF",
              "--dsw-specific-input-major": "#FFFDF5",
              "--dsw-specific-menu": "#D9E0E7",
              "--dsw-specific-selector": "#C7D3DB",
              "--dsw-specific-tip": "#D8DEE6",
              "--dsw-specific-bubble": "#C7D3DB",
              "--dsw-specific-sidebar-nav-item-active": "#9084A8",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(167,154,186,0.4)",
              "--dsw-alias-markdown-code-block": "#DFE6EC",
              "--dsw-alias-markdown-inline-code": "#EAF0F3",
            },
          },
        ],
      },
      {
        id: "macaron", nameKey: "groupMacaron",
        themes: [
          {
            id: "seasalt", nameKey: "presetSeasalt", mode: "light",
            accent: "#2E8496", accentStrong: "#236A79", accentSoft: "#BFE9EC",
            custom: {
              "--dsw-alias-bg-base": "#C5FCDA",
              "--dsw-alias-bg-layer-1": "#B4F3CE",
              "--dsw-alias-bg-layer-2": "#67BAC6",
              "--dsw-alias-bg-layer-3": "#4FA3B1",
              "--dsw-alias-bg-module-platform": "#B4F3CE",
              "--dsw-alias-bg-overlay": "#D6FBE4",
              "--dsw-specific-sidebar-fill": "#67BAC6",
              "--dsw-alias-label-primary": "#20525C",
              "--dsw-alias-label-secondary": "#3D707B",
              "--dsw-alias-label-tertiary": "#5F8B95",
              "--dsw-alias-label-caption": "#5F8B95",
              "--dsw-alias-button-primary-fill": "#20525C",
              "--dsw-alias-button-primary-hover": "#183F47",
              "--dsw-alias-button-elevated-fill": "#67BAC6",
              "--dsw-alias-button-floating-hover": "#4FA3B1",
              "--dsw-alias-label-primary-foreground": "#F7FFF9",
              "--dsw-specific-input-major": "#FFFFFF",
              "--dsw-specific-menu": "#98E5EC",
              "--dsw-specific-selector": "#8CDEE6",
              "--dsw-specific-tip": "#A5E9F0",
              "--dsw-specific-bubble": "#FDF196",
              "--dsw-specific-sidebar-nav-item-active": "#4FA3B1",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.28)",
              "--dsw-alias-markdown-code-block": "#9CE4EA",
              "--dsw-alias-markdown-inline-code": "#B8ECF0",
            },
          },
          {
            id: "sakurasky", nameKey: "presetSakuraSky", mode: "light",
            accent: "#5FA6CB", accentStrong: "#4C89AC", accentSoft: "#D4EEF9",
            custom: {
              "--dsw-alias-bg-base": "#FCFFEC",
              "--dsw-alias-bg-layer-1": "#D7F0FA",
              "--dsw-alias-bg-layer-2": "#A2E1F9",
              "--dsw-alias-bg-layer-3": "#8BCFE9",
              "--dsw-alias-bg-module-platform": "#D7F0FA",
              "--dsw-alias-bg-overlay": "#F0F8F4",
              "--dsw-specific-sidebar-fill": "#A2E1F9",
              "--dsw-alias-label-primary": "#34576B",
              "--dsw-alias-label-secondary": "#567488",
              "--dsw-alias-label-tertiary": "#7A93A2",
              "--dsw-alias-label-caption": "#7A93A2",
              "--dsw-alias-button-primary-fill": "#34576B",
              "--dsw-alias-button-primary-hover": "#2A4859",
              "--dsw-alias-button-elevated-fill": "#A2E1F9",
              "--dsw-alias-button-floating-hover": "#8BCFE9",
              "--dsw-alias-label-primary-foreground": "#FCFFEC",
              "--dsw-specific-input-major": "#FFFEF4",
              "--dsw-specific-menu": "#FDE2E1",
              "--dsw-specific-selector": "#FCD9D8",
              "--dsw-specific-tip": "#FDEAE9",
              "--dsw-specific-bubble": "#FDCBCA",
              "--dsw-specific-sidebar-nav-item-active": "#8BCFE9",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(139,207,233,0.45)",
              "--dsw-alias-markdown-code-block": "#DFF1F9",
              "--dsw-alias-markdown-inline-code": "#EAF7FC",
            },
          },
          {
            id: "peach", nameKey: "presetPeach", mode: "light",
            accent: "#D96A7C", accentStrong: "#B75465", accentSoft: "#FAD7DE",
            custom: {
              "--dsw-alias-bg-base": "#FFEBEF",
              "--dsw-alias-bg-layer-1": "#FFE0D0",
              "--dsw-alias-bg-layer-2": "#F28693",
              "--dsw-alias-bg-layer-3": "#DE6F7E",
              "--dsw-alias-bg-module-platform": "#FFE0D0",
              "--dsw-alias-bg-overlay": "#FFEED9",
              "--dsw-specific-sidebar-fill": "#F28693",
              "--dsw-alias-label-primary": "#5C2B33",
              "--dsw-alias-label-secondary": "#7A4A52",
              "--dsw-alias-label-tertiary": "#9A6E75",
              "--dsw-alias-label-caption": "#9A6E75",
              "--dsw-alias-button-primary-fill": "#5C2B33",
              "--dsw-alias-button-primary-hover": "#4C232A",
              "--dsw-alias-button-elevated-fill": "#F28693",
              "--dsw-alias-button-floating-hover": "#DE6F7E",
              "--dsw-alias-label-primary-foreground": "#FFF7F3",
              "--dsw-specific-input-major": "#FFFDFB",
              "--dsw-specific-menu": "#FFE0C9",
              "--dsw-specific-selector": "#FFD5BA",
              "--dsw-specific-tip": "#FFE7D6",
              "--dsw-specific-bubble": "#FFC7A1",
              "--dsw-specific-sidebar-nav-item-active": "#DE6F7E",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(242,134,147,0.35)",
              "--dsw-alias-markdown-code-block": "#FBDDE2",
              "--dsw-alias-markdown-inline-code": "#FDE9ED",
            },
          },
          {
            id: "strawberry", nameKey: "presetStrawberry", mode: "light",
            accent: "#D98A9F", accentStrong: "#B76C82", accentSoft: "#FAD9E2",
            custom: {
              "--dsw-alias-bg-base": "#FFE8BE",
              "--dsw-alias-bg-layer-1": "#D4F3E0",
              "--dsw-alias-bg-layer-2": "#FABBCC",
              "--dsw-alias-bg-layer-3": "#E4A0B4",
              "--dsw-alias-bg-module-platform": "#D4F3E0",
              "--dsw-alias-bg-overlay": "#FBEED2",
              "--dsw-specific-sidebar-fill": "#FABBCC",
              "--dsw-alias-label-primary": "#5A3A44",
              "--dsw-alias-label-secondary": "#795863",
              "--dsw-alias-label-tertiary": "#997B84",
              "--dsw-alias-label-caption": "#997B84",
              "--dsw-alias-button-primary-fill": "#5A3A44",
              "--dsw-alias-button-primary-hover": "#4A2F38",
              "--dsw-alias-button-elevated-fill": "#FABBCC",
              "--dsw-alias-button-floating-hover": "#E4A0B4",
              "--dsw-alias-label-primary-foreground": "#FFF9F5",
              "--dsw-specific-input-major": "#FFFDF7",
              "--dsw-specific-menu": "#D4F3E0",
              "--dsw-specific-selector": "#C8EFD8",
              "--dsw-specific-tip": "#E0F6E9",
              "--dsw-specific-bubble": "#BCF5D2",
              "--dsw-specific-sidebar-nav-item-active": "#E4A0B4",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(250,187,204,0.35)",
              "--dsw-alias-markdown-code-block": "#E8F9EE",
              "--dsw-alias-markdown-inline-code": "#F1FBF5",
            },
          },
          {
            id: "lime", nameKey: "presetLime", mode: "light",
            accent: "#5E93CC", accentStrong: "#4A77A8", accentSoft: "#D2E7F7",
            custom: {
              "--dsw-alias-bg-base": "#FFFBB3",
              "--dsw-alias-bg-layer-1": "#CDF6D8",
              "--dsw-alias-bg-layer-2": "#9CC9F2",
              "--dsw-alias-bg-layer-3": "#7FB6E4",
              "--dsw-alias-bg-module-platform": "#CDF6D8",
              "--dsw-alias-bg-overlay": "#FDF6C8",
              "--dsw-specific-sidebar-fill": "#9CC9F2",
              "--dsw-alias-label-primary": "#3A5568",
              "--dsw-alias-label-secondary": "#5C7486",
              "--dsw-alias-label-tertiary": "#8096A5",
              "--dsw-alias-label-caption": "#8096A5",
              "--dsw-alias-button-primary-fill": "#3A5568",
              "--dsw-alias-button-primary-hover": "#2F4657",
              "--dsw-alias-button-elevated-fill": "#9CC9F2",
              "--dsw-alias-button-floating-hover": "#7FB6E4",
              "--dsw-alias-label-primary-foreground": "#F4FAFF",
              "--dsw-specific-input-major": "#FFFEFA",
              "--dsw-specific-menu": "#CDF6D8",
              "--dsw-specific-selector": "#BEF3CC",
              "--dsw-specific-tip": "#D9F8E2",
              "--dsw-specific-bubble": "#AEF4BD",
              "--dsw-specific-sidebar-nav-item-active": "#7FB6E4",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(156,201,242,0.4)",
              "--dsw-alias-markdown-code-block": "#DFF3F8",
              "--dsw-alias-markdown-inline-code": "#EBF8FB",
            },
          },
          {
            id: "violet", nameKey: "presetViolet", mode: "light",
            accent: "#7E6FC4", accentStrong: "#6658A6", accentSoft: "#DFD9F7",
            custom: {
              "--dsw-alias-bg-base": "#FFCDCB",
              "--dsw-alias-bg-layer-1": "#E4E0FA",
              "--dsw-alias-bg-layer-2": "#D0C7F9",
              "--dsw-alias-bg-layer-3": "#B9AFEC",
              "--dsw-alias-bg-module-platform": "#E4E0FA",
              "--dsw-alias-bg-overlay": "#FDEED4",
              "--dsw-specific-sidebar-fill": "#D0C7F9",
              "--dsw-alias-label-primary": "#4A4463",
              "--dsw-alias-label-secondary": "#6A6482",
              "--dsw-alias-label-tertiary": "#8C86A2",
              "--dsw-alias-label-caption": "#8C86A2",
              "--dsw-alias-button-primary-fill": "#4A4463",
              "--dsw-alias-button-primary-hover": "#3D3852",
              "--dsw-alias-button-elevated-fill": "#D0C7F9",
              "--dsw-alias-button-floating-hover": "#B9AFEC",
              "--dsw-alias-label-primary-foreground": "#F8F6FE",
              "--dsw-specific-input-major": "#FFFBF8",
              "--dsw-specific-menu": "#FDF0C0",
              "--dsw-specific-selector": "#FCE9AD",
              "--dsw-specific-tip": "#FDF4D2",
              "--dsw-specific-bubble": "#FDF5A8",
              "--dsw-specific-sidebar-nav-item-active": "#B9AFEC",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(208,199,249,0.45)",
              "--dsw-alias-markdown-code-block": "#E6E1FA",
              "--dsw-alias-markdown-inline-code": "#F0EDFC",
            },
          },
          {
            id: "matcha", nameKey: "presetMatcha", mode: "light",
            accent: "#7E9A55", accentStrong: "#677F43", accentSoft: "#E1EACB",
            custom: {
              "--dsw-alias-bg-base": "#FFEBEF",
              "--dsw-alias-bg-layer-1": "#DCEAC4",
              "--dsw-alias-bg-layer-2": "#BDD197",
              "--dsw-alias-bg-layer-3": "#A5BC7B",
              "--dsw-alias-bg-module-platform": "#DCEAC4",
              "--dsw-alias-bg-overlay": "#FBEED6",
              "--dsw-specific-sidebar-fill": "#BDD197",
              "--dsw-alias-label-primary": "#45532F",
              "--dsw-alias-label-secondary": "#66744F",
              "--dsw-alias-label-tertiary": "#889572",
              "--dsw-alias-label-caption": "#889572",
              "--dsw-alias-button-primary-fill": "#45532F",
              "--dsw-alias-button-primary-hover": "#384427",
              "--dsw-alias-button-elevated-fill": "#BDD197",
              "--dsw-alias-button-floating-hover": "#A5BC7B",
              "--dsw-alias-label-primary-foreground": "#F7FAF1",
              "--dsw-specific-input-major": "#FFFDF9",
              "--dsw-specific-menu": "#FCEAC4",
              "--dsw-specific-selector": "#FBE2B0",
              "--dsw-specific-tip": "#FDEFD2",
              "--dsw-specific-bubble": "#F9E19D",
              "--dsw-specific-sidebar-nav-item-active": "#A5BC7B",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(189,209,151,0.45)",
              "--dsw-alias-markdown-code-block": "#E6EFD5",
              "--dsw-alias-markdown-inline-code": "#F0F6E4",
            },
          },
          {
            id: "grape", nameKey: "presetGrape", mode: "light",
            accent: "#A468B5", accentStrong: "#885396", accentSoft: "#EBD5F2",
            custom: {
              "--dsw-alias-bg-base": "#FFF5CD",
              "--dsw-alias-bg-layer-1": "#D0EAFA",
              "--dsw-alias-bg-layer-2": "#F4CEEC",
              "--dsw-alias-bg-layer-3": "#DFB1E3",
              "--dsw-alias-bg-module-platform": "#D0EAFA",
              "--dsw-alias-bg-overlay": "#FDF2DC",
              "--dsw-specific-sidebar-fill": "#F4CEEC",
              "--dsw-alias-label-primary": "#56345E",
              "--dsw-alias-label-secondary": "#75547C",
              "--dsw-alias-label-tertiary": "#95779B",
              "--dsw-alias-label-caption": "#95779B",
              "--dsw-alias-button-primary-fill": "#56345E",
              "--dsw-alias-button-primary-hover": "#472A4E",
              "--dsw-alias-button-elevated-fill": "#F4CEEC",
              "--dsw-alias-button-floating-hover": "#DFB1E3",
              "--dsw-alias-label-primary-foreground": "#FCF6FC",
              "--dsw-specific-input-major": "#FFFEF8",
              "--dsw-specific-menu": "#D0EAFA",
              "--dsw-specific-selector": "#C2E4F7",
              "--dsw-specific-tip": "#DCEFFA",
              "--dsw-specific-bubble": "#A6D4ED",
              "--dsw-specific-sidebar-nav-item-active": "#DFB1E3",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(244,206,236,0.45)",
              "--dsw-alias-markdown-code-block": "#E6F1FB",
              "--dsw-alias-markdown-inline-code": "#F0F7FD",
            },
          },
        ],
      },
      {
        id: "chinese", nameKey: "groupChinese",
        themes: [
          {
            id: "shiqing", nameKey: "presetShiqing", mode: "light",
            accent: "#B5766A", accentStrong: "#9A6157", accentSoft: "#F0D9D2",
            custom: {
              "--dsw-alias-bg-base": "#D5EBE1",
              "--dsw-alias-bg-layer-1": "#B7CEDB",
              "--dsw-alias-bg-layer-2": "#4A7492",
              "--dsw-alias-bg-layer-3": "#3E627C",
              "--dsw-alias-bg-module-platform": "#B7CEDB",
              "--dsw-alias-bg-overlay": "#D6E3E4",
              "--dsw-specific-sidebar-fill": "#4A7492",
              "--dsw-alias-label-primary": "#334E62",
              "--dsw-alias-label-secondary": "#576F81",
              "--dsw-alias-label-tertiary": "#7A8F9E",
              "--dsw-alias-label-caption": "#7A8F9E",
              "--dsw-alias-button-primary-fill": "#334E62",
              "--dsw-alias-button-primary-hover": "#2A4050",
              "--dsw-alias-button-elevated-fill": "#4A7492",
              "--dsw-alias-button-floating-hover": "#3E627C",
              "--dsw-alias-label-primary-foreground": "#EDF4F0",
              "--dsw-specific-input-major": "#F3F7F3",
              "--dsw-specific-menu": "#F0D9D1",
              "--dsw-specific-selector": "#EBD0C6",
              "--dsw-specific-tip": "#F2DFD8",
              "--dsw-specific-bubble": "#DCA996",
              "--dsw-specific-sidebar-nav-item-active": "#3E627C",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(74,116,146,0.3)",
              "--dsw-alias-markdown-code-block": "#C5D7E0",
              "--dsw-alias-markdown-inline-code": "#D8E5EC",
            },
          },
          {
            id: "ouhe", nameKey: "presetOuhe", mode: "light",
            accent: "#8A6E80", accentStrong: "#725A6A", accentSoft: "#E8DAE2",
            custom: {
              "--dsw-alias-bg-base": "#D5EBE1",
              "--dsw-alias-bg-layer-1": "#E9DBE3",
              "--dsw-alias-bg-layer-2": "#D8BFCF",
              "--dsw-alias-bg-layer-3": "#C2A4B8",
              "--dsw-alias-bg-module-platform": "#E9DBE3",
              "--dsw-alias-bg-overlay": "#E8E3DC",
              "--dsw-specific-sidebar-fill": "#D8BFCF",
              "--dsw-alias-label-primary": "#5A4A52",
              "--dsw-alias-label-secondary": "#76636C",
              "--dsw-alias-label-tertiary": "#94818A",
              "--dsw-alias-label-caption": "#94818A",
              "--dsw-alias-button-primary-fill": "#5A4A52",
              "--dsw-alias-button-primary-hover": "#4B3E45",
              "--dsw-alias-button-elevated-fill": "#D8BFCF",
              "--dsw-alias-button-floating-hover": "#C2A4B8",
              "--dsw-alias-label-primary-foreground": "#F7F3F0",
              "--dsw-specific-input-major": "#F8F6F1",
              "--dsw-specific-menu": "#F4EED6",
              "--dsw-specific-selector": "#F1E9CB",
              "--dsw-specific-tip": "#F5F0DD",
              "--dsw-specific-bubble": "#E9E2C2",
              "--dsw-specific-sidebar-nav-item-active": "#C2A4B8",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(216,191,207,0.4)",
              "--dsw-alias-markdown-code-block": "#EBDDE5",
              "--dsw-alias-markdown-inline-code": "#F2E8ED",
            },
          },
          {
            id: "xueqing", nameKey: "presetXueqing", mode: "light",
            accent: "#7E7CC4", accentStrong: "#6664A6", accentSoft: "#E6E6F8",
            custom: {
              "--dsw-alias-bg-base": "#D5EBE1",
              "--dsw-alias-bg-layer-1": "#EFEFFA",
              "--dsw-alias-bg-layer-2": "#E3E3F7",
              "--dsw-alias-bg-layer-3": "#CCCBE6",
              "--dsw-alias-bg-module-platform": "#EFEFFA",
              "--dsw-alias-bg-overlay": "#EFE9E7",
              "--dsw-specific-sidebar-fill": "#E3E3F7",
              "--dsw-alias-label-primary": "#4A4A6E",
              "--dsw-alias-label-secondary": "#67678A",
              "--dsw-alias-label-tertiary": "#8686A5",
              "--dsw-alias-label-caption": "#8686A5",
              "--dsw-alias-button-primary-fill": "#4A4A6E",
              "--dsw-alias-button-primary-hover": "#3D3D5B",
              "--dsw-alias-button-elevated-fill": "#E3E3F7",
              "--dsw-alias-button-floating-hover": "#CCCBE6",
              "--dsw-alias-label-primary-foreground": "#F6F5FC",
              "--dsw-specific-input-major": "#F8F8FC",
              "--dsw-specific-menu": "#FAEDE7",
              "--dsw-specific-selector": "#F8E7DF",
              "--dsw-specific-tip": "#FAF0EA",
              "--dsw-specific-bubble": "#F5E0D6",
              "--dsw-specific-sidebar-nav-item-active": "#CCCBE6",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(227,227,247,0.5)",
              "--dsw-alias-markdown-code-block": "#E9E8F8",
              "--dsw-alias-markdown-inline-code": "#F0F0FA",
            },
          },
          {
            id: "canglang", nameKey: "presetCanglang", mode: "light",
            accent: "#4E7A5F", accentStrong: "#41654E", accentSoft: "#CBE0D2",
            custom: {
              "--dsw-alias-bg-base": "#D5EBE1",
              "--dsw-alias-bg-layer-1": "#C1DAC8",
              "--dsw-alias-bg-layer-2": "#729E7F",
              "--dsw-alias-bg-layer-3": "#5F876C",
              "--dsw-alias-bg-module-platform": "#C1DAC8",
              "--dsw-alias-bg-overlay": "#D9E5E0",
              "--dsw-specific-sidebar-fill": "#729E7F",
              "--dsw-alias-label-primary": "#3B5544",
              "--dsw-alias-label-secondary": "#5A7262",
              "--dsw-alias-label-tertiary": "#7C9182",
              "--dsw-alias-label-caption": "#7C9182",
              "--dsw-alias-button-primary-fill": "#3B5544",
              "--dsw-alias-button-primary-hover": "#314736",
              "--dsw-alias-button-elevated-fill": "#729E7F",
              "--dsw-alias-button-floating-hover": "#5F876C",
              "--dsw-alias-label-primary-foreground": "#F0F5F2",
              "--dsw-specific-input-major": "#F4F8F5",
              "--dsw-specific-menu": "#D8E8F1",
              "--dsw-specific-selector": "#CFE2ED",
              "--dsw-specific-tip": "#DFEAF2",
              "--dsw-specific-bubble": "#90B8D0",
              "--dsw-specific-sidebar-nav-item-active": "#5F876C",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(114,158,127,0.35)",
              "--dsw-alias-markdown-code-block": "#CFE0D6",
              "--dsw-alias-markdown-inline-code": "#DFEAE3",
            },
          },
          {
            id: "sancai", nameKey: "presetSancai", mode: "light",
            accent: "#D97A7A", accentStrong: "#C2686B", accentSoft: "#F2D2D0",
            custom: {
              "--dsw-alias-bg-base": "#EEE6CB",
              "--dsw-alias-bg-layer-1": "#B9CED9",
              "--dsw-alias-bg-layer-2": "#436C85",
              "--dsw-alias-bg-layer-3": "#3A6073",
              "--dsw-alias-bg-module-platform": "#B9CED9",
              "--dsw-alias-bg-overlay": "#E0E4D2",
              "--dsw-specific-sidebar-fill": "#436C85",
              "--dsw-alias-label-primary": "#4A3B33",
              "--dsw-alias-label-secondary": "#6B5B4F",
              "--dsw-alias-label-tertiary": "#8F7F6E",
              "--dsw-alias-label-caption": "#8F7F6E",
              "--dsw-alias-button-primary-fill": "#4A3B33",
              "--dsw-alias-button-primary-hover": "#3D312B",
              "--dsw-alias-button-elevated-fill": "#436C85",
              "--dsw-alias-button-floating-hover": "#3A6073",
              "--dsw-alias-label-primary-foreground": "#F4EFDF",
              "--dsw-specific-input-major": "#F6F2E5",
              "--dsw-specific-menu": "#B7D6C8",
              "--dsw-specific-selector": "#A6CBBB",
              "--dsw-specific-tip": "#C4DCD2",
              "--dsw-specific-bubble": "#DE9960",
              "--dsw-specific-sidebar-nav-item-active": "#3A6073",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.16)",
              "--dsw-alias-markdown-code-block": "#C2D5DD",
              "--dsw-alias-markdown-inline-code": "#D6E4EA",
            },
          },
          {
            id: "tuoling", nameKey: "presetTuoling", mode: "light",
            accent: "#2E2927", accentStrong: "#211D1C", accentSoft: "#D0CCC9",
            custom: {
              "--dsw-alias-bg-base": "#E1D6C7",
              "--dsw-alias-bg-layer-1": "#E3C9C4",
              "--dsw-alias-bg-layer-2": "#A63F3F",
              "--dsw-alias-bg-layer-3": "#8B3434",
              "--dsw-alias-bg-module-platform": "#E3C9C4",
              "--dsw-alias-bg-overlay": "#EAE0D4",
              "--dsw-specific-sidebar-fill": "#A63F3F",
              "--dsw-alias-label-primary": "#3F3A39",
              "--dsw-alias-label-secondary": "#625B57",
              "--dsw-alias-label-tertiary": "#857E79",
              "--dsw-alias-label-caption": "#857E79",
              "--dsw-alias-button-primary-fill": "#3F3A39",
              "--dsw-alias-button-primary-hover": "#332F2E",
              "--dsw-alias-button-elevated-fill": "#A63F3F",
              "--dsw-alias-button-floating-hover": "#8B3434",
              "--dsw-alias-label-primary-foreground": "#F2EDE6",
              "--dsw-specific-input-major": "#F5F1EA",
              "--dsw-specific-menu": "#CBBDB1",
              "--dsw-specific-selector": "#C0B0A2",
              "--dsw-specific-tip": "#D4C6B9",
              "--dsw-specific-bubble": "#C3AB8C",
              "--dsw-specific-sidebar-nav-item-active": "#8B3434",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.14)",
              "--dsw-alias-markdown-code-block": "#E4DBD0",
              "--dsw-alias-markdown-inline-code": "#ECE5DC",
            },
          },
          {
            id: "yanzhi", nameKey: "presetYanzhi", mode: "light",
            accent: "#F47983", accentStrong: "#E05F73", accentSoft: "#FBDCE2",
            custom: {
              "--dsw-alias-bg-base": "#F0E0D3",
              "--dsw-alias-bg-layer-1": "#B9DAD4",
              "--dsw-alias-bg-layer-2": "#76AEA6",
              "--dsw-alias-bg-layer-3": "#639A92",
              "--dsw-alias-bg-module-platform": "#B9DAD4",
              "--dsw-alias-bg-overlay": "#EFE3D8",
              "--dsw-specific-sidebar-fill": "#76AEA6",
              "--dsw-alias-label-primary": "#4A3B36",
              "--dsw-alias-label-secondary": "#6B5A52",
              "--dsw-alias-label-tertiary": "#8D7B71",
              "--dsw-alias-label-caption": "#8D7B71",
              "--dsw-alias-button-primary-fill": "#4A3B36",
              "--dsw-alias-button-primary-hover": "#3D312D",
              "--dsw-alias-button-elevated-fill": "#76AEA6",
              "--dsw-alias-button-floating-hover": "#639A92",
              "--dsw-alias-label-primary-foreground": "#F8EEE5",
              "--dsw-specific-input-major": "#F9F2EA",
              "--dsw-specific-menu": "#E8D7CB",
              "--dsw-specific-selector": "#DFC9BB",
              "--dsw-specific-tip": "#E4D0C4",
              "--dsw-specific-bubble": "#DE476A",
              "--dsw-specific-sidebar-nav-item-active": "#639A92",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(118,174,166,0.35)",
              "--dsw-alias-markdown-code-block": "#D8E7E4",
              "--dsw-alias-markdown-inline-code": "#E6F0ED",
            },
          },
          {
            id: "luori", nameKey: "presetLuori", mode: "light",
            accent: "#8C3B2E", accentStrong: "#6F2F25", accentSoft: "#E3C4B4",
            custom: {
              "--dsw-alias-bg-base": "#EED7C6",
              "--dsw-alias-bg-layer-1": "#E5B98F",
              "--dsw-alias-bg-layer-2": "#CA6924",
              "--dsw-alias-bg-layer-3": "#A8561E",
              "--dsw-alias-bg-module-platform": "#E5B98F",
              "--dsw-alias-bg-overlay": "#F2E0D4",
              "--dsw-specific-sidebar-fill": "#CA6924",
              "--dsw-alias-label-primary": "#4E3B30",
              "--dsw-alias-label-secondary": "#6F5A4C",
              "--dsw-alias-label-tertiary": "#90796A",
              "--dsw-alias-label-caption": "#90796A",
              "--dsw-alias-button-primary-fill": "#4E3B30",
              "--dsw-alias-button-primary-hover": "#413028",
              "--dsw-alias-button-elevated-fill": "#CA6924",
              "--dsw-alias-button-floating-hover": "#A8561E",
              "--dsw-alias-label-primary-foreground": "#F9F1E9",
              "--dsw-specific-input-major": "#FAF3EC",
              "--dsw-specific-menu": "#E3CCBC",
              "--dsw-specific-selector": "#D9C0AE",
              "--dsw-specific-tip": "#E8D3C4",
              "--dsw-specific-bubble": "#E9B693",
              "--dsw-specific-sidebar-nav-item-active": "#A8561E",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.18)",
              "--dsw-alias-markdown-code-block": "#EFE0D2",
              "--dsw-alias-markdown-inline-code": "#F4E9DD",
            },
          },
          {
            id: "hutao", nameKey: "presetHutao", mode: "light",
            accent: "#A4644A", accentStrong: "#86513B", accentSoft: "#E8D2C8",
            custom: {
              "--dsw-alias-bg-base": "#EEDCCB",
              "--dsw-alias-bg-layer-1": "#D9C3B4",
              "--dsw-alias-bg-layer-2": "#753F2D",
              "--dsw-alias-bg-layer-3": "#633425",
              "--dsw-alias-bg-module-platform": "#D9C3B4",
              "--dsw-alias-bg-overlay": "#EDE4D4",
              "--dsw-specific-sidebar-fill": "#753F2D",
              "--dsw-alias-label-primary": "#4E3327",
              "--dsw-alias-label-secondary": "#6E5142",
              "--dsw-alias-label-tertiary": "#8F7364",
              "--dsw-alias-label-caption": "#8F7364",
              "--dsw-alias-button-primary-fill": "#4E3327",
              "--dsw-alias-button-primary-hover": "#412A20",
              "--dsw-alias-button-elevated-fill": "#753F2D",
              "--dsw-alias-button-floating-hover": "#633425",
              "--dsw-alias-label-primary-foreground": "#F6EDE2",
              "--dsw-specific-input-major": "#F8F1E8",
              "--dsw-specific-menu": "#E0DCC0",
              "--dsw-specific-selector": "#D7D2AF",
              "--dsw-specific-tip": "#E3DFC8",
              "--dsw-specific-bubble": "#DD9D71",
              "--dsw-specific-sidebar-nav-item-active": "#633425",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.14)",
              "--dsw-alias-markdown-code-block": "#E2D8CB",
              "--dsw-alias-markdown-inline-code": "#EBE3D8",
            },
          },
          {
            id: "ziteng", nameKey: "presetZiteng", mode: "light",
            accent: "#DE7294", accentStrong: "#B9597A", accentSoft: "#F5D3DC",
            custom: {
              "--dsw-alias-bg-base": "#F0E0D3",
              "--dsw-alias-bg-layer-1": "#CDBBD1",
              "--dsw-alias-bg-layer-2": "#7D5A8A",
              "--dsw-alias-bg-layer-3": "#6A4C76",
              "--dsw-alias-bg-module-platform": "#CDBBD1",
              "--dsw-alias-bg-overlay": "#F0E6DC",
              "--dsw-specific-sidebar-fill": "#7D5A8A",
              "--dsw-alias-label-primary": "#4E3A4E",
              "--dsw-alias-label-secondary": "#6D586C",
              "--dsw-alias-label-tertiary": "#8D798B",
              "--dsw-alias-label-caption": "#8D798B",
              "--dsw-alias-button-primary-fill": "#4E3A4E",
              "--dsw-alias-button-primary-hover": "#413041",
              "--dsw-alias-button-elevated-fill": "#7D5A8A",
              "--dsw-alias-button-floating-hover": "#6A4C76",
              "--dsw-alias-label-primary-foreground": "#F7EEE9",
              "--dsw-specific-input-major": "#F9F2EC",
              "--dsw-specific-menu": "#B8D8CF",
              "--dsw-specific-selector": "#A9CFC4",
              "--dsw-specific-tip": "#C3DED5",
              "--dsw-specific-bubble": "#DE7294",
              "--dsw-specific-sidebar-nav-item-active": "#6A4C76",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.16)",
              "--dsw-alias-markdown-code-block": "#E0D4E4",
              "--dsw-alias-markdown-inline-code": "#EAE0ED",
            },
          },
          {
            id: "jingui", nameKey: "presetJingui", mode: "light",
            accent: "#BCE672", accentStrong: "#A3CE5C", accentSoft: "#EDF8D8",
            custom: {
              "--dsw-alias-bg-base": "#EEE2AF",
              "--dsw-alias-bg-layer-1": "#D8C88E",
              "--dsw-alias-bg-layer-2": "#266F40",
              "--dsw-alias-bg-layer-3": "#1F5C35",
              "--dsw-alias-bg-module-platform": "#D8C88E",
              "--dsw-alias-bg-overlay": "#F0EAC8",
              "--dsw-specific-sidebar-fill": "#266F40",
              "--dsw-alias-label-primary": "#3E4527",
              "--dsw-alias-label-secondary": "#5E6442",
              "--dsw-alias-label-tertiary": "#7F8462",
              "--dsw-alias-label-caption": "#7F8462",
              "--dsw-alias-button-primary-fill": "#3E4527",
              "--dsw-alias-button-primary-hover": "#33391F",
              "--dsw-alias-button-elevated-fill": "#266F40",
              "--dsw-alias-button-floating-hover": "#1F5C35",
              "--dsw-alias-label-primary-foreground": "#F6F0DA",
              "--dsw-specific-input-major": "#F8F3E2",
              "--dsw-specific-menu": "#DADBA9",
              "--dsw-specific-selector": "#D1D29C",
              "--dsw-specific-tip": "#DEE0B4",
              "--dsw-specific-bubble": "#E29F34",
              "--dsw-specific-sidebar-nav-item-active": "#1F5C35",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.14)",
              "--dsw-alias-markdown-code-block": "#E4E4C4",
              "--dsw-alias-markdown-inline-code": "#ECECD2",
            },
          },
          {
            id: "lantian", nameKey: "presetLantian", mode: "light",
            accent: "#74A0B4", accentStrong: "#5E8FA5", accentSoft: "#CFE3EC",
            custom: {
              "--dsw-alias-bg-base": "#DDDAB4",
              "--dsw-alias-bg-layer-1": "#C4DCC9",
              "--dsw-alias-bg-layer-2": "#165188",
              "--dsw-alias-bg-layer-3": "#114375",
              "--dsw-alias-bg-module-platform": "#C4DCC9",
              "--dsw-alias-bg-overlay": "#E8E8CC",
              "--dsw-specific-sidebar-fill": "#165188",
              "--dsw-alias-label-primary": "#2E3B2E",
              "--dsw-alias-label-secondary": "#4E5B4C",
              "--dsw-alias-label-tertiary": "#6F7B6C",
              "--dsw-alias-label-caption": "#6F7B6C",
              "--dsw-alias-button-primary-fill": "#2E3B2E",
              "--dsw-alias-button-primary-hover": "#253025",
              "--dsw-alias-button-elevated-fill": "#165188",
              "--dsw-alias-button-floating-hover": "#114375",
              "--dsw-alias-label-primary-foreground": "#F2F0DF",
              "--dsw-specific-input-major": "#F6F4E6",
              "--dsw-specific-menu": "#A9D2CB",
              "--dsw-specific-selector": "#99C9C0",
              "--dsw-specific-tip": "#B4D8D1",
              "--dsw-specific-bubble": "#BFCF61",
              "--dsw-specific-sidebar-nav-item-active": "#114375",
              "--dsw-specific-sidebar-nav-item-hover": "rgba(255,255,255,0.16)",
              "--dsw-alias-markdown-code-block": "#D3E2D6",
              "--dsw-alias-markdown-inline-code": "#E2ECE4",
            },
          },
        ],
      },
    ].map((g) => ({ id: g.id, nameKey: g.nameKey, themes: g.themes.map((t) => ({ id: t.id, nameKey: t.nameKey, colorScheme: t.mode, tokens: buildPreset(t.mode, t) })) }));

    // ── 壁纸预设（使用预设）：动态壁纸 = 宿主路由流式播放的 MP4，普通壁纸 = 静态图 ──
    // 文件由 lib/index.js 的 /dsh-theme-kit-wallpapers 路由从 wallpapers/ 目录提供；
    // 名字沿用用户起好的文件名（label 直接渲染，不再走 zh/en 字典）。
    const WALLPAPER_BASE = "/dsh-theme-kit-wallpapers";
    const WALLPAPER_GROUPS = [
      {
        id: "dynamic",
        nameKey: "wpDynamic",
        items: [
          { id: "wp-dv-gojo", file: "dynamic/五条悟.mp4", label: "五条悟" },
          { id: "wp-dv-corgi", file: "dynamic/柯基小狗.mp4", label: "柯基小狗" },
          { id: "wp-dv-linepup", file: "dynamic/线条小狗.mp4", label: "线条小狗" },
        ],
      },
      {
        id: "static",
        nameKey: "wpStatic",
        items: [
          { id: "wp-st-summer", file: "static/夏日海边.png", label: "夏日海边" },
          { id: "wp-st-shade", file: "static/树荫.jpg", label: "树荫" },
          { id: "wp-st-linepup", file: "static/线条小狗.jpg", label: "线条小狗" },
        ],
      },
    ].map((g) => ({
      ...g,
      items: g.items.map((it) => ({
        ...it,
        url: WALLPAPER_BASE + "/" + it.file.split("/").map((seg) => encodeURIComponent(seg)).join("/"),
        // 画廊缩略图：墙纸原图体积大（8~45MB），缩略图走 wallpapers/thumbs/<id>.jpg（约 15KB）
        thumb: WALLPAPER_BASE + "/thumbs/" + it.id + ".jpg",
      })),
    }));


    // ── 纸纹纹理（选择纹理）：东方纸纹，平铺叠加在界面表面，给面板加纸质感 ──
    const TEXTURE_BASE = "/dsh-theme-kit-wallpapers/textures";
    const TEXTURES = [
      { id: "paper1", label: "纸纹 1", file: "paper1.jpg", defaultStrength: 11 },
      { id: "xiangyun", label: "祥云纹", file: "xiangyun.jpg", defaultStrength: 30 },
      { id: "huiwen", label: "回纹", file: "huiwen.jpg", defaultStrength: 32 },
      { id: "lianyi", label: "涟漪纹", file: "lianyi.jpg", defaultStrength: 30 },
      { id: "bolang", label: "波浪纹", file: "bolang.jpg", defaultStrength: 30 },
      { id: "luoxuan", label: "螺旋纹", file: "luoxuan.jpg", defaultStrength: 28 },
      { id: "lingge", label: "菱格纹", file: "lingge.jpg", defaultStrength: 30 },
    ].map((t) => ({ ...t, url: TEXTURE_BASE + "/" + t.file, mask: TEXTURE_BASE + "/mask-" + t.id + ".png" }));
    const TEXTURE_BY_ID = new Map(TEXTURES.map((t) => [t.id, t]));

    // 纹路颜色预设：原色 = 用纹理自身颜色；其余把纹理叠成该颜色
    const TEXTURE_COLORS = [
      { id: "", label: "原色", color: "" },
      { id: "gold", label: "金", color: "#C9A86A" },
      { id: "brown", label: "棕", color: "#8B5E3C" },
      { id: "red", label: "朱红", color: "#B03A2E" },
      { id: "green", label: "青", color: "#2F6B6B" },
      { id: "ink", label: "墨", color: "#4A4A4A" },
      { id: "blue", label: "蓝", color: "#4A6FA5" },
    ];

    const zh = {
      nav: "主题与配色",
      presetTitle: "预设主题",
      defaultTitle: "默认",
      system: "跟随系统",
      light: "浅色",
      dark: "深色",
      bgTitle: "自定义背景",
      bgImport: "导入背景",
      bgClear: "清除",
      glassTitle: "玻璃质感",
      bgReset: "重置",
      posTitle: "位置",
      posCenter: "居中",
      posTop: "顶部",
      posBottom: "底部",
      sizeTitle: "缩放",
      sizeCover: "铺满",
      sizeContain: "适应",
      sizeAuto: "原尺寸",
      cropTitle: "裁剪图片",
      cropApply: "应用",
      cropCancel: "取消",
      groupMorandi: "莫兰迪",
      groupMacaron: "马卡龙",
      groupChinese: "中国传统色",
      presetMori: "燕麦摩卡",
      presetSoyCake: "豆粉年糕",
      presetLilac: "橄榄奶糖",
      presetClay: "苔藓奶绿",
      presetTeal: "紫苏麻薯",
      presetBerryBreeze: "莓语轻风",
      presetHermes: "橙香奶盖",
      presetCocoa: "海苔奶冻",
      presetPeachNut: "甜桃榛果",
      presetAutumn: "桂花乌龙",
      presetMintMocha: "薄荷奶咖",
      presetClearwater: "蓝藻奶巧",
      presetSeasalt: "海盐冰沙",
      presetSakuraSky: "樱花奶昔",
      presetPeach: "蜜桃奶糖",
      presetStrawberry: "莓果奶霜",
      presetLime: "柠檬海风",
      presetViolet: "紫薯奶黄",
      presetMatcha: "抹茶杏子",
      presetGrape: "葡萄奶冻",
      presetShiqing: "石青赭脂",
      presetOuhe: "藕荷绛色",
      presetXueqing: "雪青桃夭",
      presetCanglang: "苍筤霁青",
      presetSancai: "长安三彩",
      presetTuoling: "朱墙驼铃",
      presetYanzhi: "胭脂青黛",
      presetLuori: "落日胡天",
      presetHutao: "胡桃琥珀",
      presetZiteng: "紫藤青杏",
      presetJingui: "金桂竹影",
      presetLantian: "蓝田碧玉",
      wpTitle: "使用预设",
      wpDynamic: "动态壁纸",
      wpStatic: "普通壁纸",
      textDepthTitle: "文字深浅",
      advTitle: "高级",
      advManual: "手动微调",
      advMain: "主区",
      advSide: "侧边栏",
      advCard: "卡片",
      advInput: "输入区",
      advDialog: "设置面板",
      texTitle: "纹理",
      texNone: "无",
      texStrength: "纹理强度",
      texColor: "纹路颜色",
      kbdpet: "按键桌宠",
      kbdOn: "开启",
      kbdReset: "重置位置",
    };
    const en = {
      nav: "Themes & Colors",
      presetTitle: "Preset themes",
      defaultTitle: "Default",
      system: "System",
      light: "Light",
      dark: "Dark",
      bgTitle: "Custom background",
      bgImport: "Import background",
      bgClear: "Clear",
      glassTitle: "Glass texture",
      bgReset: "Reset",
      posTitle: "Position",
      posCenter: "Center",
      posTop: "Top",
      posBottom: "Bottom",
      sizeTitle: "Size",
      sizeCover: "Cover",
      sizeContain: "Contain",
      sizeAuto: "Actual",
      cropTitle: "Crop image",
      cropApply: "Apply",
      cropCancel: "Cancel",
      groupMorandi: "Morandi",
      groupMacaron: "Macaron",
      groupChinese: "Chinese traditional",
      presetMori: "Oat Mocha",
      presetSoyCake: "Soy Mochi",
      presetLilac: "Olive Candy",
      presetClay: "Moss Milk",
      presetTeal: "Perilla Mochi",
      presetBerryBreeze: "Berry Breeze",
      presetHermes: "Orange Milk Cap",
      presetCocoa: "Seaweed Jelly",
      presetPeachNut: "Peach Hazelnut",
      presetAutumn: "Osmanthus Oolong",
      presetMintMocha: "Mint Coffee",
      presetClearwater: "Algae Choco",
      presetSeasalt: "Sea Salt Frappe",
      presetSakuraSky: "Sakura Shake",
      presetPeach: "Peach Candy",
      presetStrawberry: "Berry Frost",
      presetLime: "Lemon Sea Breeze",
      presetViolet: "Purple Yam Custard",
      presetMatcha: "Matcha Apricot",
      presetGrape: "Grape Jelly",
      presetShiqing: "Azurite Ochre",
      presetOuhe: "Lotus Crimson",
      presetXueqing: "Snow Peach",
      presetCanglang: "Bamboo Azure",
      presetSancai: "Tang Tricolor",
      presetTuoling: "Vermilion Wall",
      presetYanzhi: "Rouge Teal",
      presetLuori: "Frontier Sunset",
      presetHutao: "Walnut Amber",
      presetZiteng: "Wisteria Apricot",
      presetJingui: "Osmanthus Bamboo",
      presetLantian: "Lantian Jade",
      wpTitle: "Use preset",
      wpDynamic: "Dynamic wallpapers",
      wpStatic: "Static wallpapers",
      textDepthTitle: "Text depth",
      advTitle: "Advanced",
      advManual: "Manual fine-tune",
      advMain: "Main area",
      advSide: "Sidebar",
      advCard: "Cards",
      advInput: "Input area",
      advDialog: "Settings panel",
      texTitle: "Texture",
      texNone: "None",
      texStrength: "Texture strength",
      texColor: "Texture color",
      kbdpet: "Keyboard pet",
      kbdOn: "On",
      kbdReset: "Reset position",
    };

    const css = [
      ".UIT_section{width:100%;max-width:760px;flex-direction:column;gap:16px;display:flex}",
      ".UIT_group{border:1px solid var(--dsw-alias-border-l2);border-radius:12px;padding:16px;flex-direction:column;gap:12px;display:flex}",
      ".UIT_groupTitle{font-size:14px;font-weight:500;line-height:22px;margin:0;color:var(--dsw-alias-label-primary)}",
      ".UIT_foldTitle{cursor:pointer;user-select:none;align-items:center;justify-content:space-between;display:flex}",
      ".UIT_foldChevron{color:var(--dsw-alias-label-tertiary);font-size:20px;line-height:22px}",
      ".UIT_groupDesc{font-size:13px;line-height:20px;margin:0;color:var(--dsw-alias-label-tertiary)}",
      ".UIT_defaults{flex-direction:row;flex-wrap:wrap;gap:8px;display:flex}",
      ".UIT_tabs{flex-direction:row;flex-wrap:wrap;gap:8px;display:flex}",
      ".UIT_grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;display:grid}",
      ".UIT_card{font:inherit;cursor:pointer;text-align:left;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);padding:0;overflow:hidden;color:var(--dsw-alias-label-primary);transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}",
      ".UIT_card:hover{transform:translateY(-2px);border-color:var(--dsw-alias-border-l3);box-shadow:0 8px 24px rgba(0,0,0,.18)}",
      ".UIT_card[data-active=true]{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary)}",
      ".UIT_cardName{align-items:center;gap:7px;padding:10px 12px;font-size:13px;line-height:20px;display:flex;border-top:1px solid var(--dsw-alias-border-l1)}",
      ".UIT_accentDot{width:8px;height:8px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px rgba(127,127,127,.35)}",
      ".UIT_check{margin-left:auto;color:var(--dsw-alias-state-business-primary);flex:none;display:inline-flex}",
      ".UIT_bgRow{align-items:center;gap:10px;display:flex;flex-wrap:wrap}",
      ".UIT_range{flex:1;min-width:120px;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer;background:var(--dsw-alias-border-l2)}",
      ".UIT_range::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-brand-primary);cursor:pointer}",
      ".UIT_range::-moz-range-thumb{width:16px;height:16px;border:0;border-radius:50%;background:var(--dsw-alias-brand-primary);cursor:pointer}",
      ".UIT_opacityVal{font-variant-numeric:tabular-nums;font-size:12px;color:var(--dsw-alias-label-secondary);min-width:34px;text-align:right}",
      ".UIT_advCheck{appearance:none;-webkit-appearance:none;width:16px;height:16px;border-radius:4px;border:1.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-3);cursor:pointer;flex:none;display:grid;place-items:center;transition:background .12s ease,border-color .12s ease}",
      ".UIT_advCheck:hover{border-color:var(--dsw-alias-state-business-primary)}",
      ".UIT_advCheck:checked{background:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}",
      ".UIT_advCheck:checked::after{content:'';width:9px;height:5px;border:2px solid #fff;border-top:0;border-right:0;transform:rotate(-45deg) translateY(-1px)}",
      // 滑块开关（iOS 风格 toggle）：data-on=true 表示开
      ".UIT_switch{position:relative;width:40px;height:22px;border-radius:11px;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-border-l2);cursor:pointer;flex:none;padding:0;transition:background .16s ease,border-color .16s ease}",
      ".UIT_switch::after{content:'';position:absolute;top:1px;left:1px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.28);transition:transform .16s ease}",
      ".UIT_switch[data-on='true']{background:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}",
      ".UIT_switch[data-on='true']::after{transform:translateX(18px)}",
      ".UIT_resetBtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:22px;padding:0 12px;font:inherit;font-size:12px;line-height:1;cursor:pointer;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l3);border-radius:8px;transition:color .12s ease,border-color .12s ease}",
      ".UIT_resetBtn:hover{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}",
      ".UIT_resetBtn svg{flex:none}",
      ".UIT_kbdRow{display:flex;align-items:center;justify-content:space-between;gap:10px}",
      // 纸纹纹理叠加层：平铺 + multiply；纹路颜色由 backgroundColor × 纹理（background-blend-mode 由 JS 按 textureColor 控制）
      ".uit-texture-layer{position:fixed;inset:0;z-index:10;pointer-events:none;background-repeat:repeat;background-size:512px auto;mix-blend-mode:multiply;opacity:.14}",
      // 玻璃 UI（有背景图或玻璃质感 > 0 时启用）：表面 token 设成半透明，
      // 让壁纸从组件下方透出来。皮肤样式表（body[data-uit-preset]{...!important}）
      // 特异性 (0,1,1) 与旧玻璃规则相同、且在 head 中更靠后——若不加 (0,2,1) 的
      // 双属性选择器，皮肤会压过玻璃 → 表面不透明 → 壁纸完全被盖住（“看不见壁纸”）。
      // 颜色取自当前主题自身（--uit-c-* 由 JS 解析后写 body）；important 压过呈现器内联 token。
      "body[data-uit-glass-ui][data-uit-preset],body[data-uit-glass-ui]{--dsw-alias-bg-base:rgb(var(--uit-c-base)/calc(var(--uit-ga-b,var(--uit-ga)) * var(--uit-mm,1)))!important;--dsw-alias-bg-layer-1:rgb(var(--uit-c-layer1)/calc(var(--uit-ga-l1,var(--uit-ga)) * var(--uit-mm,1)))!important;--dsw-alias-bg-layer-2:rgb(var(--uit-c-layer2)/calc(var(--uit-ga-l2,var(--uit-ga)) * var(--uit-mm,1)))!important;--dsw-alias-bg-layer-3:rgb(var(--uit-c-layer3)/calc(var(--uit-ga-l3,var(--uit-ga)) * var(--uit-mm,1)))!important;--dsw-alias-bg-module-platform:rgb(var(--uit-c-module)/calc(var(--uit-ga-m,var(--uit-ga)) * var(--uit-mm,1)))!important;--dsw-specific-sidebar-fill:rgb(var(--uit-c-sidebar)/calc(var(--uit-ga-sb,var(--uit-ga)) * var(--uit-ms,1)))!important;--dsw-specific-bubble:rgb(var(--uit-c-bubble)/calc(var(--uit-ga-bb,var(--uit-ga)) * var(--uit-mc,1)))!important;--dsw-specific-input-major:rgb(var(--uit-c-input)/calc(var(--uit-ga-in,var(--uit-ga)) * var(--uit-mi,1)))!important;--dsw-specific-menu:rgb(var(--uit-c-menu)/calc(max(var(--uit-ga) + 0.5,0.74) * var(--uit-mc,1)))!important;--dsw-specific-selector:rgb(var(--uit-c-selector)/calc(max(var(--uit-ga) + 0.42,0.7) * var(--uit-mc,1)))!important;--dsw-specific-tip:rgb(var(--uit-c-tip)/calc(max(var(--uit-ga) + 0.42,0.7) * var(--uit-mc,1)))!important;--dsw-alias-tooltip-bg:rgb(var(--uit-c-tooltip)/calc(max(var(--uit-ga) + 0.55,0.8) * var(--uit-mc,1)))!important;--dsw-alias-markdown-code-block:rgb(var(--uit-c-code)/calc(var(--uit-ga-cd,var(--uit-ga)) * var(--uit-mm,1)))!important;--dsw-alias-markdown-inline-code:rgb(var(--uit-c-inline)/calc(var(--uit-ga-il,var(--uit-ga)) * var(--uit-mm,1)))!important}",
      "body[data-uit-glass-ui] [id='root']{background:transparent!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05),inset 0 1px 0 rgba(255,255,255,0.08)!important}",
      // 玻璃质感滑块：模饱和/亮度--uit-blur/--uit-sat/--uit-bri 连续驱动
      // （只root 上做 backdrop-filter，不碰各面板，避fixed 覆盖层被锁进侧边栏）
      "body[data-uit-glass-ui][data-uit-glass] [id='root']{backdrop-filter:blur(calc(var(--uit-blur) * 1px)) saturate(var(--uit-sat)) brightness(var(--uit-bri));-webkit-backdrop-filter:blur(calc(var(--uit-blur) * 1px)) saturate(var(--uit-sat)) brightness(var(--uit-bri))}",
      // 底部 composer 停靠区：普通状态用与页面同色的纯色底（无渐变带、无遮挡），
      // 有背景图时整块透明，图片一直透到最
      "body [class*='composerSeat']{background:var(--dsw-alias-bg-base)!important}",
      "body[data-uit-glass-ui] [class*='composerSeat']{background:transparent!important}",
      // 轨迹页：界面颜色与对话界面保持一致（层色跟随主背景色
      "body [class*='qBU-ya_root']{--dsw-alias-bg-layer-1:var(--dsw-alias-bg-base)!important;--dsw-alias-bg-layer-2:var(--dsw-alias-bg-base)!important}",
      // 轨迹页搜索框：与输入栏同色系（暖色输入面），不再用蓝灰层
      "body [class*='fV0t5q_search']{background:var(--dsw-specific-input-major)!important}",
      // 侧边栏设置按钮上方的滚动淡出渐变条：置为透明，不再出现一条色
      "body[data-uit-glass-ui] [class$='_fade'],body[data-uit-glass-ui] [class*='Fade']{background:transparent!important;background-image:none!important}",
      // 左上角鲸鱼图+ DeepSeek Harness 标志跟随主题强调色（仅预设主题激活时
      // 左上角鲸+ DeepSeek 跟随主题强调色；"Harness" 字母 = 桌面背景色（除爱橙外全部预设
      "body[data-uit-preset] [class$='_logoRow']{--dsw-alias-label-primary-inverted:var(--dsw-alias-bg-base)!important}",
      // 玻璃模式下 --dsw-alias-bg-base 被覆写成半透明，Harness 字母会跟着变透明甚至消失；
      // 但它坐在实心强调色徽章上，必须"反着来"——钉回实心的桌面背景色（--uit-c-base 三元组）
      "body[data-uit-glass-ui][data-uit-preset] [class$='_logoRow']{--dsw-alias-label-primary-inverted:rgb(var(--uit-c-base))!important}",
      "body[data-uit-preset] [class$='_logoRow'] [class*='brand']{color:var(--dsw-alias-state-business-primary)!important}",
      // 会话悬停状态卡片：官方硬编码深灰底+白字，预设主题下直接改底色与文字
      // （卡片被 portal body，用 :has 精确定位包裹 hoverContent 的卡片容器）
      "body[data-uit-preset][data-ds-dark-theme] *:has(> [class*='_hoverContent']){background:var(--dsw-specific-tip,#353638)!important}",
      "body[data-uit-preset]:not([data-ds-dark-theme]) *:has(> [class*='_hoverContent']){background:var(--dsw-specific-tip,#f3f5fb)!important}",
      "body[data-uit-preset] [class*='_hoverTitle'],body[data-uit-preset] [class*='_copied_']{color:var(--dsw-alias-label-primary)!important}",
      "body[data-uit-preset] [class*='_hoverPath'],body[data-uit-preset] [class*='_hoverTime']{color:var(--dsw-alias-label-secondary)!important}",
      "body[data-uit-preset] [class*='_hoverStatus']{color:var(--dsw-alias-label-tertiary)!important}",
      // 状态点“进行中”官方写deepseek 蓝，预设主题下改用主题强调色
      "body[data-uit-preset] [class*='_dot_'],body[data-uit-preset] [class*='_matrix_']{--dsh-state-ongoing:var(--dsw-alias-state-business-primary)!important}",
      // 统计栏触悬停时的 tooltip 气泡：底色用主题强调色，文字用强调色上的对比
      "body[data-uit-preset] [class*='_bubble_']{background:var(--dsw-alias-state-business-primary)!important;color:var(--dsw-alias-label-primary-foreground)!important}",
      // 背景图玻璃模式：触摸弹出tooltip 气泡液化为玻璃（明显玻璃感：+ 模糊 + 亮边
      "body[data-uit-glass-ui] [class*='_bubble_']{backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);border:1px solid rgba(255,255,255,0.25)!important;box-shadow:0 8px 24px rgba(0,0,0,0.18)!important}",
      "body[data-uit-glass-ui][data-uit-preset] [class*='_bubble_']{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 62%,transparent)!important}",
      // 设置面板不受滑块/遮盖影响：有图片玻璃时保持不透明主题
      "body[data-uit-glass-ui] [role='dialog']{--dsw-alias-bg-base:rgb(var(--uit-c-base)/calc(max(var(--uit-ga-b,var(--uit-ga)),0.5) * var(--uit-md,1)))!important;--dsw-alias-bg-layer-1:rgb(var(--uit-c-layer1)/calc(max(var(--uit-ga-l1,var(--uit-ga)),0.55) * var(--uit-md,1)))!important;--dsw-alias-bg-layer-2:rgb(var(--uit-c-base)/calc(max(var(--uit-ga-b,var(--uit-ga)),0.5) * var(--uit-md,1)))!important;--dsw-alias-bg-layer-3:rgb(var(--uit-c-base)/calc(max(var(--uit-ga-b,var(--uit-ga)),0.5) * var(--uit-md,1)))!important;--dsw-specific-menu:rgb(var(--uit-c-menu)/calc(0.86 * var(--uit-md,1)))!important;--dsw-specific-selector:rgb(var(--uit-c-selector)/calc(0.82 * var(--uit-md,1)))!important;--dsw-specific-sidebar-fill:rgb(var(--uit-c-sidebar)/calc(max(var(--uit-ga-sb,var(--uit-ga)),0.55) * var(--uit-md,1)))!important;--dsw-specific-bubble:rgb(var(--uit-c-bubble)/calc(max(var(--uit-ga-bb,var(--uit-ga)),0.55) * var(--uit-md,1)))!important;--dsw-specific-input-major:rgb(var(--uit-c-input)/calc(max(var(--uit-ga-in,var(--uit-ga)),0.55) * var(--uit-md,1)))!important;--dsw-alias-markdown-code-block:rgb(var(--uit-c-code)/calc(max(var(--uit-ga-cd,var(--uit-ga)),0.55) * var(--uit-md,1)))!important;--dsw-alias-markdown-inline-code:rgb(var(--uit-c-inline)/calc(max(var(--uit-ga-il,var(--uit-ga)),0.55) * var(--uit-md,1)))!important}",
      // 预设主题：设置面板复刻主界面的左右撞—左侧导航= 栏框色，右侧内容 = 主背景色
      "body[data-uit-preset] [role='dialog']{--dsw-alias-bg-layer-2:var(--dsw-alias-bg-base)!important;--dsw-alias-bg-layer-3:var(--dsw-alias-bg-base)!important}",
      "body[data-uit-preset] [role='dialog'] [class$='_nav']{background:var(--dsw-specific-sidebar-fill)!important;box-shadow:inset -1px 0 0 rgba(63,68,63,0.15)!important}",
      // 爱橙：爱马仕橙侧边栏用象牙字（设置面板打开时例外，面板右侧保持深色文字
      "body[data-uit-theme='hermes'] [class*='hHd-Xa_root']:not(:has([role='dialog'])){--dsw-alias-label-primary:#F7EDE2!important;--dsw-alias-label-secondary:#F2DFD0!important;--dsw-alias-label-tertiary:#E8CBB8!important;--dsw-alias-label-caption:#E8CBB8!important;color:#F7EDE2!important}",
      "body[data-uit-theme='hermes'] [role='dialog'] [class$='_nav']{--dsw-alias-label-primary:#F7EDE2!important;--dsw-alias-label-secondary:#F2DFD0!important;--dsw-alias-label-tertiary:#E8CBB8!important;--dsw-alias-label-caption:#E8CBB8!important;color:#F7EDE2!important}",
      // 橙香奶盖：鲸DeepSeek/徽章 = 强调色（与输送栏发送按键同色）
      // Harness 字母 = 主界面背景色（在强调色徽章上清晰可读
      "body[data-uit-theme='hermes']:not([data-ds-dark-theme]) [class$='_logoRow'] [class*='brand']{color:var(--dsw-alias-state-business-primary)!important}",
      "body[data-uit-theme='hermes']:not([data-ds-dark-theme]) [class$='_logoRow']{--dsw-alias-label-primary-inverted:var(--dsw-alias-bg-base)!important}",
      // 橙香奶盖：Cordis 弹出面板底色浅，面板内文字恢复深色（避免继承侧边栏象牙白看不清）
      "body[data-uit-theme='hermes'] [data-cordis-panel]{--dsw-alias-label-primary:#6A4D52!important;--dsw-alias-label-secondary:#634D51!important;--dsw-alias-label-tertiary:#6E5A5E!important;--dsw-alias-label-caption:#6E5A5E!important;color:#6A4D52!important}",
      // 海盐冰沙：青绿侧边栏配冰白文字（设置面板打开时例外，面板右侧保持深色文字）
      // 标志不再特殊处理：DeepSeek/鲸鱼 = 强调色、Harness 字母 = 桌面背景色，走通用规则
      "body[data-uit-theme='seasalt'] [class*='hHd-Xa_root']:not(:has([role='dialog'])){--dsw-alias-label-primary:#F2FCF9!important;--dsw-alias-label-secondary:#D3F2EA!important;--dsw-alias-label-tertiary:#B5E6DA!important;--dsw-alias-label-caption:#B5E6DA!important;color:#F2FCF9!important}",
      "body[data-uit-theme='seasalt'] [role='dialog'] [class$='_nav']{--dsw-alias-label-primary:#F2FCF9!important;--dsw-alias-label-secondary:#D3F2EA!important;--dsw-alias-label-tertiary:#B5E6DA!important;--dsw-alias-label-caption:#B5E6DA!important;color:#F2FCF9!important}",
      // Cordis 弹出面板在侧边栏 DOM 内（fixed 定位），会继承上面侧边栏的白色文token
      // 而面板底色是浅色 bg-base —面板内文字恢复为深色墨色，避免“太浅看不清
      "body[data-uit-theme='seasalt'] [data-cordis-panel]{--dsw-alias-label-primary:#20525C!important;--dsw-alias-label-secondary:#3D707B!important;--dsw-alias-label-tertiary:#5F8B95!important;--dsw-alias-label-caption:#5F8B95!important;color:#20525C!important}",
      // 大唐系列深色侧边栏：侧边栏文= 各预设的桌面背景色（不用白色），
      // 文字深浅：五分区手动滑块驱动 --uit-tm/ts/tc/ti/td（50=原色，<50 更浅，>50 更深）
      // 侧边栏：深侧栏预设用 --uit-ts（浅色基准），非玻璃时回退桌面背景色
      "body:is([data-uit-theme='shiqing'],[data-uit-theme='sancai'],[data-uit-theme='tuoling'],[data-uit-theme='luori'],[data-uit-theme='hutao'],[data-uit-theme='ziteng'],[data-uit-theme='jingui'],[data-uit-theme='lantian']) [class*='hHd-Xa_root']:not(:has([role='dialog'])){--dsw-alias-label-primary:var(--uit-ts,var(--dsw-alias-bg-base))!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--uit-ts,var(--dsw-alias-bg-base)) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--uit-ts,var(--dsw-alias-bg-base)) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--uit-ts,var(--dsw-alias-bg-base)) 62%,transparent)!important;color:var(--uit-ts,var(--dsw-alias-bg-base))!important}",
      "body:is([data-uit-theme='shiqing'],[data-uit-theme='sancai'],[data-uit-theme='tuoling'],[data-uit-theme='luori'],[data-uit-theme='hutao'],[data-uit-theme='ziteng'],[data-uit-theme='jingui'],[data-uit-theme='lantian']) [role='dialog'] [class$='_nav']{--dsw-alias-label-primary:var(--dsw-alias-bg-base)!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--dsw-alias-bg-base) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--dsw-alias-bg-base) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--dsw-alias-bg-base) 62%,transparent)!important;color:var(--dsw-alias-bg-base)!important}",
      // 玻璃模式下，所有预设（含浅侧栏）的侧边栏文字都走 --uit-ts（JS 按预设区分基准色）
      "body[data-uit-glass-ui][data-uit-preset] [class*='hHd-Xa_root']:not(:has([role='dialog'])){--dsw-alias-label-primary:var(--uit-ts)!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--uit-ts) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--uit-ts) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--uit-ts) 62%,transparent)!important;color:var(--uit-ts)!important}",
      // 主区（全局默认）文字深浅
      "body[data-uit-glass-ui][data-uit-preset]{--dsw-alias-label-primary:var(--uit-tm)!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--uit-tm) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--uit-tm) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--uit-tm) 62%,transparent)!important}",
      // 卡片文字深浅
      "body[data-uit-glass-ui][data-uit-preset] [class*='uV2eYG_card']{--dsw-alias-label-primary:var(--uit-tc)!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--uit-tc) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--uit-tc) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--uit-tc) 62%,transparent)!important}",
      // 输入区文字深浅
      "body[data-uit-glass-ui][data-uit-preset] [class*='composerSeat']{--dsw-alias-label-primary:var(--uit-ti)!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--uit-ti) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--uit-ti) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--uit-ti) 62%,transparent)!important}",
      // 设置面板文字深浅（左栏 nav 由上方规则保持浅色；这里降特异性让 nav 规则赢）
      "body[data-uit-glass-ui] [role='dialog']{--dsw-alias-label-primary:var(--uit-td)!important;--dsw-alias-label-secondary:color-mix(in srgb,var(--uit-td) 82%,transparent)!important;--dsw-alias-label-tertiary:color-mix(in srgb,var(--uit-td) 62%,transparent)!important;--dsw-alias-label-caption:color-mix(in srgb,var(--uit-td) 62%,transparent)!important}",
      // 文件夹图标不再单独改，保持官方默认（跟随强调色）
      // Cordis 弹出面板：浅色底上恢复各预设深色文字
      "body[data-uit-theme='sancai'] [data-cordis-panel]{--dsw-alias-label-primary:#4A3B33!important;--dsw-alias-label-secondary:#6B5B4F!important;--dsw-alias-label-tertiary:#8F7F6E!important;--dsw-alias-label-caption:#8F7F6E!important;color:#4A3B33!important}",
      "body[data-uit-theme='tuoling'] [data-cordis-panel]{--dsw-alias-label-primary:#3F3A39!important;--dsw-alias-label-secondary:#625B57!important;--dsw-alias-label-tertiary:#857E79!important;--dsw-alias-label-caption:#857E79!important;color:#3F3A39!important}",
      "body[data-uit-theme='luori'] [data-cordis-panel]{--dsw-alias-label-primary:#4E3B30!important;--dsw-alias-label-secondary:#6F5A4C!important;--dsw-alias-label-tertiary:#90796A!important;--dsw-alias-label-caption:#90796A!important;color:#4E3B30!important}",
      "body[data-uit-theme='hutao'] [data-cordis-panel]{--dsw-alias-label-primary:#4E3327!important;--dsw-alias-label-secondary:#6E5142!important;--dsw-alias-label-tertiary:#8F7364!important;--dsw-alias-label-caption:#8F7364!important;color:#4E3327!important}",
      "body[data-uit-theme='ziteng'] [data-cordis-panel]{--dsw-alias-label-primary:#4E3A4E!important;--dsw-alias-label-secondary:#6D586C!important;--dsw-alias-label-tertiary:#8D798B!important;--dsw-alias-label-caption:#8D798B!important;color:#4E3A4E!important}",
      "body[data-uit-theme='jingui'] [data-cordis-panel]{--dsw-alias-label-primary:#3E4527!important;--dsw-alias-label-secondary:#5E6442!important;--dsw-alias-label-tertiary:#7F8462!important;--dsw-alias-label-caption:#7F8462!important;color:#3E4527!important}",
      "body[data-uit-theme='lantian'] [data-cordis-panel]{--dsw-alias-label-primary:#2E3B2E!important;--dsw-alias-label-secondary:#4E5B4C!important;--dsw-alias-label-tertiary:#6F7B6C!important;--dsw-alias-label-caption:#6F7B6C!important;color:#2E3B2E!important}",
      "body[data-uit-theme='shiqing'] [data-cordis-panel]{--dsw-alias-label-primary:#334E62!important;--dsw-alias-label-secondary:#576F81!important;--dsw-alias-label-tertiary:#7A8F9E!important;--dsw-alias-label-caption:#7A8F9E!important;color:#334E62!important}",
      // 金桂竹影：Harness 保持背景色，徽章单独压深为深绿，保证 Harness 字母清晰
      "body[data-uit-theme='jingui'] [class$='_logoRow'] [class*='brand'] rect{fill:#1E5A34!important}",
      // Cordis Plugin 侧边栏入口：触摸/悬停颜色与设置、会话等其他侧边栏选项一致
      // 不挂 data-uit-preset 条件——非预设主题（默认深自定义）下也要一致
      // （官方把 Cordis 写死interactive-bg-hover-solid 实心灰，其它选项用的是半透明 interactive-bg-hover
      "body [data-cordis-badge]:hover{background:var(--dsw-alias-interactive-bg-hover)!important}",
      // Cordis Plugin 侧边栏入口：几何尺寸与设置按钮一致（34px、左右各外扩 4px
      // 外层 layer :has 定位；注layer flex 行容器里，必须显式写 calc 宽度
      // 只靠margin flex 下只会左移不会左右对称外扩。折叠轨道模式带 rail 类，不动
      "body :has(> :has(> [data-cordis-badge])):not([class*='rail']){width:calc(100% + 8px);height:34px;margin:4px -4px 0}",
      "body [data-cordis-badge]{height:34px}",
      ".UIT_mock{height:190px;display:flex;overflow:hidden;background:var(--dsw-alias-bg-base)}",
      ".UIT_mside{width:82px;flex:none;background:var(--dsw-specific-sidebar-fill);padding:10px 8px;flex-direction:column;gap:6px;display:flex;border-right:1px solid var(--dsw-alias-border-l1)}",
      ".UIT_mnewBtn{width:100%;height:22px;margin-bottom:2px;flex:none;border-radius:6px;background:var(--dsw-alias-button-elevated-fill);border:1px solid var(--dsw-alias-border-l1)}",
      ".UIT_mitem{height:16px;border-radius:8px;padding:0 6px;align-items:center;gap:5px;display:flex}",
      ".UIT_mitem[data-active=true]{background:var(--dsw-specific-sidebar-nav-item-active)}",
      ".UIT_mitem:not([data-active=true]):hover{background:var(--dsw-specific-sidebar-nav-item-hover)}",
      ".UIT_mdot{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-label-tertiary);flex:none}",
      ".UIT_mitem[data-active=true] .UIT_mdot{background:var(--dsw-alias-state-business-primary)}",
      ".UIT_mlabel{flex:1;height:5px;border-radius:2px;background:var(--dsw-alias-label-secondary);opacity:.75}",
      ".UIT_mmain{flex:1;min-width:0;flex-direction:column;display:flex;background:var(--dsw-alias-bg-base)}",
      ".UIT_mhead{height:30px;flex:none;align-items:center;gap:6px;padding:0 10px;border-bottom:1px solid var(--dsw-alias-border-l1);display:flex}",
      ".UIT_mtitle{flex:1;height:7px;border-radius:3px;background:var(--dsw-alias-label-primary);opacity:.8}",
      ".UIT_mheadTag{width:24px;height:14px;flex:none;border-radius:7px;background:var(--dsw-alias-state-business-primary);opacity:.28;border:1px solid var(--dsw-alias-state-business-primary)}",
      ".UIT_mbody{flex:1;min-height:0;padding:8px 10px;flex-direction:column;gap:6px;display:flex;overflow:hidden}",
      ".UIT_massistLine{align-self:flex-start;height:5px;border-radius:2px;background:var(--dsw-alias-label-primary);opacity:.85;max-width:86%}",
      ".UIT_massistLine[data-t=secondary]{background:var(--dsw-alias-label-secondary);width:60%}",
      ".UIT_muser{align-self:flex-end;width:44%;height:16px;border-radius:10px 10px 2px 10px;background:var(--dsw-alias-button-primary-fill)}",
      ".UIT_mfoot{height:30px;flex:none;align-items:center;gap:6px;padding:0 10px 10px;display:flex}",
      ".UIT_minputBar{flex:1;height:22px;border-radius:8px;background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l1)}",
      ".UIT_msendBtn{width:22px;height:22px;flex:none;border-radius:6px;background:var(--dsw-alias-button-primary-fill)}",
      ".UIT_thumb{width:44px;height:44px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);object-fit:cover;cursor:pointer;flex:none;background:var(--dsw-alias-bg-layer-2)}",
      ".UIT_thumbVideo{place-items:center;display:grid;color:var(--dsw-alias-label-secondary);cursor:default}",
      ".UIT_thumbWrap{position:relative;flex:none;display:inline-flex}",
      ".UIT_thumbClear{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0;box-shadow:0 1px 4px rgba(0,0,0,0.25)}",
      ".UIT_thumbClear:hover{background:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary);color:#fff}",
      ".UIT_wpRow{flex-direction:row;flex-wrap:wrap;gap:8px;display:flex}",
      ".UIT_wpHead{align-items:center;justify-content:space-between;gap:8px;display:flex;cursor:pointer;user-select:none}",
      ".UIT_wpThumb{width:76px;height:44px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);object-fit:cover;cursor:pointer;flex:none;background:var(--dsw-alias-bg-layer-2);transition:border-color .12s ease,transform .12s ease}",
      ".UIT_wpThumb:hover{transform:scale(1.05);border-color:var(--dsw-alias-border-l3)}",
      ".UIT_wpThumb[data-active=true]{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary)}",
      ".UIT_texNone{display:inline-block;background:linear-gradient(135deg,transparent 44%,var(--dsw-alias-border-l3) 44%,var(--dsw-alias-border-l3) 56%,transparent 56%) var(--dsw-alias-bg-layer-2)}",
      ".UIT_texSwatch{width:20px;height:20px;border-radius:50%;border:1px solid var(--dsw-alias-border-l3);cursor:pointer;flex:none;padding:0}",
      ".UIT_texSwatch[data-active=true]{box-shadow:0 0 0 2px var(--dsw-alias-state-business-primary)}",
      ".UIT_texSwatchOrig{background:linear-gradient(135deg,transparent 44%,var(--dsw-alias-border-l3) 44%,var(--dsw-alias-border-l3) 56%,transparent 56%) var(--dsw-alias-bg-layer-2)}",
      ".UIT_cropModal{width:min(640px,92vw)}",
      ".UIT_cropWrap{display:flex;justify-content:center;align-items:center}",
      ".UIT_cropStage{position:relative;display:inline-block;line-height:0;overflow:hidden}",
      ".UIT_cropImg{display:block;max-width:min(560px,80vw);max-height:56vh}",
      ".UIT_cropBox{position:absolute;cursor:move;box-shadow:0 0 0 9999px rgba(0,0,0,.55);border:2px solid #fff}",
      ".UIT_ch{position:absolute;width:12px;height:12px;background:#fff;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.35)}",
      ".UIT_ch-tl{left:-6px;top:-6px;cursor:nwse-resize}",
      ".UIT_ch-tr{right:-6px;top:-6px;cursor:nesw-resize}",
      ".UIT_ch-bl{left:-6px;bottom:-6px;cursor:nesw-resize}",
      ".UIT_ch-br{right:-6px;bottom:-6px;cursor:nwse-resize}",
    ].join("");

    function injectThemeCss(ctx) {
      const tagId = "dsh-theme-kit/ThemesSection.module.css";
      if (typeof document === "undefined" || document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]")) return;
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-theme-kit";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
      ctx.effect(() => () => tag.remove(), "theme-kit: theme css");
    }

    function readAndCompress(file, cb) {
      const isRaw = file.type === "image/gif" || /\.gif$/i.test(file.name || "") || file.type.startsWith("video/") || /\.mp4$/i.test(file.name || "");
      const reader = new FileReader();
      reader.onload = () => {
        // GIF / MP4：不压缩直接存原始 dataURL，保留动画
        if (isRaw) {
          cb(reader.result);
          return;
        }
        const img = new Image();
        img.onload = () => {
          const MAX = 1920;
          let w = img.naturalWidth, h = img.naturalHeight;
          if (w > MAX || h > MAX) {
            const r = Math.min(MAX / w, MAX / h);
            w = Math.round(w * r); h = Math.round(h * r);
          }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          cb(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function MiniPreview(props) {
      const { tokens } = props;
      return (0, react_jsx_runtime.jsxs)("div", {
        className: "UIT_mock",
        style: tokens,
        children: [
          (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_mside",
            children: [
              (0, react_jsx_runtime.jsx)("div", { className: "UIT_mnewBtn" }),
              (0, react_jsx_runtime.jsxs)("div", { className: "UIT_mitem", "data-active": "true", children: [
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_mdot" }),
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_mlabel" }),
              ] }),
              (0, react_jsx_runtime.jsxs)("div", { className: "UIT_mitem", children: [
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_mdot" }),
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_mlabel" }),
              ] }),
              (0, react_jsx_runtime.jsxs)("div", { className: "UIT_mitem", children: [
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_mdot" }),
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_mlabel" }),
              ] }),
            ],
          }),
          (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_mmain",
            children: [
              (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_mhead",
                children: [
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_mtitle" }),
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_mheadTag" }),
                ],
              }),
              (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_mbody",
                children: [
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_massistLine" }),
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_massistLine", "data-t": "secondary" }),
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_muser" }),
                ],
              }),
              (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_mfoot",
                children: [
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_minputBar" }),
                  (0, react_jsx_runtime.jsx)("div", { className: "UIT_msendBtn" }),
                ],
              }),
            ],
          }),
        ],
      });
    }

    function CropModal(props) {
      const { open, image, onClose, onApply, t } = props;
      const [crop, setCrop] = react.useState({ x: 10, y: 10, w: 80, h: 80 });
      const [dim, setDim] = react.useState(null);
      const imgRef = react.useRef(null);
      const dragRef = react.useRef(null);
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

      const onImgLoad = () => {
        const img = imgRef.current;
        const r = img.getBoundingClientRect();
        setDim({ nw: img.naturalWidth, nh: img.naturalHeight, rw: r.width, rh: r.height });
      };

      const onDown = (mode, corner, e) => {
        e.preventDefault();
        if (corner) e.stopPropagation();
        dragRef.current = { mode, corner, sx: e.clientX, sy: e.clientY, sc: { ...crop } };
        const move = (ev) => {
          const d = dragRef.current;
          if (!d || !dim) return;
          const dx = (ev.clientX - d.sx) / dim.rw * 100;
          const dy = (ev.clientY - d.sy) / dim.rh * 100;
          const s = d.sc, MIN = 8;
          if (d.mode === "move") {
            setCrop({ x: clamp(s.x + dx, 0, 100 - s.w), y: clamp(s.y + dy, 0, 100 - s.h), w: s.w, h: s.h });
          } else {
            let x = s.x, y = s.y, w = s.w, h = s.h;
            if (d.corner.indexOf("l") >= 0) { x = clamp(s.x + dx, 0, s.x + s.w - MIN); w = s.w + s.x - x; }
            if (d.corner.indexOf("r") >= 0) { w = clamp(s.w + dx, MIN, 100 - s.x); }
            if (d.corner.indexOf("t") >= 0) { y = clamp(s.y + dy, 0, s.y + s.h - MIN); h = s.h + s.y - y; }
            if (d.corner.indexOf("b") >= 0) { h = clamp(s.h + dy, MIN, 100 - s.y); }
            setCrop({ x, y, w, h });
          }
        };
        const up = () => {
          dragRef.current = null;
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
      };

      const apply = () => {
        if (!dim || !imgRef.current) return;
        const sx = crop.x / 100 * dim.nw, sy = crop.y / 100 * dim.nh;
        const sw = crop.w / 100 * dim.nw, sh = crop.h / 100 * dim.nh;
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(sw));
        canvas.height = Math.max(1, Math.round(sh));
        canvas.getContext("2d").drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        onApply(canvas.toDataURL("image/jpeg", 0.9));
      };

      return (0, react_jsx_runtime.jsx)(primitives.Modal, {
        open,
        onClose,
        title: t("cropTitle"),
        closeLabel: t("cropCancel"),
        className: "UIT_cropModal",
        children: (0, react_jsx_runtime.jsx)("div", {
          className: "UIT_cropWrap",
          children: (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_cropStage",
            children: [
              (0, react_jsx_runtime.jsx)("img", { ref: imgRef, src: image, onLoad: onImgLoad, className: "UIT_cropImg", draggable: false }),
              dim ? (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_cropBox",
                style: { left: crop.x + "%", top: crop.y + "%", width: crop.w + "%", height: crop.h + "%" },
                onPointerDown: (e) => onDown("move", "", e),
                children: [
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_ch UIT_ch-tl", onPointerDown: (e) => onDown("resize", "tl", e) }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_ch UIT_ch-tr", onPointerDown: (e) => onDown("resize", "tr", e) }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_ch UIT_ch-bl", onPointerDown: (e) => onDown("resize", "bl", e) }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_ch UIT_ch-br", onPointerDown: (e) => onDown("resize", "br", e) }),
                ],
              }) : null,
            ],
          }),
        }),
        footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
          children: [
            (0, react_jsx_runtime.jsx)(primitives.Button, { variant: "ghost", onClick: onClose, children: t("cropCancel") }),
            (0, react_jsx_runtime.jsx)(primitives.Button, { variant: "primary", onClick: () => { apply(); onClose(); }, children: t("cropApply") }),
          ],
        }),
      });
    }

    // 设置导航“主题与配色”的画板图标（外壳按 section id 写死图标，这里直接替DOM）
    // 参Edge 外观类设置图标：简洁圆角描+ 实心圆点.75 线宽
    const PALETTE_GLYPH =
      "<rect x='1.8' y='2.2' width='12.4' height='11.6' rx='2.6' fill='none' stroke='currentColor' stroke-width='1.75'/>" +
      "<circle cx='5.7' cy='6.3' r='1.3' fill='currentColor'/>" +
      "<circle cx='8' cy='9.7' r='1.3' fill='currentColor'/>" +
      "<circle cx='10.3' cy='6.3' r='1.3' fill='currentColor'/>";

    function ThemePanel(props) {
      const { t, getState, setTheme, setBackground, clearBackground, onChange } = props;
      const [state, setState] = react.useState(getState);
      const [bg, setBg] = react.useState(() => getState().background);
      const [activeGroup, setActiveGroup] = react.useState(() => {
        const g = PRESET_GROUPS.find((grp) => grp.themes.some((th) => th.id === getState().activePreset));
        return g ? g.id : PRESET_GROUPS[0].id;
      });
      const fileInput = react.useRef(null);
      const [cropOpen, setCropOpen] = react.useState(false);
      // 四个分组默认折叠：默认 / 自定义背景 / 预设主题 / 按键桌宠
      const [defaultOpen, setDefaultOpen] = react.useState(false);
      const [bgOpen, setBgOpen] = react.useState(false);
      const [presetOpen, setPresetOpen] = react.useState(false);
      const [kbdOpen, setKbdOpen] = react.useState(false);
      const [wpOpen, setWpOpen] = react.useState(false); // 使用预设：默认折叠，点开出现壁纸
      const [advOpen, setAdvOpen] = react.useState(false); // 高级：默认折叠，含手动分区透明度
      const [texOpen, setTexOpen] = react.useState(false); // 纹理：默认折叠，选纸纹纹理
      const [textDepthOpen, setTextDepthOpen] = react.useState(false); // 文字深浅：默认折叠，五分区手动文字深浅
      // 按键桌宠开关：读 localStorage（缺省=开），写时联动 kbdpet-toggle 事件
      const [kbdOn, setKbdOn] = react.useState(() => {
        try { return localStorage.getItem("kbdpet-enabled") !== "0"; } catch { return true; }
      });
      const onKbdPet = (v) => {
        setKbdOn(v);
        try {
          localStorage.setItem("kbdpet-enabled", v ? "1" : "0");
          window.dispatchEvent(new Event("kbdpet-toggle"));
        } catch { /* 忽略 */ }
      };

      react.useEffect(() => {
        return onChange(() => {
          setState(getState());
          setBg(getState().background);
        });
      }, [onChange, getState]);

      const snapshot = state.snapshot;
      const preference = snapshot.preference;
      const group = PRESET_GROUPS.find((g) => g.id === activeGroup) ?? PRESET_GROUPS[0];

      const defaults = [
        { id: "system", labelKey: "system", icon: primitives.IconFollowsystemOutline16 },
        { id: "light", labelKey: "light", icon: primitives.IconLightOutline16 },
        { id: "dark", labelKey: "dark", icon: primitives.IconDarkOutline16 },
      ];

      const onGlass = (v) => {
        setBg((prev) => ({ ...prev, glass: v }));
        setBackground({ glass: v });
      };
      const onTextureStrength = (v) => {
        setBg((prev) => ({ ...prev, textureStrength: v }));
        setBackground({ textureStrength: v });
      };
      const onPosition = (v) => {
        setBg((prev) => ({ ...prev, position: v }));
        setBackground({ position: v });
      };
      const onSize = (v) => {
        setBg((prev) => ({ ...prev, size: v }));
        setBackground({ size: v });
      };
      const posModes = [
        { id: "center", labelKey: "posCenter" },
        { id: "top", labelKey: "posTop" },
        { id: "bottom", labelKey: "posBottom" },
      ];
      const sizeModes = [
        { id: "cover", labelKey: "sizeCover" },
        { id: "contain", labelKey: "sizeContain" },
        { id: "auto", labelKey: "sizeAuto" },
      ];
      // 玻璃质感默认 50（液态）；遮盖程度已并入侧边栏滑块
      const DEFAULT_BG = { glass: 50 };
      // 重置只回玻璃滑块；清壁纸走预览图上的 ✕ 按钮
      const onReset = () => {
        setBg((prev) => ({ ...prev, ...DEFAULT_BG }));
        setBackground(DEFAULT_BG);
      };
      // 高级手动微调：开关 + 五个分区透明度（0..100）
      const ADV_ZONES = [
        { key: "main", labelKey: "advMain" },
        { key: "sidebar", labelKey: "advSide" },
        { key: "card", labelKey: "advCard" },
        { key: "input", labelKey: "advInput" },
        { key: "dialog", labelKey: "advDialog" },
      ];
      const onAdvManual = (v) => {
        setBg((prev) => ({ ...prev, manual: v }));
        setBackground({ manual: v });
      };
      const onAdvOpacity = (key, v) => {
        const cur = (getState().background.opacity) || {};
        const next = { ...cur, [key]: v };
        setBg((prev) => ({ ...prev, opacity: next }));
        setBackground({ opacity: next });
      };
      const onTextDepth = (key, v) => {
        const cur = (getState().background.textDepth) || {};
        const next = { ...cur, [key]: v };
        setBg((prev) => ({ ...prev, textDepth: next }));
        setBackground({ textDepth: next });
      };
      const onTextDepthReset = () => {
        const patch = { main: 50, sidebar: 50, card: 50, input: 50, dialog: 50 };
        setBg((prev) => ({ ...prev, textDepth: patch }));
        setBackground({ textDepth: patch });
      };
      const onAdvReset = () => {
        const patch = { manual: true, opacity: { main: 7, sidebar: 76, card: 50, input: 50, dialog: 80 } };
        setBg((prev) => ({ ...prev, ...patch }));
        setBackground(patch);
      };
      // 两条滑块共用的行：标+ 轨道（三个状态标记点已画进轨道背景）+ 百分
      const sliderRow = (labelKey, value, onChange) =>
        (0, react_jsx_runtime.jsxs)("div", {
          className: "UIT_bgRow",
          children: [
            (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t(labelKey) }),
            (0, react_jsx_runtime.jsx)("input", {
              className: "UIT_range",
              type: "range",
              min: 0,
              max: 100,
              value,
              onChange: (event) => onChange(parseInt(event.currentTarget.value, 10)),
            }),
            (0, react_jsx_runtime.jsx)("span", { className: "UIT_opacityVal", children: value + "%" }),
          ],
        });
      const onPickFile = (event) => {
        const file = event.currentTarget.files && event.currentTarget.files[0];
        event.currentTarget.value = "";
        if (!file) return;
        readAndCompress(file, (image) => {
          setBg((prev) => ({ ...prev, image }));
          setBackground({ image });
        });
      };
      // 视频背景判定：用户导入的 data:video/* 或「使用预设」的动态壁纸路由
      const isVideoBg = (v) => {
        const s = String(v || "");
        return s.startsWith("data:video/") || (/^\/dsh-theme-kit-wallpapers\/.*\.mp4$/i.test(s));
      };
      // 点选预设壁纸：动态=视频流 URL，普通=静态图 URL；preview 清空让视频首帧重新抽取
      const onPickWallpaper = (item) => {
        setBg((prev) => ({ ...prev, image: item.url, preview: "" }));
        setBackground({ image: item.url, preview: "" });
      };

      const themeCards = (themes) => themes.map((preset) => {
        const active = getState().activePreset === preset.id;
        return (0, react_jsx_runtime.jsxs)("button", {
          type: "button",
          className: "UIT_card",
          "data-active": active ? "true" : void 0,
          onClick: () => setTheme(preset.id),
          children: [
            (0, react_jsx_runtime.jsx)(MiniPreview, { tokens: preset.tokens }),
            (0, react_jsx_runtime.jsxs)("span", {
              className: "UIT_cardName",
              children: [
                (0, react_jsx_runtime.jsx)("span", { className: "UIT_accentDot", style: { background: preset.tokens["--dsw-alias-state-business-primary"] } }),
                t(preset.nameKey),
                active ? (0, react_jsx_runtime.jsx)("span", {
                  className: "UIT_check",
                  children: (0, react_jsx_runtime.jsx)(primitives.IconCheckOutline16, { size: 14 }),
                }) : null,
              ],
            }),
          ],
        }, preset.id);
      });

      return (0, react_jsx_runtime.jsxs)("div", {
        className: "UIT_section",
        children: [
          (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_group",
            children: [
              (0, react_jsx_runtime.jsxs)("h3", {
                className: "UIT_groupTitle UIT_foldTitle",
                onClick: () => setDefaultOpen((v) => !v),
                children: [
                  (0, react_jsx_runtime.jsx)("span", { children: t("defaultTitle") }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: defaultOpen ? "▾" : "▸" }),
                ],
              }),
              defaultOpen ? (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_defaults",
                children: defaults.map((opt) =>
                  (0, react_jsx_runtime.jsx)(primitives.Pill, {
                    active: preference === opt.id,
                    onClick: () => setTheme(opt.id),
                    children: [(0, react_jsx_runtime.jsx)(opt.icon, { size: 14 }), t(opt.labelKey)],
                  }, opt.id)
                ),
              }) : null,
            ],
          }),
          (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_group",
            children: [
              (0, react_jsx_runtime.jsxs)("h3", {
                className: "UIT_groupTitle UIT_foldTitle",
                onClick: () => setKbdOpen((v) => !v),
                children: [
                  (0, react_jsx_runtime.jsx)("span", { children: t("kbdpet") }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: kbdOpen ? "▾" : "▸" }),
                ],
              }),
              kbdOpen ? (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_kbdRow",
                children: [
                  (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("kbdOn") }),
                  (0, react_jsx_runtime.jsx)("button", {
                    type: "button",
                    className: "UIT_switch",
                    "data-on": kbdOn ? "true" : "false",
                    "aria-label": t("kbdpet"),
                    onClick: () => onKbdPet(!kbdOn),
                  }),
                ],
              }) : null,
              kbdOpen ? (0, react_jsx_runtime.jsxs)("div", {
                className: "UIT_kbdRow",
                children: [
                  (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("kbdReset") }),
                  (0, react_jsx_runtime.jsx)("button", {
                    type: "button",
                    className: "UIT_resetBtn",
                    "aria-label": t("kbdReset"),
                    title: t("kbdReset"),
                    onClick: () => { try { window.dispatchEvent(new Event("kbdpet-reset")) } catch (e) {} },
                    children: (0, react_jsx_runtime.jsx)("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, children: (0, react_jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" }) }),
                  }),
                ],
              }) : null,
            ],
          }),
          (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_group",
            children: [
              (0, react_jsx_runtime.jsxs)("h3", {
                className: "UIT_groupTitle UIT_foldTitle",
                onClick: () => setBgOpen((v) => !v),
                children: [
                  (0, react_jsx_runtime.jsx)("span", { children: t("bgTitle") }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: bgOpen ? "▾" : "▸" }),
                ],
              }),
              bgOpen ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                children: [
                  (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_bgRow",
                    children: [
                  (0, react_jsx_runtime.jsx)(primitives.Button, {
                    variant: "outline",
                    size: "sm",
                    icon: (0, react_jsx_runtime.jsx)(primitives.IconPaperclipOutline16, {}),
                    onClick: () => fileInput.current && fileInput.current.click(),
                    children: t("bgImport"),
                  }),
                  bg.image && String(bg.image).startsWith("data:") ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                    children: [
                      (0, react_jsx_runtime.jsx)(primitives.Button, {
                        variant: "ghost",
                        size: "sm",
                        icon: (0, react_jsx_runtime.jsx)(primitives.IconEditOutline16, {}),
                        onClick: () => setCropOpen(true),
                        children: t("cropTitle"),
                      }),
                    ],
                  }) : null,
                  (0, react_jsx_runtime.jsx)(primitives.Button, {
                    variant: "ghost",
                    size: "sm",
                    onClick: onReset,
                    children: t("bgReset"),
                  }),
                  bg.image ? (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_thumbWrap",
                    children: [
                      isVideoBg(bg.image)
                        ? (bg.preview
                          ? (0, react_jsx_runtime.jsx)("img", { className: "UIT_thumb", src: bg.preview, alt: "", title: t("cropTitle") })
                          : (0, react_jsx_runtime.jsx)("div", { className: "UIT_thumb UIT_thumbVideo", children: "▶" }))
                        : (0, react_jsx_runtime.jsx)("img", {
                          className: "UIT_thumb",
                          src: bg.image,
                          alt: "",
                          title: t("cropTitle"),
                          onClick: () => setCropOpen(true),
                        }),
                      (0, react_jsx_runtime.jsx)("button", {
                        type: "button",
                        className: "UIT_thumbClear",
                        title: t("bgClear"),
                        "aria-label": t("bgClear"),
                        onClick: () => { setBg((prev) => ({ ...prev, image: "", preview: "" })); setBackground({ image: "", preview: "" }); },
                        children: "✕",
                      }),
                    ],
                  }) : null,
                ],
              }),
              (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                children: [
                  (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_wpHead",
                    onClick: () => setWpOpen((v) => !v),
                    children: [
                      (0, react_jsx_runtime.jsx)("span", {
                        style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" },
                        children: t("wpTitle"),
                      }),
                      (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: wpOpen ? "▾" : "▸" }),
                    ],
                  }),
                  wpOpen ? WALLPAPER_GROUPS.map((g) =>
                    (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                      children: [
                        (0, react_jsx_runtime.jsx)("span", {
                          style: { fontSize: "11px", color: "var(--dsw-alias-label-tertiary)" },
                          children: t(g.nameKey),
                        }),
                        (0, react_jsx_runtime.jsx)("div", {
                          className: "UIT_wpRow",
                          children: g.items.map((it) =>
                            (0, react_jsx_runtime.jsx)("img", {
                              key: it.id,
                              className: "UIT_thumb UIT_wpThumb",
                              "data-active": bg.image === it.url ? "true" : void 0,
                              src: it.thumb,
                              alt: it.label,
                              title: it.label,
                              loading: "lazy",
                              onClick: () => onPickWallpaper(it),
                            })
                          ),
                        }, g.id),
                      ],
                    }, g.id)
                  ) : null,
                ],
              }),
              (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                children: [
                  (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_wpHead",
                    onClick: () => setAdvOpen((v) => !v),
                    children: [
                      (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("advTitle") }),
                      (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: advOpen ? "▾" : "▸" }),
                    ],
                  }),
                  advOpen ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                    children: [
                      (0, react_jsx_runtime.jsxs)("div", {
                        className: "UIT_bgRow",
                        children: [
                          (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("advManual") }),
                          (0, react_jsx_runtime.jsx)("button", {
                            type: "button",
                            className: "UIT_switch",
                            "data-on": bg.manual ? "true" : "false",
                            onClick: () => onAdvManual(!bg.manual),
                          }),
                          (0, react_jsx_runtime.jsx)(primitives.Button, {
                            variant: "ghost",
                            size: "sm",
                            onClick: onAdvReset,
                            children: t("bgReset"),
                          }),
                        ],
                      }),
                      (bg.image) ? sliderRow("glassTitle", bg.glass ?? 50, onGlass) : null,
                      bg.manual ? ADV_ZONES.map((z) => sliderRow(z.labelKey, bg.opacity ? bg.opacity[z.key] : 50, (v) => onAdvOpacity(z.key, v))) : null,
                    ],
                  }) : null,
                ],
              }),
              (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                children: [
                  (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_wpHead",
                    onClick: () => setTexOpen((v) => !v),
                    children: [
                      (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("texTitle") }),
                      (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: texOpen ? "▾" : "▸" }),
                    ],
                  }),
                  texOpen ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                    children: [
                      (0, react_jsx_runtime.jsxs)("div", {
                        className: "UIT_wpRow",
                        children: [
                          (0, react_jsx_runtime.jsx)("div", {
                            className: "UIT_thumb UIT_wpThumb UIT_texNone",
                            "data-active": !bg.texture ? "true" : void 0,
                            title: t("texNone"),
                            onClick: () => { setBg((prev) => ({ ...prev, texture: "" })); setBackground({ texture: "" }); },
                          }),
                          TEXTURES.map((tex) => (0, react_jsx_runtime.jsx)("img", {
                            key: tex.id,
                            className: "UIT_thumb UIT_wpThumb",
                            "data-active": bg.texture === tex.id ? "true" : void 0,
                            src: tex.url,
                            alt: tex.label,
                            title: tex.label,
                            loading: "lazy",
                            onClick: () => { setBg((prev) => ({ ...prev, texture: tex.id, textureStrength: tex.defaultStrength })); setBackground({ texture: tex.id, textureStrength: tex.defaultStrength }); },
                          })),
                        ],
                      }),
                      bg.texture ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                        children: [
                          sliderRow("texStrength", bg.textureStrength ?? 14, onTextureStrength),
                          (0, react_jsx_runtime.jsxs)("div", {
                            className: "UIT_bgRow",
                            children: [
                              (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("texColor") }),
                              TEXTURE_COLORS.map((c) => (0, react_jsx_runtime.jsx)("button", {
                                key: c.id || "orig",
                                type: "button",
                                className: "UIT_texSwatch" + (c.color ? "" : " UIT_texSwatchOrig"),
                                "data-active": (bg.textureColor || "") === c.id ? "true" : void 0,
                                title: c.label,
                                style: c.color ? { background: c.color } : void 0,
                                onClick: () => { setBg((prev) => ({ ...prev, textureColor: c.id })); setBackground({ textureColor: c.id }); },
                              })),
                            ],
                          }),
                        ],
                      }) : null,
                    ],
                  }) : null,
                ],
              }),
              (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                children: [
                  (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_wpHead",
                    onClick: () => setTextDepthOpen((v) => !v),
                    children: [
                      (0, react_jsx_runtime.jsx)("span", { style: { fontSize: "12px", color: "var(--dsw-alias-label-secondary)" }, children: t("textDepthTitle") }),
                      (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: textDepthOpen ? "▾" : "▸" }),
                    ],
                  }),
                  textDepthOpen ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                    children: [
                      ...ADV_ZONES.map((z) => sliderRow(z.labelKey, bg.textDepth ? bg.textDepth[z.key] : 50, (v) => onTextDepth(z.key, v))),
                      (0, react_jsx_runtime.jsx)(primitives.Button, { variant: "ghost", size: "sm", onClick: onTextDepthReset, children: t("bgReset") }),
                    ],
                  }) : null,
                ],
              }),
              (0, react_jsx_runtime.jsx)("input", {
                ref: fileInput,
                type: "file",
                accept: "image/*,video/mp4,video/webm",
                style: { display: "none" },
                onChange: onPickFile,
              }),
              (0, react_jsx_runtime.jsx)(CropModal, {
                open: cropOpen,
                image: bg.image,
                onClose: () => setCropOpen(false),
                onApply: (cropped) => { setBg((prev) => ({ ...prev, image: cropped })); setBackground({ image: cropped }); },
                t,
              }),
                ],
              }) : null,
            ],
          }),
          (0, react_jsx_runtime.jsxs)("div", {
            className: "UIT_group",
            children: [
              (0, react_jsx_runtime.jsxs)("h3", {
                className: "UIT_groupTitle UIT_foldTitle",
                onClick: () => setPresetOpen((v) => !v),
                children: [
                  (0, react_jsx_runtime.jsx)("span", { children: t("presetTitle") }),
                  (0, react_jsx_runtime.jsx)("span", { className: "UIT_foldChevron", children: presetOpen ? "▾" : "▸" }),
                ],
              }),
              presetOpen ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                children: [
                  (0, react_jsx_runtime.jsxs)("div", {
                    className: "UIT_tabs",
                    children: PRESET_GROUPS.map((g) =>
                      (0, react_jsx_runtime.jsx)(primitives.Pill, {
                        active: activeGroup === g.id,
                        onClick: () => setActiveGroup(g.id),
                        children: t(g.nameKey),
                      }, g.id)
                    ),
                  }),
                  (0, react_jsx_runtime.jsx)("div", {
                    className: "UIT_grid",
                    children: themeCards(group.themes),
                  }),
                ],
              }) : null,
            ],
          }),
        ],
      });
    }

    const inject = ["theme", "slots", "locale", "remote", "timer"];

    // ======================================================================
    // 键盘桌宠（keyboard-pet）—— 合并自 keyboard-pet-client.js
    // ======================================================================
    function applyKeyboardPet(ctx, React, styles) {
    // ======================================================================
    // 1. CONFIG — 集中配置层
    // ======================================================================
    const CONFIG = {
      seed: 20260815,            // 手绘抖动随机种子（保持各版本一致）
      headroom: 76,              // 键盘上方气泡净空高度
      minScale: 0.5,
      maxScale: 2.0,
      storeKey: 'kbdpet-state-v1',   // 几何状态（位置/缩放/最小化）
      enableKey: 'kbdpet-enabled',   // 键盘组件开关标志
      enableEvent: 'kbdpet-toggle',  // 同标签页联动事件名
      slotOrder: 40,
      flashMs: 170,              // 按键高亮时长
      faceMs: 750,               // 表情持续时间
      faceClearMs: 800,          // 表情清除定时
      bubbleHoldMs: 850,         // 气泡进入->退场切换点
      bubbleOutMs: 1150,         // 气泡完全移除
      fxLifeMs: 1150,            // 贴纸特效生命周期
      fxMax: 40,                 // 同屏贴纸上限
      decalsSpaceEnter: 3,       // 空格/回车每次贴纸数
      decalsNormal: 2,           // 普通按键每次贴纸数
      winkChance: 0.10,          // 普通按键随机 wink 概率
      coolChance: 0.14,          // 普通按键随机 cool 概率
      burstRecentMs: 800,        // burst 表情：近 N 毫秒计数窗口
      burstCount: 5,
      dizzyRecentMs: 1000,       // dizzy 表情：近 N 毫秒计数窗口
      dizzyCount: 10,
      idleSleepyMs: 12000,       // 空闲多久进入 sleepy
      idleCheckMs: 2500          // 空闲检查周期
    }

    // ======================================================================
    // 2. THEME — 主题层
    // ======================================================================
    function createTheme() {
      return {
        font: "'Segoe Print','Comic Sans MS','Segoe UI',sans-serif",
        pal: {
          alpha: { fill: '#FFFFFF', line: '#8FA796', text: '#46594C', pressed: '#E9F2EB' },
          mod: { fill: '#DCEFE2', line: '#7FA88F', text: '#3F6B50', pressed: '#C3E3CF' },
          nav: { fill: '#DFEBF7', line: '#8FA8C4', text: '#3F5A7E', pressed: '#C8DCF0' },
          accent: { fill: '#FFCFC0', line: '#C97F6B', text: '#7C3B2A', pressed: '#F9B6A1' }
        },
        paper: '#F3F8F1',
        frameLine: '#A9BEA6',
        sub: '#9AA692',
        face: '#46594C',
        decalColors: ['#F7B7AE', '#F6D977', '#A8D5BA', '#A9C6EC', '#C9B8E8', '#F4A79C'],
        decalTypes: ['flower', 'candy', 'grass', 'star', 'heart', 'leaf', 'balloon', 'cherry', 'clover', 'cookie', 'music', 'cloud']
      }
    }

    // ======================================================================
    // 3. GEOMETRY — 几何层
    // ======================================================================
    function mulberry(seed) {
      let s = seed >>> 0
      return function () {
        s = (s + 0x6D2B79F5) >>> 0
        let t = s
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }

    function wobble(x, y, w, h, r, rnd) {
      const pts = []
      function edge(ax, ay, bx, by) {
        const dist = Math.hypot(bx - ax, by - ay)
        const n = Math.max(1, Math.floor(dist / 9))
        for (let i = 0; i < n; i++) {
          const t = i / n
          pts.push([ax + (bx - ax) * t, ay + (by - ay) * t])
        }
      }
      function arc(cx, cy, a0, a1) {
        const n = Math.max(2, Math.floor(Math.abs(a1 - a0) * r / 3.2) + 1)
        for (let i = 0; i < n; i++) {
          const a = a0 + (a1 - a0) * i / n
          pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
        }
      }
      edge(x + r, y, x + w - r, y)
      arc(x + w - r, y + r, -Math.PI / 2, 0)
      edge(x + w, y + r, x + w, y + h - r)
      arc(x + w - r, y + h - r, 0, Math.PI / 2)
      edge(x + w - r, y + h, x + r, y + h)
      arc(x + r, y + h - r, Math.PI / 2, Math.PI)
      edge(x, y + h - r, x, y + r)
      arc(x + r, y + r, Math.PI, Math.PI * 3 / 2)
      pts.push([x + r, y])
      return 'M ' + pts.map(p => (p[0] + (rnd() * 2 - 1)).toFixed(2) + ',' + (p[1] + (rnd() * 2 - 1)).toFixed(2)).join(' L ') + ' Z'
    }

    function createGeometry(rnd) {
      const U = 20, P = 12, GAP = 3, R = 6
      const Y0 = 0, Y1 = 1.4, Y2 = 2.4, Y3 = 3.4, Y4 = 4.4, Y5 = 5.4
      const TW = 18.25
      const W = P * 2 + TW * U
      const H = P * 2 + 6.4 * U
      const HEADROOM = CONFIG.headroom
      const HT = H + HEADROOM

      const KEYS = []
      function add(id, xu, yu, wu, label, kw) {
        const k = Object.assign({ id, xu, yu, wu, label, kind: 'alpha', hu: 1 }, kw || {})
        KEYS.push(k)
      }
      add('Esc', 0, Y0, 1, 'Esc', { kind: 'accent', size: 8 })
      ;['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].forEach((f, i) =>
        add(f, [1.5, 2.5, 3.5, 4.5, 6, 7, 8, 9, 10.5, 11.5, 12.5, 13.5][i], Y0, 1, f, { kind: 'mod', size: 7 }))
      add('PrtSc', 15.25, Y0, 1, 'PrtSc', { kind: 'mod', size: 5.5 })
      add('ScrLk', 16.25, Y0, 1, 'ScrLk', { kind: 'mod', size: 5.5 })
      add('Pause', 17.25, Y0, 1, 'Pause', { kind: 'mod', size: 5.5 })
      add('Backtick', 0, Y1, 1, '`')
      ;['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].forEach((d, i) => add(d, i + 1, Y1, 1, d))
      add('Backspace', 13, Y1, 2, '\u232B', { kind: 'mod', size: 9 })
      add('Tab', 0, Y2, 1.5, 'Tab', { kind: 'mod', size: 7 })
      ;['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].forEach((c, i) => add(c, 1.5 + i, Y2, 1, c))
      add('BracketLeft', 11.5, Y2, 1, '[')
      add('BracketRight', 12.5, Y2, 1, ']')
      add('Backslash', 13.5, Y2, 1.5, '\\', { kind: 'mod', size: 9 })
      add('Caps', 0, Y3, 1.75, 'Caps', { kind: 'mod', size: 6.5 })
      ;['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].forEach((c, i) => add(c, 1.75 + i, Y3, 1, c, { bump: c === 'F' || c === 'J' }))
      add('Semicolon', 10.75, Y3, 1, ';')
      add('Quote', 11.75, Y3, 1, "'")
      add('Enter', 12.75, Y3, 2.25, '\u23CE', { kind: 'mod', size: 9 })
      add('LShift', 0, Y4, 2.25, '\u21E7', { kind: 'mod', size: 9 })
      ;['Z', 'X', 'C', 'V', 'B', 'N', 'M'].forEach((c, i) => add(c, 2.25 + i, Y4, 1, c))
      add('Comma', 9.25, Y4, 1, ',')
      add('Period', 10.25, Y4, 1, '.')
      add('Slash', 11.25, Y4, 1, '/')
      add('RShift', 12.25, Y4, 2.75, '\u21E7', { kind: 'mod', size: 9 })
      add('LCtrl', 0, Y5, 1.25, 'Ctrl', { kind: 'mod', size: 6.5 })
      add('LWin', 1.25, Y5, 1.25, 'Win', { kind: 'mod', size: 6.5 })
      add('LAlt', 2.5, Y5, 1.25, 'Alt', { kind: 'mod', size: 6.5 })
      add('Space', 3.75, Y5, 6.25, '', { kind: 'alpha' })
      add('RAlt', 10, Y5, 1.25, 'Alt', { kind: 'mod', size: 6.5 })
      add('RWin', 11.25, Y5, 1.25, 'Win', { kind: 'mod', size: 6.5 })
      add('Menu', 12.5, Y5, 1.25, 'Menu', { kind: 'mod', size: 5.5 })
      add('RCtrl', 13.75, Y5, 1.25, 'Ctrl', { kind: 'mod', size: 6.5 })
      add('Ins', 15.25, Y1, 1, 'Ins', { kind: 'nav', size: 6 })
      add('Home', 16.25, Y1, 1, 'Home', { kind: 'nav', size: 6 })
      add('PgUp', 17.25, Y1, 1, 'PgUp', { kind: 'nav', size: 5.5 })
      add('Del', 15.25, Y2, 1, 'Del', { kind: 'nav', size: 6 })
      add('End', 16.25, Y2, 1, 'End', { kind: 'nav', size: 6 })
      add('PgDn', 17.25, Y2, 1, 'PgDn', { kind: 'nav', size: 5.5 })
      add('Up', 16.25, Y4, 1, '\u2191', { kind: 'accent', size: 11 })
      add('Left', 15.25, Y5, 1, '\u2190', { kind: 'accent', size: 11 })
      add('Down', 16.25, Y5, 1, '\u2193', { kind: 'accent', size: 11 })
      add('Right', 17.25, Y5, 1, '\u2192', { kind: 'accent', size: 11 })

      for (const k of KEYS) {
        k.x = P + k.xu * U + GAP / 2
        k.y = P + k.yu * U + GAP / 2
        k.w = k.wu * U - GAP
        k.h = k.hu * U - GAP
        k.cx = k.x + k.w / 2
        k.cy = k.y + k.h / 2
        k.rot = (rnd() * 2 - 1) * 1.2
        const dx = (rnd() * 2 - 1) * 1.1
        const dy = (rnd() * 2 - 1) * 1.1
        k.d = wobble(k.x + dx, k.y + dy, k.w, k.h, R, rnd)
      }
      const BG_D = wobble(4, 4, W - 8, H - 8, 16, rnd)
      const KEY_BY_ID = {}
      for (const k of KEYS) KEY_BY_ID[k.id] = k
      return { keys: KEYS, bgPath: BG_D, byId: KEY_BY_ID, W, H, HT, HEADROOM, U }
    }

    // ======================================================================
    // 4. INPUT — 输入映射层
    // ======================================================================
    function createKeyMaps() {
      const MOD_CODES = {
        ShiftLeft: 'LShift', ShiftRight: 'RShift',
        ControlLeft: 'LCtrl', ControlRight: 'RCtrl',
        AltLeft: 'LAlt', AltRight: 'RAlt',
        MetaLeft: 'LWin', MetaRight: 'RWin'
      }
      const FLASH_CODES = {}
      for (let i = 0; i < 26; i++) FLASH_CODES['Key' + String.fromCharCode(65 + i)] = String.fromCharCode(65 + i)
      for (let i = 0; i <= 9; i++) FLASH_CODES['Digit' + i] = String(i)
      Object.assign(FLASH_CODES, {
        Minus: '-', Equal: '=', Backquote: '`', BracketLeft: '[', BracketRight: ']', Backslash: '\\',
        Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/',
        Space: 'Space', Enter: 'Enter', Tab: 'Tab', CapsLock: 'Caps',
        Escape: 'Esc', Backspace: 'Backspace', Delete: 'Del', Home: 'Home', End: 'End',
        PageUp: 'PgUp', PageDown: 'PgDn', ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
        PrintScreen: 'PrtSc', ScrollLock: 'ScrLk', Pause: 'Pause'
      })
      for (let i = 1; i <= 12; i++) FLASH_CODES['F' + i] = 'F' + i

      const PRETTY = {
        Backtick: '`', Backspace: '\u232B', Enter: '\u23CE', Space: 'Space',
        LShift: 'Shift', RShift: 'Shift', LCtrl: 'Ctrl', RCtrl: 'Ctrl',
        LAlt: 'Alt', RAlt: 'Alt', LWin: 'Win', RWin: 'Win',
        Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/',
        BracketLeft: '[', BracketRight: ']', Backslash: '\\'
      }
      function pretty(id) {
        if (PRETTY[id] !== undefined) return PRETTY[id]
        return id
      }
      return { modCodes: MOD_CODES, flashCodes: FLASH_CODES, pretty }
    }

    // ======================================================================
    // 5. PERSISTENCE — 状态层
    // ======================================================================
    function createStore(key) {
      function load() {
        try {
          if (typeof window === 'undefined' || !window.localStorage) return null
          const raw = window.localStorage.getItem(key)
          if (!raw) return null
          const s = JSON.parse(raw)
          if (typeof s === 'object' && s !== null) return s
          return null
        } catch (err) { return null }
      }
      function save(s) {
        try {
          if (typeof window === 'undefined' || !window.localStorage) return
          window.localStorage.setItem(key, JSON.stringify(s))
        } catch (err) {}
      }
      return { load, save }
    }

    // 开关标志：读 localStorage，监听跨标签页 storage 事件 + 同页自定义事件
    function createEnableFlag(key, eventName) {
      function read() {
        try {
          if (typeof window === 'undefined' || !window.localStorage) return true
          return window.localStorage.getItem(key) !== '0'
        } catch (err) { return true }
      }
      function subscribe(fn) {
        if (typeof window === 'undefined') return () => {}
        const onStorage = e => { if (e.key === key) fn(read()) }
        const onCustom = () => fn(read())
        window.addEventListener('storage', onStorage)
        window.addEventListener(eventName, onCustom)
        return () => {
          window.removeEventListener('storage', onStorage)
          window.removeEventListener(eventName, onCustom)
        }
      }
      return { read, subscribe }
    }

    // ======================================================================
    // 6. ART — 素材层
    // ======================================================================
    function sparkleD(cx, cy, r) {
      return 'M ' + cx + ' ' + (cy - r) + ' Q ' + (cx + r * 0.18) + ' ' + (cy - r * 0.18) + ' ' + (cx + r) + ' ' + cy +
        ' Q ' + (cx + r * 0.18) + ' ' + (cy + r * 0.18) + ' ' + cx + ' ' + (cy + r) +
        ' Q ' + (cx - r * 0.18) + ' ' + (cy + r * 0.18) + ' ' + (cx - r) + ' ' + cy +
        ' Q ' + (cx - r * 0.18) + ' ' + (cy - r * 0.18) + ' ' + cx + ' ' + (cy - r) + ' Z'
    }
    function heartD(cx, cy, s) {
      return 'M ' + cx + ' ' + (cy + s * 0.9) +
        ' C ' + (cx - s * 1.15) + ' ' + (cy - s * 0.1) + ' ' + (cx - s * 0.85) + ' ' + (cy - s * 0.95) + ' ' + cx + ' ' + (cy - s * 0.3) +
        ' C ' + (cx + s * 0.85) + ' ' + (cy - s * 0.95) + ' ' + (cx + s * 1.15) + ' ' + (cy - s * 0.1) + ' ' + cx + ' ' + (cy + s * 0.9) + ' Z'
    }

    function createArt(theme) {
      function decalKids(type, s, color) {
        const kids = []
        if (type === 'flower') {
          for (let i = 0; i < 5; i++) {
            const a = i * Math.PI * 2 / 5
            kids.push(React.createElement('circle', { cx: (Math.cos(a) * 4.6 * s).toFixed(1), cy: (Math.sin(a) * 4.6 * s).toFixed(1), r: (2.7 * s).toFixed(1), fill: color }))
          }
          kids.push(React.createElement('circle', { r: (2.3 * s).toFixed(1), fill: '#F6D977' }))
        } else if (type === 'candy') {
          kids.push(React.createElement('ellipse', { rx: (6 * s).toFixed(1), ry: (4.5 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('path', { d: 'M ' + (-6 * s) + ' 0 L ' + (-10 * s) + ' ' + (-4.5 * s) + ' L ' + (-10 * s) + ' ' + (4.5 * s) + ' Z', fill: '#FFFFFF', opacity: 0.9 }))
          kids.push(React.createElement('path', { d: 'M ' + (6 * s) + ' 0 L ' + (10 * s) + ' ' + (-4.5 * s) + ' L ' + (10 * s) + ' ' + (4.5 * s) + ' Z', fill: '#FFFFFF', opacity: 0.9 }))
          kids.push(React.createElement('path', { d: 'M ' + (-6 * s) + ' 0 Q 0 ' + (-5 * s) + ' ' + (6 * s) + ' 0', fill: 'none', stroke: '#FFFFFF', strokeWidth: 1.4, opacity: 0.95 }))
        } else if (type === 'grass') {
          for (const bl of [[-4, -11, -2.5], [0, -14, 0], [4, -10, 2.5]]) {
            kids.push(React.createElement('path', { d: 'M ' + (bl[0] * s) + ' 0 Q ' + ((bl[0] + bl[2]) * s) + ' ' + (bl[1] * s / 2) + ' ' + ((bl[0] + bl[2] * 1.7) * s) + ' ' + (bl[1] * s), fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' }))
          }
        } else if (type === 'star') {
          kids.push(React.createElement('path', { d: sparkleD(0, 0, 7 * s), fill: color }))
        } else if (type === 'heart') {
          kids.push(React.createElement('path', { d: heartD(0, 0, 6.5 * s), fill: color }))
        } else if (type === 'leaf') {
          kids.push(React.createElement('ellipse', { rx: (5.5 * s).toFixed(1), ry: (7 * s).toFixed(1), transform: 'rotate(24)', fill: color }))
          kids.push(React.createElement('path', { d: 'M 0 ' + (7 * s) + ' Q 1 ' + (10.5 * s) + ' 0 ' + (11.5 * s), fill: 'none', stroke: '#7FB98A', strokeWidth: 1.6, strokeLinecap: 'round' }))
        } else if (type === 'balloon') {
          kids.push(React.createElement('circle', { cy: (-2 * s).toFixed(1), r: (6.5 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('path', { d: 'M ' + (-2 * s) + ' ' + (4 * s) + ' L ' + (2 * s) + ' ' + (4 * s) + ' L 0 ' + (6 * s) + ' Z', fill: color }))
          kids.push(React.createElement('path', { d: 'M 0 ' + (6 * s) + ' Q ' + (2.5 * s) + ' ' + (10 * s) + ' 0 ' + (13 * s), fill: 'none', stroke: '#9AA692', strokeWidth: 1.3, strokeLinecap: 'round' }))
          kids.push(React.createElement('circle', { cx: (-2.2 * s).toFixed(1), cy: (-3.5 * s).toFixed(1), r: (1.6 * s).toFixed(1), fill: '#FFFFFF', opacity: 0.8 }))
        } else if (type === 'cherry') {
          kids.push(React.createElement('circle', { cx: (-3.6 * s).toFixed(1), cy: (0.6 * s).toFixed(1), r: (4.6 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('circle', { cx: (3.6 * s).toFixed(1), cy: (0.6 * s).toFixed(1), r: (4.6 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('path', { d: 'M ' + (-3.6 * s) + ' ' + (-3.8 * s) + ' Q 0 ' + (-9 * s) + ' ' + (3.6 * s) + ' ' + (-3.8 * s), fill: 'none', stroke: '#7FB98A', strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('circle', { cx: (-4.6 * s).toFixed(1), cy: (-0.6 * s).toFixed(1), r: (1.3 * s).toFixed(1), fill: '#FFFFFF', opacity: 0.8 }))
        } else if (type === 'clover') {
          for (const cc of [[-3.2, -3.2], [3.2, -3.2], [-3.2, 3.2], [3.2, 3.2]]) {
            kids.push(React.createElement('circle', { cx: (cc[0] * s).toFixed(1), cy: (cc[1] * s).toFixed(1), r: (3.4 * s).toFixed(1), fill: color }))
          }
          kids.push(React.createElement('path', { d: 'M 0 ' + (4 * s) + ' L 0 ' + (9.5 * s), stroke: '#7FB98A', strokeWidth: 1.6, strokeLinecap: 'round' }))
        } else if (type === 'cookie') {
          kids.push(React.createElement('circle', { r: (7 * s).toFixed(1), fill: '#E8C48A' }))
          for (const cc of [[-3, -2], [2.5, -3], [3, 2.5], [-2.5, 3], [0.5, 0]]) {
            kids.push(React.createElement('circle', { cx: (cc[0] * s).toFixed(1), cy: (cc[1] * s).toFixed(1), r: (1.25 * s).toFixed(1), fill: '#7A5A3E' }))
          }
        } else if (type === 'music') {
          kids.push(React.createElement('circle', { cx: (-2.8 * s).toFixed(1), cy: (4 * s).toFixed(1), r: (2.6 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('path', { d: 'M 0 ' + (4.5 * s) + ' L 0 ' + (-5.5 * s), stroke: color, strokeWidth: 2.2, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M 0 ' + (-5.5 * s) + ' Q ' + (6.5 * s) + ' ' + (-4.5 * s) + ' ' + (7 * s) + ' ' + (1 * s) + ' Q ' + (4 * s) + ' ' + (1.5 * s) + ' 0 ' + (-2 * s) + ' Z', fill: color }))
        } else {
          kids.push(React.createElement('circle', { cx: (-4.5 * s).toFixed(1), cy: (1 * s).toFixed(1), r: (4 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('circle', { cx: (0.5 * s).toFixed(1), cy: (-1.5 * s).toFixed(1), r: (4.8 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('circle', { cx: (4.5 * s).toFixed(1), cy: (1 * s).toFixed(1), r: (4 * s).toFixed(1), fill: color }))
          kids.push(React.createElement('rect', { x: (-8 * s).toFixed(1), y: (1 * s).toFixed(1), width: (16 * s).toFixed(1), height: (3.4 * s).toFixed(1), rx: (1.7 * s).toFixed(1), fill: color }))
        }
        return kids
      }

      function spaceFace(k, mode) {
        const cx = k.cx, cy = k.cy
        const FACE = theme.face, FONT = theme.font
        const kids = []
        if (mode === 'squint') {
          kids.push(React.createElement('path', { d: 'M ' + (cx - 13) + ' ' + cy + ' h 4', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 9) + ' ' + cy + ' h 4', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 6) + ' ' + (cy + 4) + ' q 6 3.4 12 0', fill: 'none', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        } else if (mode === 'burst') {
          kids.push(React.createElement('path', { d: 'M ' + (cx - 11) + ' ' + (cy - 1.6) + ' l -2.6 1.8 l 2.6 1.8', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 11) + ' ' + (cy - 1.6) + ' l 2.6 1.8 l -2.6 1.8', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 6) + ' ' + (cy + 3) + ' q 6 5 12 0', fill: 'none', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        } else if (mode === 'surprised') {
          kids.push(React.createElement('circle', { cx: cx - 11, cy: cy - 1, r: 3, fill: 'none', stroke: FACE, strokeWidth: 1.5 }))
          kids.push(React.createElement('circle', { cx: cx + 11, cy: cy - 1, r: 3, fill: 'none', stroke: FACE, strokeWidth: 1.5 }))
          kids.push(React.createElement('ellipse', { cx: cx, cy: cy + 4, rx: 2.6, ry: 3.2, fill: 'none', stroke: FACE, strokeWidth: 1.5 }))
        } else if (mode === 'happy') {
          kids.push(React.createElement('path', { d: 'M ' + (cx - 14) + ' ' + (cy + 1) + ' q 3 -3.2 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 8) + ' ' + (cy + 1) + ' q 3 -3.2 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 6) + ' ' + (cy + 3.6) + ' q 6 4.2 12 0', fill: 'none', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        } else if (mode === 'wink') {
          kids.push(React.createElement('circle', { cx: cx - 11, cy: cy, r: 2.1, fill: FACE }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 8) + ' ' + (cy + 1) + ' q 3 -3.2 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 6) + ' ' + (cy + 3.6) + ' q 6 4.2 12 0', fill: 'none', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        } else if (mode === 'dizzy') {
          for (const ex of [cx - 11, cx + 11]) {
            kids.push(React.createElement('path', { d: 'M ' + (ex - 2.6) + ' ' + (cy - 2.6) + ' L ' + (ex + 2.6) + ' ' + (cy + 2.6), stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
            kids.push(React.createElement('path', { d: 'M ' + (ex - 2.6) + ' ' + (cy + 2.6) + ' L ' + (ex + 2.6) + ' ' + (cy - 2.6), stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
          }
          kids.push(React.createElement('path', { d: 'M ' + (cx - 6) + ' ' + (cy + 3.4) + ' q 3 -3 6 0 q 3 3 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        } else if (mode === 'sleepy') {
          kids.push(React.createElement('path', { d: 'M ' + (cx - 14) + ' ' + (cy + 1) + ' q 3 3 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 8) + ' ' + (cy + 1) + ' q 3 3 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('circle', { cx: cx, cy: cy + 3.6, r: 1.8, fill: 'none', stroke: FACE, strokeWidth: 1.4 }))
          kids.push(React.createElement('text', { x: cx + 20, y: cy - 5, fontFamily: FONT, fontSize: 7, fill: FACE, fontWeight: '600' }, 'z'))
        } else if (mode === 'cool') {
          kids.push(React.createElement('path', { d: 'M ' + (cx - 14) + ' ' + (cy - 2) + ' h 6', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 8) + ' ' + (cy - 2) + ' h 6', stroke: FACE, strokeWidth: 1.6, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 14) + ' ' + (cy + 1.5) + ' q 3 2.4 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.4, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx + 8) + ' ' + (cy + 1.5) + ' q 3 2.4 6 0', fill: 'none', stroke: FACE, strokeWidth: 1.4, strokeLinecap: 'round' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 5) + ' ' + (cy + 4.2) + ' h 10', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        } else {
          kids.push(React.createElement('circle', { cx: cx - 11, cy: cy, r: 2.1, fill: FACE, className: 'kbdpet-eye' }))
          kids.push(React.createElement('circle', { cx: cx + 11, cy: cy, r: 2.1, fill: FACE, className: 'kbdpet-eye' }))
          kids.push(React.createElement('path', { d: 'M ' + (cx - 6) + ' ' + (cy + 3.6) + ' q 6 4.2 12 0', fill: 'none', stroke: FACE, strokeWidth: 1.5, strokeLinecap: 'round' }))
        }
        return kids
      }

      return { decalKids, spaceFace }
    }

    // merged speech-bubble silhouette: rounded rect + tail in ONE path
    function bubbleD(cx, y1, w, h, r, tailLen, tailHalf) {
      const x = cx - w / 2
      const y2 = y1 + h
      const rr = Math.min(r, w / 2, h / 2)
      return 'M ' + cx + ' ' + (y2 + tailLen) +
        ' L ' + (cx - tailHalf) + ' ' + y2 +
        ' L ' + (x + rr) + ' ' + y2 +
        ' Q ' + x + ' ' + y2 + ' ' + x + ' ' + (y2 - rr) +
        ' L ' + x + ' ' + (y1 + rr) +
        ' Q ' + x + ' ' + y1 + ' ' + (x + rr) + ' ' + y1 +
        ' L ' + (x + w - rr) + ' ' + y1 +
        ' Q ' + (x + w) + ' ' + y1 + ' ' + (x + w) + ' ' + (y1 + rr) +
        ' L ' + (x + w) + ' ' + (y2 - rr) +
        ' Q ' + (x + w) + ' ' + y2 + ' ' + (x + w - rr) + ' ' + y2 +
        ' L ' + (cx + tailHalf) + ' ' + y2 +
        ' Z'
    }

    // ======================================================================
    // 7. STYLES — 样式层
    // ======================================================================
    function createStyles() {
      return [
        '.kbdpet-card{position:fixed;right:20px;bottom:84px;z-index:1000;pointer-events:auto;',
        'user-select:none;-webkit-user-select:none;}',
        '.kbdpet-body{cursor:grab;touch-action:none;}',
        '.kbdpet-body:active{cursor:grabbing;}',
        '.kbdpet-body svg{display:block;}',
        '.kbdpet-strip{position:absolute;z-index:2;pointer-events:auto;touch-action:none;background:transparent;}',
        '.kbdpet-mini{position:fixed;right:20px;bottom:84px;z-index:1000;pointer-events:auto;width:44px;height:44px;',
        'border-radius:50%;background:#DCEFE2;border:1.5px solid #7FA88F;display:flex;align-items:center;',
        'justify-content:center;font-size:20px;color:#3F6B50;cursor:grab;touch-action:none;',
        'user-select:none;-webkit-user-select:none;}',
        '.kbdpet-mini:active{cursor:grabbing;}',
        '@keyframes kbdpet-blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(0.1)}}',
        '.kbdpet-eye{transform-box:fill-box;transform-origin:center;animation:kbdpet-blink 4.5s infinite;}',
        '@keyframes kbdpet-pop{0%{opacity:0;transform:scale(.55) translateY(12px)}55%{opacity:1;transform:scale(1.06) translateY(-1px)}100%{opacity:1;transform:scale(1) translateY(0)}}',
        '@keyframes kbdpet-popout{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.6) translateY(10px)}}',
        '.kbdpet-kb-in{transform-box:fill-box;transform-origin:center;animation:kbdpet-pop .3s ease-out;}',
        '.kbdpet-kb-out{transform-box:fill-box;transform-origin:center;animation:kbdpet-popout .26s ease-in forwards;}',
        '@keyframes kbdpet-tpop{0%{transform:scale(.5)}70%{transform:scale(1.18)}100%{transform:scale(1)}}',
        '.kbdpet-tpop{transform-box:fill-box;transform-origin:center;animation:kbdpet-tpop .16s ease-out;}',
        '@keyframes kbdpet-rise{0%{opacity:0;transform:translateY(0) scale(.4)}15%{opacity:1;transform:translateY(-5px) scale(1)}100%{opacity:0;transform:translateY(-26px) scale(.85)}}',
        '@keyframes kbdpet-fallk{0%{opacity:0;transform:translateY(0) scale(.4)}15%{opacity:1;transform:translateY(5px) scale(1)}100%{opacity:0;transform:translateY(26px) scale(.85)}}',
        '.kbdpet-fx{transform-box:fill-box;transform-origin:center;animation:kbdpet-rise 1.05s ease-out forwards;}',
        '.kbdpet-fx-down{transform-box:fill-box;transform-origin:center;animation:kbdpet-fallk 1.05s ease-out forwards;}'
      ].join('\n')
    }

    // ======================================================================
    // 8. COMPONENTS — 组件层
    // ======================================================================
    function createComponents(deps) {
      const { ctx, CONFIG, theme, geo, maps, store, enable, art } = deps

      let drag = null
      let resize = null
      let dragMoved = false
      let keystamps = []
      let lastKeyAt = Date.now()

      const STRIPS = [
        { c: 'n', ex: 0, ey: 0, kx: 0, ky: -1, style: { top: 0, left: 8, right: 8, height: 8, cursor: 'ns-resize' } },
        { c: 's', ex: 0, ey: 1, kx: 0, ky: 1, style: { bottom: 0, left: 8, right: 8, height: 8, cursor: 'ns-resize' } },
        { c: 'e', ex: 1, ey: 0, kx: 1, ky: 0, style: { right: 0, top: 8, bottom: 8, width: 8, cursor: 'ew-resize' } },
        { c: 'w', ex: 0, ey: 0, kx: -1, ky: 0, style: { left: 0, top: 8, bottom: 8, width: 8, cursor: 'ew-resize' } },
        { c: 'nw', ex: 0, ey: 0, kx: -1, ky: -1, style: { left: 0, top: 0, width: 12, height: 12, cursor: 'nwse-resize' } },
        { c: 'ne', ex: 1, ey: 0, kx: 1, ky: -1, style: { right: 0, top: 0, width: 12, height: 12, cursor: 'nesw-resize' } },
        { c: 'sw', ex: 0, ey: 1, kx: -1, ky: 1, style: { left: 0, bottom: 0, width: 12, height: 12, cursor: 'nesw-resize' } },
        { c: 'se', ex: 1, ey: 1, kx: 1, ky: 1, style: { right: 0, bottom: 0, width: 12, height: 12, cursor: 'nwse-resize' } }
      ]

      function num(v, dflt) { return typeof v === 'number' && isFinite(v) ? v : dflt }
      function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)) }

      function clampPos(p, sc) {
        if (typeof window === 'undefined' || !isFinite(window.innerWidth) || !isFinite(window.innerHeight)) {
          return { x: num(p.x, 0), y: num(p.y, 0) }
        }
        const vw = window.innerWidth, vh = window.innerHeight
        const bw = geo.W * sc, bh = geo.HT * sc + 26
        const M = 40 // 至少保留 40px 可见，避免拖丢
        let x = num(p.x, 0), y = num(p.y, 0)
        // 锚点 right:20 bottom:84 → 右边缘 = vw-20+x、左边缘 = vw-20+x-bw、底边缘 = vh-84+y、顶边缘 = vh-84+y-bh
        // 允许满视口移动：最左到右边缘 M，最右到左边缘 vw-M，最上到底边缘 M，最下到顶边缘 vh-M
        x = clamp(x, M + 20 - vw, bw + 20 - M)
        y = clamp(y, M + 84 - vh, bh + 84 - M)
        return { x: x, y: y }
      }

      function KeyNode(props) {
        const k = props.k
        const p = theme.pal[k.kind]
        const pressed = props.isPressed || props.isHeld
        const fill = pressed ? p.pressed : p.fill
        const shift = pressed ? ' translate(0 1.5)' : ''
        const s = k.size !== undefined ? k.size : (k.label.length === 1 ? 10 : 7.5)
        const kids = [
          React.createElement('path', {
            d: k.d, fill: 'none', stroke: p.line, strokeWidth: 2.2,
            strokeLinejoin: 'round', strokeLinecap: 'round', opacity: 0.15,
            transform: 'translate(0 2.2)'
          }),
          React.createElement('path', {
            d: k.d, fill: 'none', stroke: p.line, strokeWidth: 1.4,
            strokeLinejoin: 'round', strokeLinecap: 'round', opacity: 0.26,
            transform: 'translate(0.8 -0.6)'
          }),
          React.createElement('path', {
            d: k.d, fill: fill, stroke: p.line, strokeWidth: 1.8,
            strokeLinejoin: 'round', strokeLinecap: 'round'
          })
        ]
        if (k.label) kids.push(React.createElement('text', {
          x: k.cx, y: k.cy + s * 0.38, fontFamily: theme.font, fontSize: s,
          fill: p.text, textAnchor: 'middle', fontWeight: '600'
        }, k.label))
        if (k.bump) kids.push(React.createElement('path', {
          d: 'M ' + (k.cx - 4).toFixed(2) + ' ' + (k.y + k.h - 7).toFixed(2) + ' q 4 2 8 0',
          fill: 'none', stroke: theme.sub, strokeWidth: 1.3, strokeLinecap: 'round'
        }))
        if (k.id === 'Space') kids.push.apply(kids, art.spaceFace(k, props.faceMode))
        return React.createElement('g', {
          transform: 'rotate(' + k.rot.toFixed(2) + ' ' + k.cx.toFixed(2) + ' ' + k.cy.toFixed(2) + ')' + shift
        }, kids)
      }

      function CenterBubble(props) {
        const b = props.b
        const bw = Math.min(210, Math.max(64, b.label.length * 15 + 36))
        const bh = 46
        const cx = geo.W / 2
        const y1 = -geo.HEADROOM + 8
        const ty = y1 + bh / 2 + 8.5
        const d = bubbleD(cx, y1, bw, bh, 15, 10, 10)
        return React.createElement('g', { transform: 'rotate(-2 ' + cx + ' ' + (y1 + bh / 2) + ')' },
          React.createElement('g', { className: b.phase === 'out' ? 'kbdpet-kb-out' : 'kbdpet-kb-in' },
            React.createElement('path', { d: d, transform: 'translate(1.5 3)', fill: '#D9C7A8', opacity: 0.35 }),
            React.createElement('path', { d: d, fill: '#FFFDF4', stroke: theme.frameLine, strokeWidth: 2.5, strokeLinejoin: 'round' }),
            React.createElement('path', { d: sparkleD(cx - bw / 2 + bw - 16, y1 + 15, 6), fill: '#F6D977' }),
            React.createElement('g', { key: b.nonce, className: 'kbdpet-tpop' },
              React.createElement('text', {
                x: cx, y: ty, fontFamily: theme.font, fontSize: 24,
                fill: '#46594C', textAnchor: 'middle', fontWeight: '600'
              }, b.label)
            )
          )
        )
      }

      function KeyboardPet() {
        const SAVED = store.load()
        const initScale = clamp(num(SAVED && SAVED.scale, 1), CONFIG.minScale, CONFIG.maxScale)
        const initPos = clampPos(SAVED && SAVED.pos ? { x: num(SAVED.pos.x, 0), y: num(SAVED.pos.y, 0) } : { x: 0, y: 0 }, initScale)
        const [pos, setPos] = React.useState(initPos)
        const [scale, setScale] = React.useState(initScale)
        const [mini, setMini] = React.useState(() => SAVED ? SAVED.mini === true : false)
        const [flash, setFlash] = React.useState({})
        const [held, setHeld] = React.useState({})
        const [face, setFace] = React.useState({ mode: 'normal', until: 0 })
        const [bub, setBub] = React.useState(null)
        const [fx, setFx] = React.useState([])

        React.useEffect(() => {
          store.save({ pos: pos, scale: scale, mini: mini })
        }, [pos, scale, mini])

        React.useEffect(() => {
          if (typeof window === 'undefined') return undefined
          function onReset() {
            setPos({ x: 0, y: 0 })
            setScale(1)
            setMini(false)
          }
          window.addEventListener('kbdpet-reset', onReset)
          return function () { window.removeEventListener('kbdpet-reset', onReset) }
        }, [])

        React.useEffect(() => {
          if (typeof document === 'undefined') return undefined
          function down(e) {
            const mod = maps.modCodes[e.code]
            if (mod !== undefined) {
              setHeld(h => { if (h[mod]) return h; const n = Object.assign({}, h); n[mod] = true; return n })
              return
            }
            const id = maps.flashCodes[e.code]
            if (id === undefined) return
            const k = geo.byId[id]
            const now = Date.now()
            lastKeyAt = now
            keystamps.push(now)
            while (keystamps.length > 0 && now - keystamps[0] > 5000) keystamps.shift()
            setFlash(f => { const n = Object.assign({}, f); n[id] = now; return n })
            let mode = 'normal'
            if (id === 'Space') mode = 'squint'
            else if (id === 'Esc') mode = 'surprised'
            else if (id === 'Enter') mode = 'happy'
            else {
              let recent800 = 0
              let recent1000 = 0
              for (let i = keystamps.length - 1; i >= 0; i--) {
                const dt = now - keystamps[i]
                if (dt <= CONFIG.burstRecentMs) recent800 += 1
                if (dt <= CONFIG.dizzyRecentMs) recent1000 += 1
                if (dt > CONFIG.dizzyRecentMs) break
              }
              if (recent1000 >= CONFIG.dizzyCount) mode = 'dizzy'
              else if (recent800 >= CONFIG.burstCount) mode = 'burst'
              else {
                const r = Math.random()
                if (r < CONFIG.winkChance) mode = 'wink'
                else if (r < CONFIG.coolChance) mode = 'cool'
              }
            }
            if (mode !== 'normal') {
              setFace({ mode: mode, until: now + CONFIG.faceMs })
              ctx.timeout(() => {
                setFace(f => f.until > 0 && Date.now() >= f.until ? { mode: 'normal', until: 0 } : f)
              }, CONFIG.faceClearMs)
            } else {
              setFace({ mode: 'normal', until: 0 })
            }
            if (k !== undefined) {
              const label = maps.pretty(id)
              setBub({ label: label, nonce: now, phase: 'in' })
              ctx.timeout(() => {
                setBub(b => b && b.nonce === now ? { label: b.label, nonce: b.nonce, phase: 'out' } : b)
              }, CONFIG.bubbleHoldMs)
              ctx.timeout(() => {
                setBub(b => b && b.nonce === now ? null : b)
              }, CONFIG.bubbleOutMs)
              const flip = k.y < 44
              const nDecals = (id === 'Space' || id === 'Enter') ? CONFIG.decalsSpaceEnter : CONFIG.decalsNormal
              const born = []
              for (let i = 0; i < nDecals; i++) {
                const type = theme.decalTypes[Math.floor(Math.random() * theme.decalTypes.length)]
                const color = theme.decalColors[Math.floor(Math.random() * theme.decalColors.length)]
                born.push({
                  id: 'fx' + now + '_' + i,
                  type: type,
                  color: color,
                  s: 1.1 + Math.random() * 0.6,
                  x: k.cx + (Math.random() * 48 - 24),
                  y: flip ? k.y + k.h + 14 + Math.random() * 8 : k.y - 10 + Math.random() * 8,
                  down: flip
                })
              }
              setFx(arr => {
                const next = arr.concat(born)
                while (next.length > CONFIG.fxMax) next.shift()
                return next
              })
              for (const d of born) {
                ctx.timeout(() => {
                  setFx(arr => arr.filter(x => x.id !== d.id))
                }, CONFIG.fxLifeMs)
              }
            }
            ctx.timeout(() => {
              setFlash(f => { if (f[id] !== now) return f; const n = Object.assign({}, f); delete n[id]; return n })
            }, CONFIG.flashMs)
          }
          function up(e) {
            const mod = maps.modCodes[e.code]
            if (mod === undefined) return
            setHeld(h => { if (!h[mod]) return h; const n = Object.assign({}, h); delete n[mod]; return n })
          }
          document.addEventListener('keydown', down, true)
          document.addEventListener('keyup', up, true)
          return () => {
            document.removeEventListener('keydown', down, true)
            document.removeEventListener('keyup', up, true)
          }
        }, [])

        // sleepy when idle for a while
        React.useEffect(() => {
          const dis = ctx.interval(() => {
            if (Date.now() - lastKeyAt > CONFIG.idleSleepyMs) {
              setFace(f => (f.mode === 'normal' || f.mode === 'sleepy') ? { mode: 'sleepy', until: Date.now() + 86400000 } : f)
            }
          }, CONFIG.idleCheckMs)
          return dis
        }, [])

        function startDrag(e) {
          if (e.pointerType === 'mouse' && e.button !== 0) return
          drag = { sx: e.clientX, sy: e.clientY, bx: pos.x, by: pos.y }
          dragMoved = false
          if (e.currentTarget && e.currentTarget.setPointerCapture) {
            try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
          }
        }
        function moveDrag(e) {
          if (!drag) return
          if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 3) dragMoved = true
          setPos(clampPos({ x: drag.bx + (e.clientX - drag.sx), y: drag.by + (e.clientY - drag.sy) }, scale))
        }
        function endDrag() { drag = null }

        function startResize(strip, e) {
          if (e.pointerType === 'mouse' && e.button !== 0) return
          resize = { sx: e.clientX, sy: e.clientY, bx: pos.x, by: pos.y, base: scale, ex: strip.ex, ey: strip.ey, kx: strip.kx, ky: strip.ky }
          if (e.currentTarget && e.currentTarget.setPointerCapture) {
            try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
          }
        }
        function moveResize(e) {
          if (!resize) return
          const dx = e.clientX - resize.sx
          const dy = e.clientY - resize.sy
          const axes = (resize.ex !== 0 || resize.ey !== 0)
            ? ((resize.ex !== 0 ? 1 : 0) + (resize.ey !== 0 ? 1 : 0))
            : ((resize.kx !== 0 ? 1 : 0) + (resize.ky !== 0 ? 1 : 0))
          const delta = (resize.kx !== 0 ? (resize.kx * dx) / geo.W : 0) + (resize.ky !== 0 ? (resize.ky * dy) / geo.H : 0)
          const next = clamp(resize.base + delta / axes, CONFIG.minScale, CONFIG.maxScale)
          setPos(clampPos({ x: resize.bx + (resize.ex !== 0 ? dx : 0), y: resize.by + (resize.ey !== 0 ? dy : 0) }, next))
          setScale(next)
        }
        function endResize() { resize = null }

        if (mini) {
          return React.createElement('div', {
            className: 'kbdpet-mini',
            style: { transform: 'translate(' + pos.x + 'px,' + pos.y + 'px)' },
            title: 'Keyboard Pet — drag to move · click to expand',
            onClick: () => {
              if (dragMoved) { dragMoved = false; return }
              setMini(false)
            },
            onPointerDown: startDrag, onPointerMove: moveDrag,
            onPointerUp: endDrag, onPointerCancel: endDrag
          }, '\u2328')
        }

        const spaceActive = held['Space'] === true || flash['Space'] !== undefined
        const faceMode = spaceActive ? 'squint' : (face.until > Date.now() ? face.mode : 'normal')

        const kids = geo.keys.map(k => React.createElement(KeyNode, {
          key: k.id,
          k,
          isPressed: flash[k.id] !== undefined,
          isHeld: held[k.id] === true,
          faceMode: faceMode
        }))

        const fxNodes = fx.map(d => React.createElement('g', {
          key: d.id,
          transform: 'translate(' + d.x.toFixed(1) + ' ' + d.y.toFixed(1) + ')'
        },
          React.createElement('g', { className: d.down ? 'kbdpet-fx-down' : 'kbdpet-fx' }, art.decalKids(d.type, d.s, d.color))
        ))

        return React.createElement('div', {
          className: 'kbdpet-card',
          style: { transform: 'translate(' + pos.x + 'px,' + pos.y + 'px)' }
        },
          React.createElement('div', {
            className: 'kbdpet-body',
            title: 'Drag to move · Drag edges to resize · Double-click to minimize',
            onPointerDown: startDrag, onPointerMove: moveDrag,
            onPointerUp: endDrag, onPointerCancel: endDrag,
            onDoubleClick: () => setMini(true)
          },
            React.createElement('svg', {
              width: Math.round(geo.W * scale), height: Math.round(geo.HT * scale),
              viewBox: '0 ' + (-geo.HEADROOM) + ' ' + geo.W + ' ' + geo.HT
            },
              React.createElement('path', {
                d: geo.bgPath, fill: theme.paper, stroke: theme.frameLine, strokeWidth: 2,
                strokeLinejoin: 'round', strokeLinecap: 'round'
              }),
              React.createElement('path', {
                d: geo.bgPath, fill: 'none', stroke: theme.frameLine, strokeWidth: 1.4,
                strokeLinejoin: 'round', strokeLinecap: 'round', opacity: 0.26,
                transform: 'translate(1 -0.8)'
              }),
              kids,
              fxNodes,
              bub !== null && React.createElement(CenterBubble, { key: 'center-bubble', b: bub })
            )
          ),
          STRIPS.map(s => React.createElement('div', {
            key: s.c,
            className: 'kbdpet-strip',
            style: s.style,
            title: 'Resize',
            onPointerDown: e => startResize(s, e),
            onPointerMove: moveResize,
            onPointerUp: endResize,
            onPointerCancel: endResize
          }))
        )
      }

      // 开关门控：开关关闭时整体不挂载（监听跨页 storage + 同页自定义事件）
      function PetHost() {
        const [on, setOn] = React.useState(enable.read)
        React.useEffect(() => enable.subscribe(setOn), [])
        return on ? React.createElement(KeyboardPet) : null
      }

      return { PetHost }
    }

    // ======================================================================
    // 9. ASSEMBLY — 装配层
    // ======================================================================
    const theme = createTheme()
    const geo = createGeometry(mulberry(CONFIG.seed))
    const maps = createKeyMaps()
    const store = createStore(CONFIG.storeKey)
    const enable = createEnableFlag(CONFIG.enableKey, CONFIG.enableEvent)
    const art = createArt(theme)
    const css = createStyles()
    const components = createComponents({ ctx, CONFIG, theme, geo, maps, store, enable, art })

    const slots = ctx.slots
    if (slots === undefined) return
    ctx.effect(() => styles.insert(css))
    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'keyboard-pet', order: CONFIG.slotOrder, label: 'Keyboard Pet' },
      () => React.createElement(components.PetHost)
    ))
    }
    function apply(ctx) {
      injectThemeCss(ctx);
      const t = ctx.locale.bind(NS);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "theme-kit: dictionaries");

      const theme = ctx.get("theme");
      const allThemes = PRESET_GROUPS.flatMap((g) => g.themes);
      const presetDisposers = allThemes.map((p) => theme.register(p));
      ctx.effect(() => () => presetDisposers.forEach((d) => d()), "theme-kit: preset themes");

      // ── 持久化：host Typert remote（写 DSH_HOME 文件）+ localStorage 镜像 ──
      // 背景：web API 网关对第三方 settings 命名空间有 allowlist 拦截
      // （settings-not-exposed），直接走 settingsScope 永远写不进去；
      // Typert remote 是当前应用给第三方插件留的宿主持久化通道。
      const STORAGE_KEY = "dsh-theme-kit:config";
      const readLocal = () => {
        try {
          const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
          return raw ? JSON.parse(raw) : null;
        } catch { return null; }
      };
      const writeLocal = (cfg) => {
        try {
          if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
        } catch { /* 配额满等场景忽略 */ }
      };

      // 手写 codec：客户端边界只要求 parse()，服务端 manifest 负责严格校验
      const identity = (value) => value;
      const wireCodec = (symbol) => ({ mode: "strict", typeSymbol: symbol, schema: { parse: identity } });
      const REMOTE_CONTRIBUTION = {
        package: "dsh-theme-kit",
        descriptors: [
          { id: "dsh-theme-kit#themeKit/getConfig", service: "themeKit", namespace: "themeKit", method: "getConfig",
            invocation: { kind: "direct" }, parameters: [], result: wireCodec("dsh-theme-kit#Config") },
          { id: "dsh-theme-kit#themeKit/setConfig", service: "themeKit", namespace: "themeKit", method: "setConfig",
            invocation: { kind: "direct" },
            parameters: [{ name: "config", wire: "config", source: "json", codec: wireCodec("dsh-theme-kit#Config") }],
            result: wireCodec("dsh-theme-kit#SetConfigResult") },
        ],
      };

      const remoteReady = ctx.remote.$mount(REMOTE_CONTRIBUTION)
        .then(() => ctx.get("remote.themeKit"))
        .catch((error) => {
          console.warn("[dsh-theme-kit] remote mount failed:", error);
          return null;
        });
      const callRemote = async (method, ...args) => {
        try {
          const remote = await remoteReady;
          if (!remote || typeof remote[method] !== "function") return null;
          return await remote[method](...args);
        } catch (error) {
          console.warn("[dsh-theme-kit] host remote call failed:", error);
          return null;
        }
      };

      const presetIds = new Set(PRESET_GROUPS.flatMap((g) => g.themes.map((p) => p.id)));
      const PRESET_BY_ID = new Map(PRESET_GROUPS.flatMap((g) => g.themes.map((p) => [p.id, p])));

      // 归一化：老版本存 background 可能缺字段，缺省补齐，避免 NaN 变量
      const normalizeBackground = (raw) => {
        const b = raw && typeof raw === "object" ? raw : {};
        return {
          image: typeof b.image === "string" ? b.image : "",
          preview: typeof b.preview === "string" ? b.preview : "",
          // glass: 0..100 连续值；兼容旧版字符clear/liquid/frost
          glass: typeof b.glass === "number"
            ? Math.max(0, Math.min(100, b.glass))
            : b.glass === "clear" ? 0 : b.glass === "liquid" ? 50 : b.glass === "frost" ? 100 : 50,
          // 纸纹纹理 id："" = 无；textureStrength 0..100 = 叠加透明度（默认 11）
          texture: typeof b.texture === "string" ? b.texture : "",
          textureStrength: typeof b.textureStrength === "number" ? Math.max(0, Math.min(100, b.textureStrength)) : 11,
          // 纹路颜色 id（"" = 原色）
          textureColor: typeof b.textureColor === "string" ? b.textureColor : "",
          position: b.position === "top" || b.position === "bottom" ? b.position : "center",
          size: b.size === "contain" || b.size === "auto" ? b.size : "cover",
          // 高级手动微调：manual=false 时自动 alpha 生效；opacity 是 0..100 的分区透明度
          manual: typeof b.manual === "boolean" ? b.manual : true,
          // 手动分区 = 相对整体遮盖的倍率：50=基准(×1)，<50 更透、>50 更实
          opacity: {
            main: typeof b.opacity === "object" && b.opacity && typeof b.opacity.main === "number" ? Math.max(0, Math.min(100, b.opacity.main)) : 7,
            sidebar: typeof b.opacity === "object" && b.opacity && typeof b.opacity.sidebar === "number" ? Math.max(0, Math.min(100, b.opacity.sidebar)) : 76,
            card: typeof b.opacity === "object" && b.opacity && typeof b.opacity.card === "number" ? Math.max(0, Math.min(100, b.opacity.card)) : 50,
            input: typeof b.opacity === "object" && b.opacity && typeof b.opacity.input === "number" ? Math.max(0, Math.min(100, b.opacity.input)) : 50,
            dialog: typeof b.opacity === "object" && b.opacity && typeof b.opacity.dialog === "number" ? Math.max(0, Math.min(100, b.opacity.dialog)) : 80,
          },
          // 文字深浅（手动，五分区）：50=原色，<50 更浅(向白)，>50 更深(向深灰 46)
          textDepth: {
            main: typeof b.textDepth === "object" && b.textDepth && typeof b.textDepth.main === "number" ? Math.max(0, Math.min(100, b.textDepth.main)) : 50,
            sidebar: typeof b.textDepth === "object" && b.textDepth && typeof b.textDepth.sidebar === "number" ? Math.max(0, Math.min(100, b.textDepth.sidebar)) : 50,
            card: typeof b.textDepth === "object" && b.textDepth && typeof b.textDepth.card === "number" ? Math.max(0, Math.min(100, b.textDepth.card)) : 50,
            input: typeof b.textDepth === "object" && b.textDepth && typeof b.textDepth.input === "number" ? Math.max(0, Math.min(100, b.textDepth.input)) : 50,
            dialog: typeof b.textDepth === "object" && b.textDepth && typeof b.textDepth.dialog === "number" ? Math.max(0, Math.min(100, b.textDepth.dialog)) : 50,
          },
        };
      };
      let background = normalizeBackground((readLocal() || {}).background);
      // 已持久化的预设 id（"" = 无）。
      let savedPreset = "";
      // 皮肤模型（对齐参考仓库 dsh-web-ui 的 skins）：预设 = 注入样式表的
      // !important CSS 变量 + 属性标记，完全不碰官方主题服务的 preference——
      // 官方 adopt() 永不回退我们。
      let activePreset = "";
      let presetStyleEl = null; // 注入的 token 样式表节点（撤层时移除）
      let presetTokenValues = null; // 皮肤 token 原始值表（玻璃取色用，避免读计算值的循环依赖）

      // 把任CSS 颜色字符串（color-mix）解析成 "R G B" 三元组，供玻token 使用
      let resolveCanvas = null;
      const resolveRgb = (color) => {
        if (typeof color !== "string" || color === "") return null;
        try {
          if (!resolveCanvas) {
            const cv = document.createElement("canvas");
            cv.width = 1;
            cv.height = 1;
            resolveCanvas = cv.getContext("2d");
          }
          if (!resolveCanvas) return null;
          resolveCanvas.fillStyle = "#010203";
          resolveCanvas.fillStyle = color;
          const out = String(resolveCanvas.fillStyle);
          // 赋值失败（如玻璃规则里 rgb(var(--uit-c-base)/...) 这种环引用）时
          // fillStyle 保持哨兵色不变——直接判失败，不能把哨兵色当结果返回。
          if (out === "#010203" && !/^#010203$/i.test(color.trim())) return null;
          const m = out.match(/rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/);
          if (m) return m[1] + " " + m[2] + " " + m[3];
          // 现代颜色空间规范化输出：color(srgb r g b)
          const m2 = out.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
          if (m2) return Math.round(+m2[1] * 255) + " " + Math.round(+m2[2] * 255) + " " + Math.round(+m2[3] * 255);
          if (/^#[0-9a-f]{6}$/i.test(out)) {
            return parseInt(out.slice(1, 3), 16) + " " + parseInt(out.slice(3, 5), 16) + " " + parseInt(out.slice(5, 7), 16);
          }
          // 像素采样兜底：oklab / color-mix / color(display-p3) 等任意可解析颜色
          try {
            resolveCanvas.fillRect(0, 0, 1, 1);
            const d = resolveCanvas.getImageData(0, 0, 1, 1).data;
            if (d && d[3] > 0) return d[0] + " " + d[1] + " " + d[2];
          } catch { /* 采样失败走回退 */ }
        } catch { /* 解析失败走回退 */ }
        return null;
      };

      // 从当前主token 解析玻璃要用的表面颜色（RGB 三元组），写body --uit-c-*
      const applyGlassColors = (scheme) => {
        const tokens = theme.getTheme().active?.tokens || {};
        const fb = scheme === "dark"
          ? { base: "21 21 23", layer1: "35 35 36", layer2: "44 44 46", layer3: "53 54 56", module: "53 54 56", sidebar: "30 30 31", bubble: "44 44 46", input: "44 44 46", menu: "53 54 56", selector: "53 54 56", tip: "53 54 56", code: "27 27 28", inline: "44 44 46", tooltip: "28 28 30" }
          : { base: "255 255 255", layer1: "255 255 255", layer2: "255 255 255", layer3: "255 255 255", module: "249 250 251", sidebar: "249 250 251", bubble: "235 238 242", input: "255 255 255", menu: "255 255 255", selector: "249 250 251", tip: "249 250 251", code: "249 250 251", inline: "235 238 242", tooltip: "40 40 43" };
        const readToken = (tokenKey) => {
          try {
            // 皮肤激活时直接用原始 token 值——不能读计算样式：
            // 玻璃规则把 --dsw-alias-bg-base 覆写成 rgb(var(--uit-c-base)/...)，
            // 计算值会与 --uit-c-* 互相引用成环（玻璃颜色被解析成黑色）。
            if (presetTokenValues && presetTokenValues[tokenKey] !== undefined) return String(presetTokenValues[tokenKey]);
            const inline = document.body.style.getPropertyValue(tokenKey);
            if (inline) return inline.trim();
            const v = getComputedStyle(document.body).getPropertyValue(tokenKey);
            return v ? v.trim() : "";
          } catch { return ""; }
        };
        const c = (tokenKey, fbValue) => resolveRgb(readToken(tokenKey)) || resolveRgb(tokens[tokenKey]) || fbValue;
        const body = document.body;
        body.style.setProperty("--uit-c-base", c("--dsw-alias-bg-base", fb.base));
        body.style.setProperty("--uit-c-layer1", c("--dsw-alias-bg-layer-1", fb.layer1));
        body.style.setProperty("--uit-c-layer2", c("--dsw-alias-bg-layer-2", fb.layer2));
        body.style.setProperty("--uit-c-layer3", c("--dsw-alias-bg-layer-3", fb.layer3));
        body.style.setProperty("--uit-c-module", c("--dsw-alias-bg-module-platform", fb.module));
        body.style.setProperty("--uit-c-sidebar", c("--dsw-specific-sidebar-fill", fb.sidebar));
        body.style.setProperty("--uit-c-bubble", c("--dsw-specific-bubble", fb.bubble));
        body.style.setProperty("--uit-c-input", c("--dsw-specific-input-major", fb.input));
        body.style.setProperty("--uit-c-menu", c("--dsw-specific-menu", fb.menu));
        body.style.setProperty("--uit-c-selector", c("--dsw-specific-selector", fb.selector));
        body.style.setProperty("--uit-c-tip", c("--dsw-specific-tip", fb.tip));
        body.style.setProperty("--uit-c-code", c("--dsw-alias-markdown-code-block", fb.code));
        body.style.setProperty("--uit-c-inline", c("--dsw-alias-markdown-inline-code", fb.inline));
        body.style.setProperty("--uit-c-tooltip", c("--dsw-alias-tooltip-bg", fb.tooltip));
      };

      // 动态背景 <video> 的 Blob URL 缓存（切换视频时释放旧的）
      let videoSrcKey = "";
      let videoObjectUrl = null;

      // 纸纹纹理：单层平铺叠加（multiply 低透明度）；层 CSS z-index:10 低于桌宠 overlay 层，桌宠不受纹理影响
      const applyTexture = () => {
        const tex = TEXTURE_BY_ID.get(background.texture);
        let layer = document.getElementById("uit-texture-layer");
        if (!tex) {
          if (layer) layer.remove();
          document.body.removeAttribute("data-uit-texture");
          return;
        }
        if (!layer) {
          layer = document.createElement("div");
          layer.id = "uit-texture-layer";
          layer.className = "uit-texture-layer";
          document.body.appendChild(layer);
        }
        const strength = typeof background.textureStrength === "number" ? background.textureStrength : 11;
        layer.style.opacity = (Math.max(0, Math.min(100, strength)) / 100).toFixed(3);
        const colorDef = TEXTURE_COLORS.find((c) => c.id === background.textureColor);
        if (colorDef && colorDef.color) {
          // 染色模式：只用纹路本身（mask），填所选颜色——只改花纹颜色、不染背景
          layer.style.backgroundImage = "";
          layer.style.backgroundColor = colorDef.color;
          layer.style.backgroundBlendMode = "normal";
          layer.style.webkitMaskImage = "url(" + tex.mask + ")";
          layer.style.maskImage = "url(" + tex.mask + ")";
          layer.style.webkitMaskSize = "512px auto";
          layer.style.maskSize = "512px auto";
          layer.style.webkitMaskRepeat = "repeat";
          layer.style.maskRepeat = "repeat";
        } else {
          // 原色模式：直接用纹理图自身颜色
          layer.style.backgroundImage = "url(" + tex.url + ")";
          layer.style.backgroundColor = "";
          layer.style.backgroundBlendMode = "normal";
          layer.style.webkitMaskImage = "";
          layer.style.maskImage = "";
        }
        document.body.setAttribute("data-uit-texture", tex.id);
      };

      const applyBackground = () => {
        applyTexture();
        const body = document.body;
        const hasImage = !!background.image;
        // 玻璃（透度/遮盖/质感）只与背景图有关
        const uiGlass = hasImage;
        const glassOn = hasImage && background.glass > 0;
        const scheme = theme.getTheme().active.colorScheme;
        if (!uiGlass) {
          body.style.backgroundImage = "";
          body.style.backgroundSize = "";
          body.style.backgroundPosition = "";
          body.style.backgroundAttachment = "";
          body.style.backgroundColor = "";
          body.style.removeProperty("--uit-ga");
          ["--uit-tm", "--uit-ts", "--uit-tc", "--uit-ti", "--uit-td"].forEach((k) => body.style.removeProperty(k));
          ["--uit-ga-b", "--uit-ga-l1", "--uit-ga-l2", "--uit-ga-l3", "--uit-ga-m", "--uit-ga-sb", "--uit-ga-bb", "--uit-ga-in", "--uit-ga-cd", "--uit-ga-il"].forEach((k) => body.style.removeProperty(k));
          body.style.removeProperty("--uit-blur");
          body.style.removeProperty("--uit-sat");
          body.style.removeProperty("--uit-bri");
          ["--uit-mm", "--uit-ms", "--uit-mc", "--uit-mi", "--uit-md"].forEach((k) => body.style.removeProperty(k));
          body.removeAttribute("data-uit-glass");
          body.removeAttribute("data-uit-glass-ui");
          const v0 = document.getElementById("uit-bg-video");
          if (v0) v0.remove();
          return;
        }
        // 遮盖程度滑块已移除：全局组件透明度固定为原默认（cover=30 → 0.475）
        // 玻璃质感滑块只控制背景模糊/饱和/亮度
        const coverT = 0.3;
        body.style.setProperty("--uit-ga", (0.25 + 0.75 * coverT).toFixed(2));
        // 玻璃质感=透明，中液态（模糊+提饱和）00=霜态（强模去饱和）；模糊封16px 保性能
        if (glassOn) {
          const glassT = background.glass / 100;
          const blur = Math.min(16, 22 * Math.pow(glassT, 1.4));
          const sat = 1 + 0.6 * Math.sin(Math.PI * glassT) - 0.3 * glassT * glassT;
          const bri = 1 + 0.02 * Math.sin(Math.PI * glassT);
          body.style.setProperty("--uit-blur", blur.toFixed(2));
          body.style.setProperty("--uit-sat", sat.toFixed(3));
          body.style.setProperty("--uit-bri", bri.toFixed(3));
          body.setAttribute("data-uit-glass", String(background.glass));
        } else {
          body.style.removeProperty("--uit-blur");
          body.style.removeProperty("--uit-sat");
          body.style.removeProperty("--uit-bri");
          body.removeAttribute("data-uit-glass");
        }
        body.setAttribute("data-uit-glass-ui", "");
        // 玻璃颜色取自当前主题自身，避免玻璃把主题底色冲掉
        applyGlassColors(scheme);
        // 每表面按自身明度换算 alpha：深色表面给更低alpha
        // 让深色侧边栏（如传统色）在低遮盖度下也像浅色主题一样透出图片，各预设玻璃观感一
        const surfAlpha = (key, offset) => {
          const parts = (body.style.getPropertyValue(key) || "255 255 255").trim().split(/\s+/).map(Number);
          const l = (0.2126 * (parts[0] || 255) + 0.7152 * (parts[1] || 255) + 0.0722 * (parts[2] || 255)) / 255;
          const ga = parseFloat(body.style.getPropertyValue("--uit-ga")) || 0.6;
          return Math.max(0.16, Math.min(1, ga * (0.5 + 0.5 * l) + offset)).toFixed(2);
        };
        body.style.setProperty("--uit-ga-b", surfAlpha("--uit-c-base", 0));
        body.style.setProperty("--uit-ga-l1", surfAlpha("--uit-c-layer1", 0.05));
        body.style.setProperty("--uit-ga-l2", surfAlpha("--uit-c-layer2", 0.1));
        body.style.setProperty("--uit-ga-l3", surfAlpha("--uit-c-layer3", 0.13));
        body.style.setProperty("--uit-ga-m", surfAlpha("--uit-c-module", 0.1));
        body.style.setProperty("--uit-ga-sb", surfAlpha("--uit-c-sidebar", 0));
        body.style.setProperty("--uit-ga-bb", surfAlpha("--uit-c-bubble", 0.1));
        body.style.setProperty("--uit-ga-in", surfAlpha("--uit-c-input", 0.15));
        body.style.setProperty("--uit-ga-cd", surfAlpha("--uit-c-code", 0.15));
        body.style.setProperty("--uit-ga-il", surfAlpha("--uit-c-inline", 0.1));
        // 高级手动微调：相对整体遮盖的倍率（50=基准 ×1），乘在自动 alpha 之上——遮盖始终是全局基准，不被手动分区覆盖
        const MANUAL_ZONES = [["--uit-mm", "main"], ["--uit-ms", "sidebar"], ["--uit-mc", "card"], ["--uit-mi", "input"], ["--uit-md", "dialog"]];
        if (background.manual) {
          for (const [varName, key] of MANUAL_ZONES) {
            const raw = background.opacity ? background.opacity[key] : undefined;
            const val = typeof raw === "number" ? Math.max(0, Math.min(100, raw)) / 50 : 1;
            body.style.setProperty(varName, val.toFixed(2));
          }
        } else {
          for (const [varName] of MANUAL_ZONES) body.style.removeProperty(varName);
        }
        // 文字深浅（手动，五分区）：50=原色，<50 更浅(向白)，>50 更深(向深灰 46)
        const lightRgb = (body.style.getPropertyValue("--uit-c-base") || "255 255 255").trim().split(/\s+/).map(Number);
        const labelOrig = resolveRgb((presetTokenValues && presetTokenValues["--dsw-alias-label-primary"] !== undefined) ? String(presetTokenValues["--dsw-alias-label-primary"]) : "");
        const darkRgb = (labelOrig || "46 46 46").trim().split(/\s+/).map(Number);
        const mixRgb = (ref, target, t) => "rgb(" +
          Math.round((ref[0] || 255) + ((target[0] || 255) - (ref[0] || 255)) * t) + " " +
          Math.round((ref[1] || 255) + ((target[1] || 255) - (ref[1] || 255)) * t) + " " +
          Math.round((ref[2] || 255) + ((target[2] || 255) - (ref[2] || 255)) * t) + ")";
        // 侧边栏文字：深侧栏预设 = 透明度耦合 + 手动（加权平均各 50%）；浅侧栏预设 = 纯手动
        const DARK_SIDEBAR = ["shiqing", "sancai", "tuoling", "luori", "hutao", "ziteng", "jingui", "lantian"];
        const sbManualRaw = background.textDepth && typeof background.textDepth.sidebar === "number" ? background.textDepth.sidebar : 50;
        if (DARK_SIDEBAR.includes(activePreset)) {
          const sbOpacity = background.manual && background.opacity ? background.opacity.sidebar : 50;
          const autoDark = 1 - Math.max(0, Math.min(100, sbOpacity)) / 100;
          const manualDark = Math.max(0, Math.min(100, sbManualRaw)) / 100;
          const sidebarDark = (autoDark + manualDark) / 2;
          body.style.setProperty("--uit-ts", mixRgb(lightRgb, [46, 46, 46], sidebarDark));
        } else {
          const d = Math.max(0, Math.min(100, sbManualRaw));
          const t = d < 50 ? (50 - d) / 50 : (d - 50) / 50;
          const target = d < 50 ? [255, 255, 255] : [46, 46, 46];
          body.style.setProperty("--uit-ts", mixRgb(darkRgb, target, t));
        }
        // 其它四分区：纯手动
        const TEXT_ZONES = [
          ["main", "--uit-tm", darkRgb],
          ["card", "--uit-tc", darkRgb],
          ["input", "--uit-ti", darkRgb],
          ["dialog", "--uit-td", darkRgb],
        ];
        for (const [key, varName, ref] of TEXT_ZONES) {
          const raw = background.textDepth ? background.textDepth[key] : undefined;
          const d = typeof raw === "number" ? Math.max(0, Math.min(100, raw)) : 50;
          const t = d < 50 ? (50 - d) / 50 : (d - 50) / 50;
          const target = d < 50 ? [255, 255, 255] : [46, 46, 46];
          body.style.setProperty(varName, mixRgb(ref, target, t));
        }
        // 动态背景：MP4/WebM 用 <video> 铺底（静音循环），遮盖程度映射为视频明暗；
        // dataURL 直接播放循环会卡顿，转成 Blob URL 播放更顺；位置/缩放用 objectFit/objectPosition
        const isVideo = typeof background.image === "string" &&
          (background.image.startsWith("data:video/") ||
            /^\/dsh-theme-kit-wallpapers\/.*\.mp4$/i.test(background.image));
        let videoEl = document.getElementById("uit-bg-video");
        if (isVideo) {
          if (!videoEl) {
            videoEl = document.createElement("video");
            videoEl.id = "uit-bg-video";
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.muted = true;
            videoEl.defaultMuted = true;
            videoEl.playsInline = true;
            videoEl.setAttribute("preload", "auto");
            Object.assign(videoEl.style, {
              position: "fixed", inset: "0", width: "100vw", height: "100vh",
              objectFit: "cover", zIndex: "-1", pointerEvents: "none", background: "#000",
            });
            document.body.appendChild(videoEl);
            // 壁纸路由不可用等加载失败场景：移除黑底视频层，避免整页黑屏
            videoEl.addEventListener("error", () => {
              try {
                if (background.image && !String(background.image).startsWith("data:")) videoEl.remove();
              } catch { /* 忽略 */ }
            });
            // 首帧就绪后抽一帧做静态预览图（只抽一次，随设置持久化）
            videoEl.addEventListener("loadeddata", () => {
              try {
                if (background.preview) return;
                const cv = document.createElement("canvas");
                cv.width = 220; cv.height = 220;
                const cx = cv.getContext("2d");
                const vw = videoEl.videoWidth || 640, vh = videoEl.videoHeight || 360;
                const scale = Math.max(220 / vw, 220 / vh);
                cx.drawImage(videoEl, (220 - vw * scale) / 2, (220 - vh * scale) / 2, vw * scale, vh * scale);
                setBackground({ preview: cv.toDataURL("image/jpeg", 0.72) });
              } catch { /* 抽帧失败忽略 */ }
            });
          }
          const srcKey = background.image.startsWith("data:") ? background.image.slice(0, 72) : background.image;
          if (videoSrcKey !== srcKey) {
            videoSrcKey = srcKey;
            if (videoObjectUrl) { try { URL.revokeObjectURL(videoObjectUrl); } catch { /* 忽略 */ } }
            if (background.image.startsWith("data:")) {
              try {
                const comma = background.image.indexOf(",");
                const type = background.image.slice(5, background.image.indexOf(";"));
                const bin = atob(background.image.slice(comma + 1));
                const arr = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                videoObjectUrl = URL.createObjectURL(new Blob([arr], { type }));
                videoEl.src = videoObjectUrl;
              } catch {
                videoEl.src = background.image;
              }
            } else {
              // 壁纸预设：宿主路由直出的 mp4，直接流式播放
              videoEl.src = background.image;
            }
          }
          videoEl.style.objectFit = background.size === "contain" ? "contain" : background.size === "auto" ? "none" : "cover";
          videoEl.style.objectPosition = background.position === "top" ? "50% 0%" : background.position === "bottom" ? "50% 100%" : "50% 50%";
          const play = videoEl.play();
          if (play && typeof play.catch === "function") play.catch(() => {});
          videoEl.style.opacity = String(Math.max(0, 1 - 0.55 * coverT));
        } else if (videoEl) {
          videoEl.remove();
        }
        if (isVideo) {
          body.style.backgroundColor = "";
          body.style.backgroundImage = "";
          return;
        }
        // 图片遮罩与遮盖程度联动：0% 无遮罩，100% 压到 55%
        const scrim = scheme === "dark" ? "13,17,23" : "245,245,245";
        const a = Math.max(0, Math.min(1, 0.55 * coverT));
        body.style.backgroundColor = "";
        body.style.backgroundImage = "linear-gradient(rgba(" + scrim + "," + a + "), rgba(" + scrim + "," + a + ")), url(" + background.image + ")";
        const bgSize = background.size === "auto" ? "auto" : background.size;
        const bgPos = background.position === "top" ? "50% 0%" : background.position === "bottom" ? "50% 100%" : "50% 50%";
        body.style.backgroundSize = bgSize;
        body.style.backgroundPosition = bgPos;
        body.style.backgroundAttachment = "fixed";
      };

      // saveConfig 一律写「已保存的预设」而不是当前激活主题：
      // 启动期激活主题可能短暂是官方深色，若按当前主题写会把 savedPreset 抹成 ""
      const saveConfig = () => {
        const cfg = { preset: savedPreset, background };
        writeLocal(cfg);
        callRemote("setConfig", cfg);
      };
      const listeners = new Set();
      const emitChange = () => {
        for (const cb of Array.from(listeners)) {
          try { cb(); } catch { /* 单个回调失败不影响其他 */ }
        }
      };
      const setBackground = (patch) => {
        background = { ...background, ...patch };
        saveConfig();
        applyBackground();
        emitChange();
      };
      const clearBackground = () => setBackground({ image: "" });

      // 采纳已持久化的配置（host 文件优先，localStorage 镜像兜底），并恢复预设主题
      // 撤掉皮肤层：移除注入的 token 样式表 + 属性标记
      const clearPresetLayer = () => {
        if (presetStyleEl) {
          try { presetStyleEl.remove(); } catch { /* 忽略 */ }
          presetStyleEl = null;
        }
        presetTokenValues = null;
        document.body.removeAttribute("data-uit-preset");
        document.body.removeAttribute("data-uit-theme");
        syncCordisGeom();
      };
      // 应用预设皮肤：把预设 token 写进注入的 <style>，规则形如
      //   body[data-uit-preset]{--dsw-alias-bg-base:#xxx !important;...}
      // 不写行内 body.style 的原因：官方 ThemePresenter（dsh-client-ui-layout）
      // 每次 theme/change 都会对 body.style 先 removeProperty 再重写官方 token，
      // 行内写法会被删光 → “闪一下就消失”。样式表 + !important 不在 presenter
      // 的撤除范围内，且重要性压过 presenter 写的非 important 内联值，永不丢失。
      // 不调用 theme.setTheme / 不写官方偏好 → 官方 adopt() 无任何回退机会，
      // 皮肤在官方主题任意切换下都持续存在（参考仓库 dsh-web-ui 的做法）。
      const applyPreset = (id) => {
        const p = PRESET_BY_ID.get(id);
        if (!p) return false;
        clearPresetLayer();
        const rules = [];
        for (const k of Object.keys(p.tokens)) {
          rules.push(k + ":" + p.tokens[k] + " !important;");
        }
        const el = document.createElement("style");
        el.id = "uit-preset-tokens";
        el.textContent = "body[data-uit-preset]{" + rules.join("") + "}";
        document.head.appendChild(el);
        presetStyleEl = el;
        presetTokenValues = p.tokens;
        document.body.setAttribute("data-uit-preset", "");
        document.body.setAttribute("data-uit-theme", id);
        activePreset = id;
        syncCordisGeom();
        applyBackground();
        return true;
      };
      const adoptConfig = (cfg) => {
        // RPC 层 getConfig 返回 { ok, value } 信封；旧版本还可能把信封写进
        // localStorage 镜像。这里统一只取 value，其余形状视为非法配置。
        if (cfg && typeof cfg === "object" && cfg.ok === true && "value" in cfg) cfg = cfg.value;
        if (!cfg || typeof cfg !== "object") return;
        const nextBg = normalizeBackground(cfg.background);
        if (JSON.stringify(nextBg) !== JSON.stringify(background)) {
          background = nextBg;
          applyBackground();
        }
        const saved = typeof cfg.preset === "string" ? cfg.preset : "";
        const nextPreset = presetIds.has(saved) ? saved : "";
        if (nextPreset !== activePreset) {
          savedPreset = nextPreset;
          if (nextPreset) applyPreset(nextPreset);
          else {
            clearPresetLayer();
            activePreset = "";
          }
        } else {
          savedPreset = nextPreset;
        }
      };
      // 同步先采纳本地镜像（立刻可用），再用 host 配置覆盖（host 优先）
      adoptConfig(readLocal());
      callRemote("getConfig").then((hostCfg) => {
        const cfg = hostCfg && typeof hostCfg === "object" && hostCfg.ok === true && "value" in hostCfg ? hostCfg.value : hostCfg;
        if (cfg && typeof cfg === "object") {
          adoptConfig(cfg);
          writeLocal(cfg);
        }
      });
      // 皮肤模型不再需要 syncPresetFlag（属性写入已并入 applyPreset/clearPresetLayer）
      // 运行时强制对Cordis Plugin 侧边栏入口与设置按钮的几何
      // 内联样式优先级高于一切样式表，彻底避CSS 优先加载顺序导致的“高亮块还是高”问题
      // 任何主题下都对齐（不依赖 data-uit-preset）；折叠轨道（rail）时还原官方圆形样式
      function syncCordisGeom() {
        if (typeof document === "undefined" || !document.body || !document.querySelector) return;
        const badge = document.querySelector("[data-cordis-badge]");
        if (!badge) return;
        const fb = badge.parentElement;
        const layer = fb ? fb.parentElement : null;
        const rail = !!layer && String(layer.className).indexOf("rail") >= 0;
        const set = (el, k, v) => { if (el) el.style[k] = v; };
        if (rail) {
          ["width", "height", "margin"].forEach((k) => set(badge, k, ""));
          ["width", "height", "margin"].forEach((k) => set(layer, k, ""));
          return;
        }
        set(badge, "width", "100%");
        set(badge, "height", "34px");
        set(layer, "width", "calc(100% + 8px)");
        set(layer, "height", "34px");
        set(layer, "margin", "4px -4px 0");
      };

      // 设置导航里“主题与配色”的图标换成画板：面板打开/切换语言时外壳会重建导航 DOM
      // MutationObserver 守护，保证点进该栏之前图标就已经是画
      const paintNavIcon = () => {
        const cells = typeof document.querySelectorAll === "function" ? document.querySelectorAll("[class*='_navCell']") : [];
        for (const cell of Array.from(cells)) {
          const label = cell.querySelector && cell.querySelector("[class*='_navLabel']");
          if (label && label.textContent === t("nav")) {
            const svg = cell.querySelector && cell.querySelector("svg");
            if (svg && !svg.dataset.uitPalette) {
              svg.dataset.uitPalette = "1";
              svg.innerHTML = PALETTE_GLYPH;
            }
          }
        }
      };
      let paintTimer = null;
      const navObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => {
        if (paintTimer !== null) return;
        paintTimer = setTimeout(() => {
          paintTimer = null;
          paintNavIcon();
          syncCordisGeom();
        }, 120);
      });
      if (navObserver) navObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
      // 兜底：即使观察器漏掉挂载时机，也周期性把几何拉回与设置按钮一
      const cordisGeomTimer = typeof setInterval === "function" ? setInterval(syncCordisGeom, 2000) : null;
      ctx.effect(() => () => {
        if (navObserver) navObserver.disconnect();
        if (paintTimer !== null) clearTimeout(paintTimer);
        if (cordisGeomTimer !== null) clearInterval(cordisGeomTimer);
      }, "theme-kit: nav icon observer");
      paintNavIcon();
      // 官方主题变化只影响背景渲染（玻璃遮罩按当前明暗走）；皮肤是纯 CSS 层，
      // 与官方偏好零耦合——官方切深色/浅色不影响皮肤持续存在（参考仓库行为）。
      const offTheme = ctx.on("theme/change", () => {
        applyBackground();
        syncCordisGeom();
      });
      ctx.effect(() => offTheme, "theme-kit: background theme sync");

      applyBackground();
      syncCordisGeom();
      ctx.effect(() => () => {
        const body = document.body;
        body.style.backgroundImage = "";
        body.style.backgroundSize = "";
        body.style.backgroundPosition = "";
        body.style.backgroundAttachment = "";
        body.style.backgroundColor = "";
        body.style.removeProperty("--uit-ga");
        ["--uit-tm", "--uit-ts", "--uit-tc", "--uit-ti", "--uit-td"].forEach((k) => body.style.removeProperty(k));
        ["--uit-ga-b", "--uit-ga-l1", "--uit-ga-l2", "--uit-ga-l3", "--uit-ga-m", "--uit-ga-sb", "--uit-ga-bb", "--uit-ga-in", "--uit-ga-cd", "--uit-ga-il"].forEach((k) => body.style.removeProperty(k));
        body.style.removeProperty("--uit-blur");
        body.style.removeProperty("--uit-sat");
        body.style.removeProperty("--uit-bri");
        body.removeAttribute("data-uit-glass");
        body.removeAttribute("data-uit-glass-ui");
        body.removeAttribute("data-uit-texture");
        const vd = document.getElementById("uit-bg-video");
        if (vd) vd.remove();
        const tex = document.getElementById("uit-texture-layer");
        if (tex) tex.remove();
        if (presetStyleEl) { try { presetStyleEl.remove(); } catch { /* 忽略 */ } presetStyleEl = null; }
        presetTokenValues = null;
        body.removeAttribute("data-uit-preset");
        body.removeAttribute("data-uit-theme");
      }, "theme-kit: background cleanup");

      const getState = () => ({ snapshot: theme.getTheme(), background, activePreset });

      const face = () => ({
        getState,
        setTheme: (id) => {
          if (presetIds.has(id)) {
            // 选择我们的预设：纯 CSS 皮肤（样式表 token + 属性标记），不碰官方偏好
            savedPreset = id;
            applyPreset(id);
            saveConfig();
          } else {
            // 官方偏好（system/light/dark）：撤掉我们的皮肤，官方完全接管
            savedPreset = "";
            clearPresetLayer();
            activePreset = "";
            try { theme.setTheme(id); } catch { /* 忽略 */ }
            saveConfig();
          }
          emitChange();
        },
        setBackground,
        clearBackground,
        onChange: (cb) => {
          const off1 = ctx.on("theme/change", cb);
          listeners.add(cb);
          return () => { off1(); listeners.delete(cb); };
        },
      });

      ctx.slots.inject("settings.section", () => ctx.slots.register({
        name: "settings.section",
        id: "themes",
        order: 11,
        label: () => t("nav"),
        locale: NS,
        inject: face,
      }, ThemePanel));
      applyKeyboardPet(ctx, React, styles);
    }

    exports.NS = NS;
    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
