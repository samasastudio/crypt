---
title: "Cooking System Guide"
type: guide
tags:
  - cooking/moc
---

# Cooking System

This directory is a relational grocery and recipe management system built for Obsidian. It connects HEB order history, product pricing, and recipes through frontmatter properties, `.base` databases, and Dataview queries.

## Structure

```
Cooking/
├── Cooking.md              ← Master index (all recipes + grocery links)
├── Recipes.base            ← Native database: all recipes across sources
├── Recipes/
│   ├── Sams Recipes/       ← 8 original air fryer recipes (markdown)
│   └── Cookbook/            ← 103 recipes from Cooking Lighter (by category)
├── Grocery/
│   ├── Grocery Hub.md      ← Entry point for all grocery data and views
│   ├── Products.base       ← Native database: 78 products by category
│   ├── Orders.base         ← Native database: 43 HEB deliveries
│   ├── Reorder.base        ← Native database: staples needing reorder
│   ├── Price Watch.base    ← Native database: price tracking and swings
│   ├── Products/           ← One note per frequently-purchased HEB item
│   ├── Orders/             ← One note per HEB delivery (2025-01 → 2026-01)
│   ├── Views/              ← Dataview-powered dashboards
│   │   ├── Shopping List Builder.md
│   │   ├── Spend Dashboard.md
│   │   ├── Price Tracker.md
│   │   ├── Reorder Suggestions.md
│   │   └── Product Search.md
│   ├── Grocery Analytics 2025.md
│   ├── GROCERY_DATA_2026_UPDATED.json
│   └── cookbook_recipes.json
└── Tools/
    ├── Cooking Tools.md
    └── grocery-dashboard.jsx
```

## How It Works

**Products are the relational join point.** Each product note has frontmatter with `heb_name`, `avg_price`, `category`, `total_orders`, and `last_ordered`. The `.base` files and Dataview queries both pull from this frontmatter to build live, interactive tables.

**Orders** store per-delivery data including every line item with prices. The raw JSON serves as the canonical data source; order notes make it browsable and queryable within Obsidian.

**Recipes** have frontmatter with nutrition, method, tags, and ingredients. Sam's recipes include full cook sequences for the Philips dual-basket air fryer. Cookbook recipes include page numbers and macro data from *Cooking Lighter by Miranda & Noa*.

## Tag Hierarchy

All tags nest under `cooking/` for clean separation as the vault grows:

- `cooking/recipe/sams` — Sam's original recipes
- `cooking/recipe/cookbook` — Cookbook recipes
- `cooking/recipe/{category}` — e.g. `pasta`, `asian-inspired`, `mexican`
- `cooking/product/{category}` — e.g. `produce`, `protein`, `beverages`
- `cooking/ingredient/{name}` — e.g. `salmon`, `chicken`, `bachans`
- `cooking/method/air-fryer` — Cooking method
- `cooking/style/{type}` — e.g. `bowls`, `salad`, `pasta`
- `cooking/attribute/quick` — Under 20 min recipes
- `cooking/order` — HEB deliveries
- `cooking/view` — Dashboard notes
- `cooking/moc` — Index/hub notes

## Adding a New HEB Order

1. Upload the HEB order confirmation PDF
2. Run the `/heb-ingest` shortcut
3. The shortcut extracts items, creates an order note in `Orders/`, appends to the JSON, and updates product notes with fresh price data
4. New products appearing 4+ times get their own product note automatically

## Weekly Meal Planning Workflow

1. Open `Shopping List Builder.md`
2. Replace the recipe links with this week's planned meals
3. Use the product lookup table to find exact HEB product names
4. Check `Reorder.base` for staples that are overdue
5. Format the final list in HEB Grocery Agent format and paste into the Chrome extension

## Frontmatter Schema

**Recipe notes** use: `type`, `source`, `category`, `method`, `serves`, `time`, `calories`, `protein`, `fat`, `carbs`, `fiber`, `tags`

**Product notes** use: `type`, `aliases`, `category`, `heb_name`, `unit`, `avg_price`, `min_price`, `max_price`, `total_orders`, `total_qty`, `total_spend`, `last_ordered`, `tags`

**Order notes** use: `type`, `order_id`, `date`, `item_count`, `subtotal`, `total`, `delivery_fee`, `driver_tip`, `savings`, `taxes`, `tags`
