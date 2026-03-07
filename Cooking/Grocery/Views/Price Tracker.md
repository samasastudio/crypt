---
title: "Price Tracker"
type: "view"
tags:
  - cooking/view
  - cooking/grocery
---

# Price Tracker

## All Products by Spend

```dataviewjs
dv.table(
  ["Product", "Category", "Avg Price", "Range", "Orders", "Total Spent"],
  dv.pages('"Cooking/Grocery/Products"')
    .where(p => p.type === "product")
    .sort(p => p.total_spend, "desc")
    .map(p => [
      p.file.link,
      p.category,
      `$${p.avg_price}`,
      `$${p.min_price} – $${p.max_price}`,
      p.total_orders,
      `$${p.total_spend}`
    ])
);
```

## Price Increases (Max > 1.2x Min)

```dataviewjs
dv.table(
  ["Product", "Min", "Max", "Increase", "Orders"],
  dv.pages('"Cooking/Grocery/Products"')
    .where(p => p.type === "product" && p.min_price > 0 && (p.max_price / p.min_price) > 1.2)
    .sort(p => p.max_price / p.min_price, "desc")
    .map(p => [
      p.file.link,
      `$${p.min_price}`,
      `$${p.max_price}`,
      `${((p.max_price / p.min_price - 1) * 100).toFixed(0)}%`,
      p.total_orders
    ])
);
```
