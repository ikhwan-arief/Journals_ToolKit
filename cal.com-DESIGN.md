# Design System Inspired by Cal.com

## 1. Visual Theme & Atmosphere

Cal.com's design system embodies modern simplicity with a tech-forward sensibility. The visual identity prioritizes clarity and efficiency, reflecting the core mission of frictionless scheduling. A minimalist aesthetic dominates, with generous whitespace, bold typography, and strategic use of deep blacks and vibrant accent colors. The system conveys professionalism and trustworthiness while maintaining an approachable, contemporary feel. Interactions are subtle yet responsive, with smooth transitions that reward user engagement. The design celebrates functional beauty—every element serves a purpose while contributing to an intuitive, premium experience.

**Key Characteristics**
- Minimalist, focused on whitespace and breathing room
- Bold, high-contrast typography creates visual hierarchy
- Deep blacks (`#000000`) paired with pure white for maximum clarity
- Accent colors used strategically to guide user actions
- Clean, sharp edges with minimal rounding (8px for most elements)
- Smooth, responsive interactions with subtle shadow elevation
- Professional yet approachable tone
- Tech-forward, optimized for SaaS workflows

## 2. Color Palette & Roles

### Primary
- **Primary Brand Blue** (`#0000EE`): Primary call-to-action buttons, links, and key interactive elements. Dominates the link color strategy throughout the interface.
- **Black** (`#000000`): Primary text color, button backgrounds, and dominant structural elements. Creates maximum contrast and readability.

### Accent Colors
- **Bright Cyan** (`#0099FF`): Secondary highlights, decorative accents, and supporting interactive states. Often used in combination with primary blue for variation.
- **Purple** (`#6349EA`): Tertiary accent for specific UI features, badges, or specialty interactive states.
- **Teal/Emerald** (`#19A874`): Status indicators, success states, and positive feedback messaging.

### Interactive
- **Blue Links** (`#0000EE`): All hyperlinks, navigation items, and text-based interactions.
- **Dark Semi-Transparent** (`rgba(0, 0, 0, 0.2)`): Icon button backgrounds, subtle hover states, and low-emphasis interactive elements.

### Neutral Scale
- **Near Black** (`#242424`): Secondary text, muted headings, and reduced-emphasis content.
- **Dark Gray** (`#292929`): Tertiary text and disabled state indicators.
- **Warm Gray** (`#374151`): Form labels, caption text, and tertiary information.
- **Medium Gray** (`#6B7280`): Placeholder text and very subtle UI elements.
- **Light Gray** (`#9CA3AF`): Subtle borders and dividers.
- **Very Light Gray** (`#E1E2E3`): Form input borders and light separators.
- **Light Gray** (`#E5E7EB`): Background fills for inactive sections and light container backgrounds.
- **Off White** (`#F4F4F4`): Subtle background tints and ghost button backgrounds.

### Surface & Borders
- **White** (`#FFFFFF`): Primary surface color for cards, containers, and main content areas.
- **Light Gray** (`#E5E7EB`): Subtle border color and light background dividers.
- **Very Light Gray** (`#E1E2E3`): Secondary border treatment for form inputs and low-contrast separators.

## 3. Typography Rules

### Font Family
**Primary:** Cal Sans (display headlines) with fallback to `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Secondary:** Inter (body copy and UI text) via Google Fonts with fallback to `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Monospace (code):** `'Monaco', 'Courier New', monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display/H1 | Cal Sans | 64px | 600 | 70.4px | normal | Major page headings, hero sections |
| Heading/H2 | Cal Sans | 48px | 600 | 52.8px | normal | Section headings, prominent titles |
| Subheading/H3 | Inter | 18px | 300 | 23.4px | normal | Subsection headers, card titles |
| Body | Inter | 14px | 300 | 19.6px | normal | Paragraph text, descriptions, primary content |
| Body Small | Inter | 12px | 400 | 16.8px | normal | Secondary text, metadata, caption-like content |
| Link | sans-serif | 12px | 400 | normal | normal | All hyperlinks and link states |
| Button | sans-serif | 12px | 600 | normal | normal | Button text, strong CTAs |
| Caption | Inter | 11px | 300 | 15.4px | normal | Fine print, timestamps, helper text |

### Principles
- **Contrast-first:** Bold weights (600) for headlines create strong visual hierarchy and support scannability.
- **Generous line height:** Breathing room between lines improves readability and visual comfort, especially in body copy.
- **Semantic sizing:** Three distinct sizes (64px, 48px, 18px, 14px, 12px) provide clear hierarchy without excessive variation.
- **Neutral weight on body:** Lighter weights (300) on body text reduce visual heaviness and create balance with bold headlines.
- **Link consistency:** All links use the same 12px weight-400 treatment for predictable, accessible interactions.

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#000000`
- **Text Color:** `#FFFFFF`
- **Font Size:** 12px
- **Font Weight:** 600
- **Font Family:** sans-serif
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Border:** none
- **Box Shadow:** `rgba(0, 0, 0, 0.15) 0px 4px 12px 0px`
- **Line Height:** normal
- **Hover State:** Background `#242424`, shadow remains consistent
- **Active State:** Background `#000000`, shadow removed
- **Disabled State:** Background `#E5E7EB`, text color `#9CA3AF`, no shadow

#### Secondary Button
- **Background:** `#F4F4F4`
- **Text Color:** `#000000`
- **Font Size:** 12px
- **Font Weight:** 600
- **Font Family:** sans-serif
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Border:** 1px solid `#E5E7EB`
- **Box Shadow:** none
- **Line Height:** normal
- **Hover State:** Background `#E5E7EB`
- **Active State:** Background `#E1E2E3`

#### Ghost Button
- **Background:** transparent
- **Text Color:** `#0000EE`
- **Font Size:** 12px
- **Font Weight:** 400
- **Font Family:** sans-serif
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Border:** 1px solid `#0000EE`
- **Box Shadow:** none
- **Line Height:** normal
- **Hover State:** Background `rgba(0, 0, 238, 0.05)`, border color `#0000EE`
- **Active State:** Background `rgba(0, 0, 238, 0.1)`

#### Icon Button (Circular)
- **Background:** `rgba(0, 0, 0, 0.2)`
- **Text Color:** `#000000`
- **Font Size:** 12px
- **Font Weight:** 400
- **Font Family:** sans-serif
- **Padding:** 0px
- **Width:** 40px
- **Height:** 40px
- **Border Radius:** 40px
- **Border:** none
- **Box Shadow:** none
- **Display:** flex, center alignment
- **Hover State:** Background `rgba(0, 0, 0, 0.3)`

### Links & Navigation

#### Text Link
- **Background:** transparent
- **Text Color:** `#0000EE`
- **Font Size:** 12px
- **Font Weight:** 400
- **Font Family:** sans-serif
- **Padding:** 0px
- **Border:** none
- **Box Shadow:** none
- **Text Decoration:** none
- **Line Height:** normal
- **Hover State:** Text color `#0099FF`, underline appears
- **Active State:** Text color `#0000EE`
- **Visited State:** Text color `#6349EA`

#### Navigation Link (Header)
- **Background:** transparent
- **Text Color:** `#000000`
- **Font Size:** 12px
- **Font Weight:** 400
- **Font Family:** sans-serif
- **Padding:** 20px
- **Border:** none
- **Box Shadow:** none
- **Text Decoration:** none
- **Hover State:** Text color `#0000EE`
- **Active State:** Text color `#0000EE`, underline indicator

### Cards & Containers

#### Standard Card
- **Background:** `#FFFFFF`
- **Border:** 1px solid `#E5E7EB`
- **Border Radius:** 8px
- **Padding:** 32px
- **Box Shadow:** none
- **Hover State:** Box shadow `rgba(0, 0, 0, 0.08) 0px 2px 8px 0px`

#### Elevated Card
- **Background:** `#FFFFFF`
- **Border:** 1px solid `#E1E2E3`
- **Border Radius:** 8px
- **Padding:** 32px
- **Box Shadow:** `rgba(0, 0, 0, 0.15) 0px 4px 12px 0px`

#### Ghost Card
- **Background:** `#F4F4F4`
- **Border:** 1px solid `#E5E7EB`
- **Border Radius:** 8px
- **Padding:** 32px
- **Box Shadow:** none

### Inputs & Forms

#### Text Input Default
- **Background:** `#FFFFFF`
- **Border:** 1px solid `#E1E2E3`
- **Border Radius:** 8px
- **Padding:** 12px 16px
- **Font Size:** 14px
- **Font Weight:** 400
- **Font Family:** sans-serif
- **Color:** `#000000`
- **Line Height:** 19.6px
- **Placeholder Color:** `#9CA3AF`
- **Focus State:** Border color `#0000EE`, box shadow `0 0 0 3px rgba(0, 0, 238, 0.1)`
- **Error State:** Border color `#DC2626`, background tint `rgba(220, 38, 38, 0.05)`
- **Disabled State:** Background `#F4F4F4`, border color `#E5E7EB`, color `#9CA3AF`

#### Label
- **Font Size:** 14px
- **Font Weight:** 600
- **Font Family:** sans-serif
- **Color:** `#374151`
- **Margin Bottom:** 8px

#### Helper Text
- **Font Size:** 12px
- **Font Weight:** 400
- **Font Family:** sans-serif
- **Color:** `#6B7280`
- **Margin Top:** 4px

### Navigation

#### Header Navigation
- **Background:** `#FFFFFF`
- **Border Bottom:** 1px solid `#E5E7EB`
- **Padding:** 16px 32px
- **Display:** flex
- **Align Items:** center
- **Justify Content:** space-between
- **Height:** 72px

#### Navigation Item
- **Font Size:** 12px
- **Font Weight:** 400
- **Color:** `#000000`
- **Padding:** 20px
- **Text Decoration:** none
- **Cursor:** pointer
- **Transition:** color 200ms ease
- **Hover State:** Color `#0000EE`

### Badges

#### Success Badge
- **Background:** `rgba(25, 168, 116, 0.1)`
- **Text Color:** `#19A874`
- **Font Size:** 11px
- **Font Weight:** 600
- **Padding:** 4px 12px
- **Border Radius:** 20px
- **Border:** 1px solid `#19A874`

#### Primary Badge
- **Background:** `rgba(0, 0, 238, 0.1)`
- **Text Color:** `#0000EE`
- **Font Size:** 11px
- **Font Weight:** 600
- **Padding:** 4px 12px
- **Border Radius:** 20px
- **Border:** 1px solid `#0000EE`

#### Neutral Badge
- **Background:** `#E5E7EB`
- **Text Color:** `#374151`
- **Font Size:** 11px
- **Font Weight:** 600
- **Padding:** 4px 12px
- **Border Radius:** 20px
- **Border:** 1px solid `#E1E2E3`

## 5. Layout Principles

### Spacing System

**Base Unit:** 4px

**Scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px, 96px

**Usage Context:**
- **4px / 8px:** Micro spacing between tightly coupled elements (icons + text, form input borders)
- **12px / 16px:** Component internal padding, small gaps between elements
- **20px / 24px:** Section padding, moderate spacing between content blocks
- **32px:** Standard card padding, spacing between major UI sections
- **48px / 64px:** Large spacing between distinct content areas and hero sections
- **96px:** Maximum spacing for page-level sections and full-width separations

### Grid & Container

**Max Width:** 1280px (content area), 1440px (full viewport)

**Column Strategy:** 12-column responsive grid with adaptive column spanning:
- Desktop (1280px+): 12 equal columns, 32px gutter
- Tablet (768px–1279px): 8 columns, 24px gutter
- Mobile (320px–767px): 4 columns, 16px gutter

**Container Padding:**
- Desktop: 48px left/right
- Tablet: 32px left/right
- Mobile: 20px left/right

**Section Patterns:**
- Hero section: Full-width background with centered content container (max 1200px)
- Feature blocks: 3-column grid on desktop, 1-column on mobile
- Card grids: Flexible wrapping with 32px gap, minimum card width 320px
- Content sections: Single-column centered layout with 800px max reading width

### Whitespace Philosophy

Cal.com embraces generous whitespace as a core design principle. Ample negative space around content reduces cognitive load and focuses attention on key information. Sections are clearly separated by 48–96px vertical gaps, preventing content blur. Horizontal padding creates breathing room on smaller screens. The design trusts emptiness to communicate hierarchy and importance; crowded layouts are actively avoided. This approach reinforces the brand's positioning: calm, focused, and efficient.

### Border Radius Scale

- **0px:** None (sharp edges for structural elements like full-width sections)
- **4px:** Very subtle rounding for minimal emphasis
- **8px:** Default rounding for buttons, inputs, cards, and most interactive components
- **20px:** Medium rounding for badges and pill-shaped elements
- **40px:** High rounding for circular icon buttons and near-circular small components
- **100%:** Perfect circles for images and avatar components
- **30%:** Organic, near-circular rounding for decorative image containers

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Cards on plain backgrounds, secondary containers, input fields |
| Raised (sm) | `rgba(0, 0, 0, 0.15) 0px 4px 12px 0px` | Primary buttons, featured cards, popovers, modal windows |
| Hover Subtle | `rgba(0, 0, 0, 0.08) 0px 2px 8px 0px` | Card hover states, interactive surfaces on hover |
| Focus Ring | `0 0 0 3px rgba(0, 0, 238, 0.1)` | Form input focus states, keyboard navigation indicators |
| None | No shadow applied | Disabled buttons, ghost buttons, text links, background fills |

**Shadow Philosophy**

Cal.com uses restraint with shadows. The system employs two primary shadow values: a subtle hover state (`0px 2px 8px`) for interactive feedback and a raised elevation (`0px 4px 12px`) for prominent UI components like primary buttons and modals. This discipline prevents shadow creep and maintains visual clarity. Shadows are always darkly tinted (black with 8–15% opacity) to feel natural and grounded. Disabled and secondary states eliminate shadows entirely to reduce visual weight and clearly communicate reduced interactivity. The result is a design system that feels refined and purposeful rather than layered or complex.

## 7. Do's and Don'ts

### Do
- **Use bold typography hierarchy:** Employ the 64px, 48px, and 18px sizes to create immediately scannable page structure.
- **Leverage primary blue (#0000EE) strategically:** Reserve it for key CTAs, links, and interactive elements that demand user attention.
- **Maintain consistent 8px grid alignment:** All spacing, padding, and component dimensions should be multiples of 4px for visual precision.
- **Apply generous whitespace:** Use full 32px–96px gaps between major sections to reduce cognitive load and enhance focus.
- **Respect the button border radius scale:** Use 8px for standard buttons, 40px for circular icon buttons, and 20px for badges.
- **Test touch targets at 40px minimum:** Ensure all interactive elements meet accessibility standards on mobile devices.
- **Pair black text with white backgrounds:** Max contrast supports readability and reinforces the clean aesthetic.
- **Use shadows sparingly:** Apply the raised shadow only to prominent actions (primary buttons, modals); omit from secondary elements.
- **Create focus rings with the accent blue:** Use `0 0 0 3px rgba(0, 0, 238, 0.1)` on form inputs for keyboard navigation clarity.
- **Indicate hover states clearly:** Buttons should shift background tone; links should underline; cards should gain subtle shadow.

### Don't
- **Don't use multiple shadow depths inconsistently:** Stick to two shadow values (hover subtle, raised) to avoid visual confusion.
- **Don't crowd cards with content:** Maintain 32px padding minimum and separate dense information blocks with 20px gutters.
- **Don't apply primary blue to secondary or disabled states:** Reserve it exclusively for active, interactive, high-priority elements.
- **Don't use thin weights below 14px:** Keep body copy at weight 300–400 minimum for on-screen legibility; never use weight 100.
- **Don't mix more than two accent colors in a single component:** Avoid visual chaos; use secondary colors (cyan, purple, teal) sparingly and purposefully.
- **Don't exceed 1280px content width:** Wider layouts harm readability and violate the design system's focus principle.
- **Don't round corners beyond necessity:** Cap border radius at 8px for most components; use 40px only for perfect circles.
- **Don't nest more than 3 levels of visual hierarchy:** Beyond H3, use weight and size variation, not additional heading levels.
- **Don't add drop shadows to disabled elements:** Shadow absence communicates reduced interactivity; don't contradict this with elevation.
- **Don't ignore keyboard focus states:** Every interactive element must have a visible 3px focus ring with the system's accent blue.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | 320px–767px | 4-column grid, 20px padding, single-column stacking, 12px button height increase to 44px |
| Tablet | 768px–1279px | 8-column grid, 32px padding, 2-column card layouts, navigation collapses to hamburger |
| Desktop | 1280px+ | 12-column grid, 48px padding, multi-column layouts, full horizontal navigation |
| Wide | 1440px+ | 1440px max width enforced, 64px padding, max card widths applied, sidebar navigation possible |

### Touch Targets

- **Minimum Interactive Size:** 40px × 40px (horizontal padding for buttons, full height for tap areas)
- **Button Height on Mobile:** 44px (increased from 40px desktop standard to accommodate thumbs)
- **Link Tap Area:** 40px minimum vertical height, with visual padding to guide finger placement
- **Icon Buttons:** 40px × 40px minimum, with 8px internal padding around icon content
- **Form Input Height:** 44px on mobile, 40px on desktop
- **Spacing Between Touch Targets:** Minimum 8px to prevent accidental adjacent taps

### Collapsing Strategy

**Header & Navigation**
- Desktop: Horizontal nav bar with inline links (12px, weight 400), 16px gaps between items
- Tablet (768px): Consolidate secondary nav into dropdown; primary items remain inline
- Mobile (320px): Convert nav to hamburger menu icon (40px button), full-screen overlay menu on tap

**Grid Layouts**
- Desktop (1280px): 3-column card grid with 32px gaps, full hero sections side-by-side
- Tablet (768px): 2-column card grid, hero layouts reduce to stacked vertical (image below text)
- Mobile (320px): 1-column layout, stacked vertically; remove all side-by-side arrangements

**Spacing Reductions**
- Desktop: 96px between major sections
- Tablet: 64px between major sections
- Mobile: 48px between sections, 32px within sections

**Typography Scaling**
- Desktop H1: 64px
- Tablet H1: 48px
- Mobile H1: 36px
- Body text remains 14px across all breakpoints for accessibility

**Button Behavior**
- Desktop: Inline buttons with 12px–24px padding
- Mobile: Full-width buttons or minimum 44px touch height; stack vertically if multiple buttons

**Image & Media**
- Desktop: Max-width 100%, maintain aspect ratio in flexible containers
- Mobile: Full-width images with 100% scaling; hide decorative imagery below 480px

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA Button:** Black (`#000000` background), white (`#FFFFFF` text)
- **Primary Link:** Blue (`#0000EE`)
- **Secondary Accent:** Cyan (`#0099FF`)
- **Heading Text:** Black (`#000000`)
- **Body Text:** Black (`#000000`)
- **Secondary Text:** Dark Gray (`#242424`)
- **Tertiary Text:** Medium Gray (`#374151`)
- **Success/Positive:** Teal (`#19A874`)
- **Background (Main):** White (`#FFFFFF`)
- **Background (Secondary):** Off-White (`#F4F4F4`)
- **Background (Tertiary):** Light Gray (`#E5E7EB`)
- **Border (Primary):** Very Light Gray (`#E1E2E3`)
- **Border (Secondary):** Light Gray (`#E5E7EB`)
- **Disabled/Placeholder:** Light Gray (`#9CA3AF`)
- **Focus Ring:** Blue (`#0000EE` at 10% opacity, `0 0 0 3px rgba(0, 0, 238, 0.1)`)

### Iteration Guide

1. **Buttons: Use deep black (#000000) backgrounds with white text for all primary CTAs.** Apply `rgba(0, 0, 0, 0.15) 0px 4px 12px 0px` shadow. Implement 8px border radius, 12px font weight, 12px–24px horizontal padding.

2. **Typography hierarchy dominates the interface.** H1 = 64px weight 600 (Cal Sans), H2 = 48px weight 600, body = 14px weight 300 (Inter). Use weight and size—never color alone—to establish hierarchy.

3. **Links are always #0000EE without underline until hover.** On hover, change to #0099FF and add underline. Support visited state in #6349EA.

4. **All interactive elements must have visible focus rings:** `0 0 0 3px rgba(0, 0, 238, 0.1)` on keyboard navigation.

5. **Spacing is always a multiple of 4px.** Use 32px card padding, 48px section gaps, 16px component internal spacing as defaults. Respect the spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96px.

6. **Cards and containers use 1px border in #E5E7EB or #E1E2E3.** Never apply shadow to cards unless explicitly hovering or elevated (use `0px 2px 8px` for hover, `0px 4px 12px` for raised).

7. **Form inputs have 44px height on mobile, 40px on desktop.** Borders are 1px solid #E1E2E3; focus adds 3px accent ring. Placeholder text is #9CA3AF.

8. **Disabled states remove shadows and reduce contrast.** Disabled button background = #E5E7EB, text = #9CA3AF. Never apply effects to disabled elements except opacity reduction (60–70%).

9. **Responsive breakpoints:** Mobile (320px, 1 col, 20px padding), Tablet (768px, 2 col, 32px padding), Desktop (1280px, 3 col, 48px padding). All touch targets minimum 40px height.

10. **Accent colors are used sparingly.** Purple (#6349EA) for tertiary features, Cyan (#0099FF) for secondary links/highlights, Teal (#19A874) for success states only. Primary blue (#0000EE) dominates interactive elements.