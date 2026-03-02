# Core Texts Directory

Pages in this directory are one level deep inside `weimar/`, so all resource paths must go up one level with `../`.

## Resource Paths

- CSS: `../css/weimar-styles.css`
- JavaScript: `../js/weimar-interactive.js`
- Favicon: `../resources/images/favicon.png`
- Images: `../resources/images/`
- Maps: `../resources/maps/`

## Page Template

Every new page in core-texts/ must follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] | Weimar Simulation</title>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Source+Sans+Pro:wght@400;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/weimar-styles.css">
    <link rel="icon" type="image/png" href="../resources/images/favicon.png">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1>[Page Title]</h1>
            <p class="subtitle">[Subtitle]</p>
        </div>
    </header>

    <nav class="main-nav">
        <ul>
            <li><a href="../index.html">Introduction</a></li>
            <li><a href="../background/narrative.html">Historical Background</a></li>
            <li><a href="../game/rules.html">The Game</a></li>
            <li><a href="../factions/index.html">Factions</a></li>
            <li><a href="index.html" class="active">Core Texts</a></li>
            <li><a href="../live/government.html">Live Tracker</a></li>
        </ul>
    </nav>

    <main class="container">
        <!-- Page content here -->
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>Democracy in Crisis: Weimar Germany Simulation | HIST 105: Western Civilization</p>
            <p>Yosemite Community College | <a href="https://profhauselmann.org">Professor Hauselmann</a></p>
        </div>
    </footer>

    <script src="../js/weimar-interactive.js"></script>
</body>
</html>
```

## Navigation Links from core-texts/

- To weimar root: `../index.html`
- To other sections: `../factions/`, `../background/`, `../game/`, `../live/`
- To other core-texts pages: `communism.html`, `nazism.html`, etc. (same directory, no prefix)

## Styling

Use the existing CSS classes from `weimar-styles.css`. Key classes for content:
- `.key-facts` — info boxes with shadow
- `.historical-context` — gradient background with left border
- `.key-concept` — yellow dashed border box for definitions
- `.narrative-nav` — in-page table of contents
- `.collapsible` — expandable sections

Reference `communism.html` as the example for how a core-texts page should be structured.
