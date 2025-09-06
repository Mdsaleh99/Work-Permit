# Deep Dive: `updateWorkPermitForm` Transaction Logic

This document explains the **transaction logic** inside your `updateWorkPermitForm` controller, line by line, along with fixes and recommendations.

---

## 📌 What Happens Inside the Transaction

```ts
const result = await prisma.$transaction(async (tx) => {
```
- Starts an **interactive transaction**.  
- All DB operations inside run as a single **atomic** unit. If anything throws, **everything rolls back**.

---

### 1. Update the Form

```ts
const updatedForm = await tx.workPermitForm.update({
  where: { id: workPermitFormId },
  data: {
    ...(title && { title }),
    updatedAt: new Date(),
  },
});
```
- Updates the `WorkPermitForm`.  
- Conditionally updates the `title`.  
- Updates `updatedAt`.  

---

### 2. Handle Sections

```ts
if (sections && Array.isArray(sections)) {
```
- Guard: ensures `sections` is an array.  
- If empty `[]`, the block still runs (and deletes all via diff logic).

#### a) Compute existing vs incoming IDs

```ts
const existingSectionIds = workPermit.sections.map((s) => s.id);
const incomingSectionIds = sections.filter((s) => s.id).map((s) => s.id);
```

- `existingSectionIds`: IDs already in DB.  
- `incomingSectionIds`: IDs from request (new sections won’t have IDs).  

#### b) Delete removed sections

```ts
const sectionsToDelete = existingSectionIds.filter(
  (id) => !incomingSectionIds.includes(id)
);
if (sectionsToDelete.length > 0) {
  await tx.workPermitSection.deleteMany({
    where: { id: { in: sectionsToDelete } },
  });
}
```
- Deletes sections missing in request.  
- Cascades delete components due to FK constraint.

#### c) Process each incoming section

```ts
for (const sectionData of sections) {
  const { id: sectionId, title: sectionTitle, enabled = true, components = [] } = sectionData;
```

---

### 3. Case A — Update Existing Section

```ts
if (sectionId && existingSectionIds.includes(sectionId)) {
  await tx.workPermitSection.update({
    where: { id: sectionId },
    data: { title: sectionTitle, enabled, updatedAt: new Date() },
  });
```

- Updates title/enabled for an existing section.

#### ⚠️ Bug: Undefined variable

```ts
const existingSection = existingForm.sections.find((s) => s.id === sectionId);
```
- `existingForm` is **not defined**.  
- Should be:
  ```ts
  const existingSection = workPermit.sections.find((s) => s.id === sectionId);
  ```
  or fetch fresh data inside transaction.

#### d) Diff Components

```ts
const existingComponentIds = existingSection?.components.map((c) => c.id) || [];
const incomingComponentIds = components.filter((c) => c.id).map((c) => c.id);
```

- Builds list of DB vs incoming component IDs.  

**Delete removed components:**
```ts
const componentsToDelete = existingComponentIds.filter(
  (id) => !incomingComponentIds.includes(id)
);
if (componentsToDelete.length > 0) {
  await tx.workPermitSectionComponent.deleteMany({
    where: { id: { in: componentsToDelete } },
  });
}
```

**Update or Create components:**
```ts
if (componentId && existingComponentIds.includes(componentId)) {
  await tx.workPermitSectionComponent.update({ ... });
} else {
  await tx.workPermitSectionComponent.create({ ... });
}
```

---

### 4. Case B — Create New Section

```ts
} else {
  if (!sectionTitle) throw new Error("Section title is required");
  await tx.workPermitSection.create({
    data: {
      workPermitFormId,
      title: sectionTitle,
      enabled,
      components: {
        create: components.map((c) => ({
          label: c.label,
          type: c.type || "text",
          required: c.required ?? true,
          enabled: c.enabled ?? true,
          options: Array.isArray(c.options) ? c.options : [],
        })),
      },
    },
  });
}
```

- Creates a new section and all its components in one nested write.

---

### 5. “Delete All” Branch (Not Reached)

```ts
} else if (sections.length === 0) {
  await tx.workPermitSection.deleteMany({
    where: { workPermitFormId: id },
  });
}
```
- Buggy:  
  - `id` is undefined → should be `workPermitFormId`.  
  - This branch never runs because `Array.isArray([])` is true.  
- **Redundant** since diff logic already handles empty arrays.

---

### 6. Return Updated Form

```ts
return await tx.workPermitForm.findUnique({
  where: { id: workPermitFormId },
  include: {
    sections: {
      include: {
        components: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    },
  },
});
```
- Fetches updated form with all nested relations.  
- Orders both sections and components by `createdAt ASC`.

---

## ⚠️ Fixes & Recommendations

1. **Fix undefined variable**
   - Replace `existingForm` with `workPermit`, or fetch inside transaction.

2. **Remove redundant “delete all” branch**
   - Diff logic already covers it.  

3. **Consistent Prisma client**
   - Use the same (`db` or `prisma`) everywhere.

4. **Micro-optimizations**
   - Cache `const now = new Date()` and reuse.  
   - Drop unused `updatedForm` if not needed.

---

## ✅ Why Use a Transaction?

- **Atomicity** → all updates/deletes/creates succeed or all rollback.  
- **Consistency** → cascades + schema constraints keep data valid.  
- **Isolation** → concurrent edits don’t see partial changes.  
- **Durability** → committed updates survive crashes.  

This ensures the work permit form is always consistent.
