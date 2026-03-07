---
title: "Grocery Hub"
type: "moc"
tags:
  - cooking/moc
---

# Grocery Hub

## Bases (Native Databases)

- [[Cooking/Grocery/Products.base|Products]] — All 78 tracked products with price, frequency, and category views
- [[Cooking/Grocery/Orders.base|Orders]] — 43 HEB deliveries sortable by date, total, and item count
- [[Cooking/Grocery/Reorder.base|Reorder]] — Staples you haven't ordered recently, flagged by status
- [[Cooking/Grocery/Price Watch.base|Price Watch]] — Price swings, most expensive items, highest spend
- [[Cooking/Recipes.base|Recipes]] — Sam's recipes + Cookbook browsable by macros, category, method

## Dataview Views

- [[Shopping List Builder]] — Plan weekly orders from recipes + HEB cart format
- [[Spend Dashboard]] — Monthly spending trends (Dataviewjs charts)
- [[Price Tracker]] — Dataview tables for price history
- [[Reorder Suggestions]] — Dataview + nutritional gap recommendations
- [[Product Search]] — Browse products by category

## Data

- [[Grocery Analytics 2025]] — Full year summary and nutrition assessment
- 78 product notes in `Products/` — one per frequently-purchased item
- 43 order notes in `Orders/` — one per HEB delivery
- Raw JSON: `GROCERY_DATA_2026_UPDATED.json`, `cookbook_recipes.json`

## How This System Works

**Products** are the relational join point. Each product note has frontmatter with `heb_name`, `avg_price`, `category`, `total_orders`, and `last_ordered`. Both `.base` files and Dataview queries pull from this frontmatter.

**Orders** store per-delivery data: date, item list with prices, totals. Query across them for purchase history on any item.

**Bases** (`.base` files) provide native interactive tables — filterable, sortable, with computed columns via formulas. No plugins required.

**Dataview Views** handle more complex queries like JS-powered charts, cross-referencing recipes with products, and aggregations.

**Adding a new order:** Upload the HEB order confirmation PDF and run the `/heb-ingest` shortcut. It extracts items, appends to the JSON, creates an order note, and updates product notes with new price data.

## Quick Queries

### What did I pay for salmon last time?
```dataview
LIST
FROM "Cooking/Grocery/Products"
WHERE contains(title, "Salmon")
```

### Orders over $250
```dataview
TABLE date, item_count AS "Items", total AS "Total"
FROM "Cooking/Grocery/Orders"
WHERE total > 250
SORT date DESC
```
