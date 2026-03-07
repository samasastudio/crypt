---
title: "Product Search"
type: "view"
tags:
  - cooking/view
  - cooking/grocery
---

# Product Search

## By Category

### Protein
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "protein"
SORT total_orders DESC
```

### Produce
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "produce"
SORT total_orders DESC
```

### Pantry
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "pantry"
SORT total_orders DESC
```

### Dairy
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "dairy"
SORT total_orders DESC
```

### Beverages
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "beverages"
SORT total_orders DESC
```

### Grains
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "grains"
SORT total_orders DESC
```

### Snacks
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "snacks"
SORT total_orders DESC
```

### Household & Personal Care
```dataview
TABLE avg_price AS "Avg $", total_orders AS "Orders", last_ordered AS "Last Order"
FROM "Cooking/Grocery/Products"
WHERE category = "household" OR category = "personal-care"
SORT total_orders DESC
```
