# Component Interaction Testing Guide

## 🧪 What to Test

### 1. Buttons
**Test each button type in BOTH light and dark themes**

#### Primary Button (Teal)
```
[ ] Default state
    - Teal background
    - White text readable
    - Proper shape and size

[ ] Hover state
    - Background darkens
    - Shadow appears
    - Cursor changes to pointer
    - Smooth transition (~200ms)

[ ] Active/Pressed state
    - Darker background
    - Slight scale change
    - Shadow depth changes

[ ] Focus state (keyboard)
    - Blue outline visible
    - Easily navigable with Tab key
    - Focus ring clearly visible

[ ] Disabled state
    - Faded appearance
    - Cursor shows not-allowed
    - Click has no effect
    - Clearly shows disabled state

[ ] Ripple effect (if applicable)
    - Smooth animation
    - Emanates from click point
```

#### Secondary Button
```
[ ] Default state
    - Border visible
    - Text clear
    - Transparent/muted background

[ ] Hover state
    - Background highlights
    - Border color changes
    - Smooth transition

[ ] Focus state
    - Keyboard navigation works
    - Focus ring visible

[ ] Disabled state
    - Clear disabled appearance
```

#### Ghost Button
```
[ ] Default state
    - Minimal styling
    - Text visible
    - No background

[ ] Hover state
    - Background highlights
    - Text color changes
    - Smooth transition

[ ] Focus state
    - Keyboard accessible
    - Focus visible
```

### 2. Form Inputs
**Test in both light and dark themes**

#### Text Input
```
[ ] Default state
    - Border visible
    - Background contrasts with border
    - Placeholder text visible
    - Text readable

[ ] Focus state
    - Border turns teal
    - Background slightly lighter
    - Cursor visible inside
    - Clear focus ring
    - ~200ms transition

[ ] Filled state
    - Text readable
    - Placeholder disappears
    - Value clearly shown

[ ] Error state
    - Red border
    - Error message visible
    - Clear visual feedback

[ ] Success state
    - Green border
    - Success message or icon
    - Clear positive feedback

[ ] Disabled state
    - Grayed out appearance
    - Not clickable
    - Clear disabled state
```

#### Select Dropdown
```
[ ] Default state
    - Border visible
    - Dropdown arrow visible
    - Selected value shown
    - Clickable

[ ] Focus state
    - Border color changes
    - Keyboard arrow keys work
    - Can navigate options with up/down
    - Can select with Enter

[ ] Open state
    - Options dropdown appears
    - Options readable
    - Hover on options highlights them
    - Good contrast

[ ] Selection
    - Selected option highlights
    - Selection closes dropdown
    - New value shows in input

[ ] Disabled state
    - Grayed out
    - Not clickable
    - Clear disabled appearance
```

#### Textarea
```
[ ] Default state
    - Visible border
    - Placeholder visible
    - Resizable (handles visible)

[ ] Focus state
    - Border color changes to teal
    - Focus ring visible
    - Can type freely

[ ] Error state
    - Red border
    - Error message shows
```

### 3. Navigation
**Test in both themes**

#### Navbar
```
[ ] Logo clickable
    - Links to home
    - Visual feedback on click

[ ] Nav links
    - All visible
    - Proper spacing
    - Readable text

[ ] Active link
    - Underline appears
    - Teal color applied
    - Distinguishable from inactive

[ ] Hover on link
    - Color changes
    - Underline appears/highlights
    - Smooth transition

[ ] Cart button
    - Clickable
    - Badge number updates
    - Color changes on hover

[ ] Theme toggle
    - Clicking changes theme
    - Icon changes (sun/moon)
    - All colors update
    - No page reload needed
```

### 4. Cards
**Test in both themes**

#### Product Card
```
[ ] Default state
    - Card visible
    - Image displays
    - Title readable
    - Price readable
    - Add button visible

[ ] Hover state
    - Shadow appears
    - Card lifts slightly
    - Image scales
    - Smooth animation

[ ] Click
    - Maybe selects product
    - Visual feedback

[ ] Button interaction
    - Add to cart button responsive
    - Changes on hover
    - Click adds item
```

#### Order Card
```
[ ] Status badge
    - Color matches status (delivered=green, pending=gray, etc)
    - Text readable
    - Background color visible

[ ] Timeline
    - Steps visible
    - Completed steps show checkmark
    - Current step highlighted
    - Lines connect steps

[ ] Details button
    - Expandable/collapsible
    - Shows/hides content
    - Smooth animation
```

### 5. Form Validation
**Test form interaction**

#### Estimator Form
```
[ ] Project Name input
    - Visible in light theme ✓
    - Focused state clear
    - Can type
    - Validation works

[ ] Client Name input
    - Visible in light theme ✓
    - Clear focus state
    - Can type

[ ] Location dropdown
    - Opens properly
    - Options readable
    - Selection works
    - Updates display

[ ] Custom Project textarea
    - Visible
    - Focusable
    - Can type
    - Resizable

[ ] Form submission
    - All fields required
    - Error states show
    - Success confirmation appears
```

### 6. Modals/Overlays
**Test dialog boxes**

```
[ ] Modal appears
    - Centered on screen
    - Overlay darkens background
    - Clickable inside modal

[ ] Modal content
    - Title visible
    - Form fields functional
    - Buttons clickable

[ ] Close button
    - Visible and clickable
    - Dismisses modal
    - Returns focus to page

[ ] Backdrop click
    - Clicking outside closes modal
    - If enabled

[ ] Tab focus
    - Tab stays within modal
    - Doesn't focus page behind
```

### 7. Transitions & Animations
**Test smoothness**

```
[ ] Button hover
    - Smooth color transition (~200ms)
    - No stuttering
    - No lag

[ ] Focus states
    - Clear visual change
    - Instant or smooth

[ ] Form input focus
    - Border changes smoothly
    - Background transitions

[ ] Modal appearance
    - Smooth fade-in
    - Instant or 200ms max

[ ] Theme toggle
    - Colors change instantly
    - No flicker
    - All elements update
```

---

## ✅ Testing Checklist

### Light Theme
- [ ] All buttons work
- [ ] All form inputs functional
- [ ] Navigation clear
- [ ] Cards visible
- [ ] Modals usable
- [ ] Transitions smooth

### Dark Theme
- [ ] All buttons work
- [ ] Form inputs functional
- [ ] Navigation usable
- [ ] Cards visible
- [ ] Modals readable
- [ ] Transitions smooth

---

## 🔍 How to Test

1. **Open the app** in both light and dark themes
2. **For EACH component:**
   - Test default state
   - Test hover state
   - Test focus state (Tab key)
   - Test active state
   - Test disabled state
   - Test error state (if applicable)
3. **Check transitions** are smooth
4. **Verify accessibility** with keyboard
5. **Document any issues**

---

## 📋 Testing Template

**Component:** [Name]  
**Theme:** [Light / Dark]  
**Status:** [ ] Pass [ ] Fail  

**Default State:**
- [ ] Visible
- [ ] Readable
- [ ] Correct colors

**Hover State:**
- [ ] Smooth transition
- [ ] Visual feedback clear
- [ ] Transition time ~200ms

**Focus State:**
- [ ] Keyboard accessible (Tab)
- [ ] Focus ring visible
- [ ] Can interact with keyboard

**Active State:**
- [ ] Clear active appearance
- [ ] Distinct from default

**Disabled State:**
- [ ] Clear disabled appearance
- [ ] Not clickable
- [ ] Cursor shows not-allowed

**Issues Found:**
[List any problems]

**Fixed:**
[ ] Yes [ ] No

---

## 🎬 Interaction Testing Flow

1. Open app in Chrome
2. Open light theme
3. Test each component
4. Toggle to dark theme
5. Re-test each component
6. Toggle keyboard navigation with Tab
7. Test form submission
8. Document findings
9. Fix any issues
10. Re-test

