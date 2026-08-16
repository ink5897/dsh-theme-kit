# dsh-theme-kit

English | [中文](README.zh.md)

A DeepSeek Harness Web GUI appearance kit: 32 preset themes across three palettes, custom backgrounds (import an image or pick from built-in animated and static wallpapers, with glass and paper texture), per-zone surface opacity and text depth, and a keyboard desktop pet.

## Screenshots

![Preset theme picker](docs/screenshot-presets.png)

![Themed main interface](docs/screenshot-theme1.png)

![Themed workspace](docs/screenshot-theme2.png)

![Built-in wallpaper](docs/screenshot-wallpaper.png)

## Features

- 32 preset themes across 3 palettes, one-click switch
- Custom background: import and crop an image, or pick from 6 built-in wallpapers (3 animated + 3 static)
- Glass effect (blur / saturation / brightness) and 7 paper textures
- Per-zone surface opacity and text depth (main / sidebar / cards / input / settings)
- Keyboard desktop pet that reacts to key presses

## Preset themes

32 presets across 3 palettes:

| Palette | Count | Presets |
|---|---|---|
| Morandi | 12 | Oat Mocha, Soy Mochi, Olive Candy, Moss Milk, Perilla Mochi, Berry Breeze, Orange Milk Cap, Seaweed Jelly, Peach Hazelnut, Osmanthus Oolong, Mint Coffee, Algae Choco |
| Macaron | 8 | Sea Salt Frappe, Sakura Shake, Peach Candy, Berry Frost, Lemon Sea Breeze, Purple Yam Custard, Matcha Apricot, Grape Jelly |
| Chinese traditional | 12 | Azurite Ochre, Lotus Crimson, Snow Peach, Bamboo Azure, Tang Tricolor, Vermilion Wall, Rouge Teal, Frontier Sunset, Walnut Amber, Wisteria Apricot, Osmanthus Bamboo, Lantian Jade |

## Wallpapers

| Type | Count | Wallpapers |
|---|---|---|
| Animated (video) | 3 | 五条悟 (Gojo Satoru), 柯基小狗 (Corgi), 线条小狗 (Line puppy) |
| Static (image) | 3 | 夏日海边 (Seaside), 树荫 (Tree shade), 线条小狗 (Line puppy) |

## Textures

7 paper textures: 纸纹 1, 祥云纹 (cloud), 回纹 (fret), 涟漪纹 (ripple), 波浪纹 (wave), 螺旋纹 (spiral), 菱格纹 (diamond).

## Customization

| Category | What you can adjust |
|---|---|
| Theme | 32 presets, or system / light / dark |
| Background | import + crop, or 6 built-in wallpapers |
| Glass | blur, saturation, brightness |
| Texture | 7 patterns, strength, color |
| Position / size | center / top / bottom; cover / contain / actual |
| Surface opacity | 5 zones (main / sidebar / cards / input / settings) |
| Text depth | 5 zones (main / sidebar / cards / input / settings) |
| Keyboard pet | on / off, drag, resize, reset position |

## Install

Prerequisites: a working DeepSeek Harness (`dsh`) with Node.js 18+ and pnpm on your PATH.

```bash
git clone https://github.com/ink5897/dsh-theme-kit.git
cd dsh-theme-kit
dsh plugin --profile web add link:.
```

Restart `dsh web`, then open Settings to see the "Themes & Colors" section.

## Development

The plugin is a single DSH bundle package with no build step; DSH loads the source directly.

- `lib/index.js` — host half: the `themeKit` remote service for persistence and the `/dsh-theme-kit-wallpapers` route that streams the bundled wallpapers.
- `lib/client.js` — browser half: background, theme, text depth, and keyboard pet.
- `wallpapers/` — bundled animated and static wallpapers plus textures.
- `cordis.patch.yml` — the bundle patch that mounts the plugin.

## Known limitations

- Per-zone opacity and text depth are applied through CSS custom-property overrides scoped to the shell DOM; the shell's internal class names may change across versions.
- The keyboard pet and brand-color rules depend on the shell's DOM structure.

## License

MIT
