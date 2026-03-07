---
title: "Reorder Suggestions"
type: "view"
tags:
  - cooking/view
  - cooking/grocery
---

# Reorder Suggestions

Items you buy frequently but haven't ordered recently.

## Staples Not Ordered in 30+ Days

```dataviewjs
const cutoff = dv.date("now").minus({days: 30});

dv.table(
  ["Product", "Category", "Frequency", "Last Ordered", "Days Ago"],
  dv.pages('"Cooking/Grocery/Products"')
    .where(p => p.type === "product" && p.total_orders >= 6 && dv.date(p.last_ordered) < cutoff)
    .sort(p => p.total_orders, "desc")
    .map(p => {
      const last = dv.date(p.last_ordered);
      const days = Math.round((dv.date("now") - last).days);
      return [p.file.link, p.category, `${p.total_orders} orders`, p.last_ordered, `${days}d`];
    })
);
```

## High-Frequency Items (10+ orders)

```dataviewjs
dv.table(
  ["Product", "Category", "Orders", "Last Ordered", "Avg Price"],
  dv.pages('"Cooking/Grocery/Products"')
    .where(p => p.type === "product" && p.total_orders >= 10)
    .sort(p => p.total_orders, "desc")
    .map(p => [p.file.link, p.category, p.total_orders, p.last_ordered, `$${p.avg_price}`])
);
```

## Nutritional Gap Items to Consider Adding

These address low scores in whole grains, cruciferous veg, and fiber:

- Brown rice or quinoa (whole grains score: 18/100)
- Broccoli, brussels sprouts, cauliflower (cruciferous score: 22/100)
- Oats, farro, whole wheat bread (fiber score: 38/100)
- Greek yogurt, cottage cheese (calcium score: 45/100)
