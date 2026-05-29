# BuildMart — Building Materials Marketplace

## Tech Stack
- React 18
- CSS Modules (component-scoped styles)
- No external UI library — pure custom teal design system

## Project Structure

```
buildmart/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js / Navbar.module.css
│   │   ├── Hero.js / Hero.module.css
│   │   ├── FeatureStrip.js / FeatureStrip.module.css
│   │   ├── SearchBar.js / SearchBar.module.css
│   │   ├── Shop.js / Shop.module.css
│   │   ├── ProductCard.js / ProductCard.module.css
│   │   ├── Estimator.js / Estimator.module.css
│   │   ├── Cart.js / Cart.module.css
│   │   ├── Orders.js / Orders.module.css
│   │   └── Suppliers.js / Suppliers.module.css
│   ├── data/
│   │   └── products.js
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Setup

```bash
npm install
npm start
```
