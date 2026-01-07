# 🎨 Theme Switcher Guide

## How to Use

### 1. **Start the Development Server**
```bash
cd apps/frontend
npm run dev
```

### 2. **Access the Theme Switcher**

The theme switcher will automatically appear in **development mode** as a floating button in the bottom-right corner.

**For production preview**, add `?theme=true` to any URL:
```
http://localhost:5173/sponsorship/123?theme=true
```

### 3. **Switch Themes in Real-Time**

1. Click the **palette icon** (🎨) button in the bottom-right
2. A menu will appear with all available themes
3. Click any theme to instantly apply it
4. Your selection is **saved automatically** in localStorage

### 4. **Available Themes**

| Theme Name | Style | Best For |
|------------|-------|----------|
| **14Trees (Original)** | Green/Brown nature theme | Current design |
| **Anthropic** | Minimalist, copper accents | Professional, clean |
| **Vercel** | Bold black & blue, high contrast | Modern, tech-forward |
| **Linear** | Purple gradients, premium feel | SaaS, premium products |
| **Stripe** | Indigo/purple, trustworthy | Financial, professional |
| **Shadcn** | Modern, subtle, clean borders | Minimalist, modern |

## Quick Comparison

### To quickly test all themes on the Sponsor Profile page:

1. Navigate to: `/sponsorship/123` or `/group/456`
2. Click the theme switcher button
3. Try each theme one by one
4. See which design fits best with your content

## Theme Characteristics

### **Anthropic Theme**
- **Colors**: Black (#191919) + Copper (#AB6B38)
- **Typography**: System fonts, tight letter spacing
- **Feel**: Minimalist, professional, warm accents

### **Vercel Theme**
- **Colors**: Pure black + Electric blue (#0070F3)
- **Typography**: Bold headings (700 weight), large sizes
- **Feel**: High contrast, modern, tech-forward

### **Linear Theme**
- **Colors**: Purple (#5E6AD2) + Violet (#8B5CF6)
- **Typography**: Inter font, medium weights
- **Feel**: Premium, SaaS-style, sleek

### **Stripe Theme**
- **Colors**: Indigo (#635BFF) + Cyan (#00D4FF)
- **Typography**: System fonts, professional
- **Feel**: Trustworthy, financial, polished

### **Shadcn Theme**
- **Colors**: Zinc grays (#18181B)
- **Typography**: Smaller base size (14px), subtle
- **Feel**: Modern, clean, minimalist

## Customizing Themes

To modify a theme, edit `apps/frontend/src/theme.jsx`:

```javascript
// Example: Make Anthropic theme use green instead of copper
const anthropicTheme = {
  palette: {
    secondary: {
      main: '#2E7D32',  // Changed from copper to green
      // ...
    }
  }
}
```

## Adding a New Theme

1. Open `apps/frontend/src/theme.jsx`
2. Add your theme object:

```javascript
const myCustomTheme = {
  palette: {
    primary: { main: '#YOUR_COLOR' },
    // ... rest of palette
  },
  typography: {
    fontFamily: '"Your Font", sans-serif',
    // ... typography config
  },
  components: {
    // ... component overrides
  }
};
```

3. Register it in the themes registry:

```javascript
export const themes = {
  original: originalTheme,
  // ... other themes
  mycustom: myCustomTheme,  // Add here
};

export const themeNames = {
  // ... other names
  mycustom: 'My Custom Theme',  // Add display name
};
```

4. Refresh the page - your theme will appear in the switcher!

## Tips for Choosing a Theme

1. **Content-heavy pages** → Use Anthropic or Shadcn (better readability)
2. **Data dashboards** → Use Vercel or Stripe (high contrast)
3. **Premium products** → Use Linear (modern, sleek)
4. **Nature/Environmental** → Keep Original (on-brand)

## Removing the Theme Switcher

The switcher only appears in:
- Development mode (`npm run dev`)
- Production URLs with `?theme=true`

It's **automatically hidden** in production builds without the query parameter.

## Persistence

Your theme choice is saved in `localStorage` under the key `appTheme`.

To reset to default:
```javascript
localStorage.removeItem('appTheme');
// Then refresh the page
```
