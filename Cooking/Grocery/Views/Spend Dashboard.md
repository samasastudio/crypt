---
title: "Spend Dashboard"
type: "view"
tags:
  - cooking/view
  - cooking/grocery
---

# Spend Dashboard

## Monthly Spending

```dataviewjs
const orders = dv.pages('"Cooking/Grocery/Orders"')
  .where(p => p.type === "order")
  .sort(p => p.date, "asc");

const monthly = orders.groupBy(p => p.date.toFormat("yyyy-MM"))
  .map(g => ({
    month: g.key,
    orders: g.rows.length,
    spend: g.rows.values.reduce((s, r) => s + (r.total || 0), 0)
  }))
  .sort(g => g.month, "asc");

dv.table(
  ["Month", "Orders", "Total Spend", "Avg/Order"],
  monthly.map(m => [
    m.month,
    m.orders,
    `$${m.spend.toFixed(2)}`,
    `$${(m.spend / m.orders).toFixed(2)}`
  ])
);
```

## Spending by Category (Products)

```dataviewjs
const products = dv.pages('"Cooking/Grocery/Products"')
  .where(p => p.type === "product");

const byCat = products.groupBy(p => p.category)
  .map(g => ({
    category: g.key,
    spend: g.rows.values.reduce((s, r) => s + (r.total_spend || 0), 0),
    items: g.rows.length
  }))
  .sort(g => g.spend, "desc");

dv.table(
  ["Category", "Products", "Total Spend"],
  byCat.map(c => [c.category, c.items, `$${c.spend.toFixed(2)}`])
);
```

## Recent Orders

```dataviewjs
dv.table(
  ["Date", "Items", "Subtotal", "Total"],
  dv.pages('"Cooking/Grocery/Orders"')
    .where(p => p.type === "order")
    .sort(p => p.date, "desc")
    .limit(10)
    .map(p => [p.file.link, p.item_count, `$${p.subtotal}`, `$${p.total}`])
);
```
