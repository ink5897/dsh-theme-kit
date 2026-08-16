# dsh-ui-kit

English | [中文](README.zh.md)

A DeepSeek Harness Web GUI appearance plugin: preset color themes, custom backgrounds (wallpaper / glass / texture), per-zone text depth, and a keyboard desktop pet.

## Features

- **Preset themes** grouped by palette (Morandi / Macaron / Chinese traditional colors), one-click switch.
- **Custom background**: import and crop an image, or pick from built-in wallpapers (static / video).
- **Glass effect**: blur / saturation / brightness over the background image.
- **Paper texture**: built-in patterns with adjustable strength and color.
- **Per-zone opacity**: fine-tune surface opacity for the main area / sidebar / cards / input / settings panel.
- **Per-zone text depth**: adjust text color depth for the main area / sidebar / cards / input / settings panel.
- **Keyboard pet**: a desktop pet that reacts to key presses; draggable and resizable.

## Install

Prerequisites: a working DeepSeek Harness (`dsh`) installation with Node.js 18+ and pnpm on your PATH.

```bash
git clone https://github.com/ink5897/dsh-ui-kit.git
cd dsh-ui-kit
dsh plugin --profile web add link:.
```

Restart `dsh web`, then open Settings to see the "Themes & Colors" section.

## Config

All options are exposed in the settings panel and persisted automatically:

- Preset themes: pick a theme, or use system / light / dark.
- Custom background: import / crop / wallpaper / glass / texture / position / size.
- Per-zone opacity and text depth.
- Keyboard pet: enable / disable / reset position.

## Development

The plugin is a single DSH bundle package with no build step; DSH loads the source directly.

- `lib/index.js` — host half: the `uiKit` remote service for persistence and the `/dsh-ui-kit-wallpapers` route that streams the bundled wallpapers.
- `lib/client.js` — browser half: background, theme, text depth, and keyboard pet.
- `wallpapers/` — bundled static and video wallpapers plus textures.
- `cordis.patch.yml` — the bundle patch that mounts the plugin.

## Known limitations

- Per-zone opacity and text depth are applied through CSS custom-property overrides scoped to the shell DOM; the shell's internal class names may change across versions.
- The keyboard pet and brand-color rules depend on the shell's DOM structure.

## License

MIT
