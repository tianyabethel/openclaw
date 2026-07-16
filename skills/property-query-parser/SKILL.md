---
name: property-query-parser
description: Converts free-text real estate searches into structured MLS property filters.
---

# Property Query Parser

Use this skill when a user provides a natural-language real estate search request.

## Purpose

The skill converts a free-text query into a structured filter object that can later be mapped to the `rets_property` database.

## Supported Filters

| Output Field | MLS Column       |
| ------------ | ---------------- |
| `city`       | `L_City`         |
| `maxPrice`   | `L_SystemPrice`  |
| `beds`       | `L_Keyword2`     |
| `baths`      | `LM_Dec_3`       |
| `sqft`       | `LM_Int2_3`      |
| `type`       | `L_Type_`        |
| `pool`       | `PoolPrivateYN`  |
| `hasView`    | `ViewYN`         |
| `maxHoa`     | `AssociationFee` |

## Example

Input:

```text
Show me 3-bedroom condos in Irvine under $1.5M with a pool.
```
