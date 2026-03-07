---
title: "Shopping List Builder"
type: "view"
tags:
  - cooking/view
  - cooking/grocery
---

# Shopping List Builder

## This Week's Recipes

Link your planned recipes below:

- [[Bachans Chicken and Veggie Bowl]]
- [[Lemon Garlic Salmon Linguine]]

*(Replace with your actual meal plan for the week)*

## Ingredient Lookup

Use the product search to find exact HEB names for ingredients:

```dataview
TABLE heb_name AS "HEB Product Name", avg_price AS "Avg $", unit
FROM "Cooking/Grocery/Products"
WHERE type = "product"
SORT category, total_orders DESC
```

## Weekly Staples Checklist

Based on your purchase history, these are items ordered in 50%+ of all orders:

```dataview
TABLE category AS "Cat", avg_price AS "Price", total_orders AS "Freq"
FROM "Cooking/Grocery/Products"
WHERE total_orders >= 20
SORT total_orders DESC
```

## HEB Cart Format

After selecting your items, format your list like this for the HEB Grocery Agent extension:

```
[Proteins]
1 lb H-E-B Responsibly Raised Fresh Atlantic Salmon Fillet
1 lb Jennie-O Ground Turkey 93% Lean

[Produce]
3 Fresh Large Hass Avocado
1 Fresh Asparagus Bunch
2 Fresh Seedless Cucumber
1 bunch Fresh Green Onions

[Pantry]
1 Bachan's Hot & Spicy Japanese Barbecue Sauce

[Beverages]
1 Spindrift Sparkling Lime

[Household]
2 Aquaphor Repairing Hand Masks
```

## Order History Reference

Your last 5 orders for reference:

```dataview
TABLE item_count AS "Items", subtotal AS "Subtotal", total AS "Total"
FROM "Cooking/Grocery/Orders"
WHERE type = "order"
SORT date DESC
LIMIT 5
```
