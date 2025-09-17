## Zustand: updateCompanyMemberRole (Short Explanation)

### Main goal
- Update a member’s role instantly in the UI (optimistic update) and keep store data consistent with minimal network round-trips, while matching backend expectations (member `id`).

This explains how the `updateCompanyMemberRole` action in `useCompanyStore` updates the UI and state.

### The action
```js
// store snippet (current)
updateCompanyMemberRole: async (companyId, memberId, role) => {
  set({ companyError: null })
  try {
    const updated = await companyService.updateCompanyMemberRole(companyId, memberId, role)
    set((state) => ({
      companyMembers: (state.companyMembers || []).map(m => (
        // state.companyMembers has a previous data which is fetched
        m.id === memberId
          ? (updated && typeof updated === 'object' ? updated : { ...m, role })
          : m
      ))
    }))
    return updated
  } catch (error) {
    set({ companyError: error })
    throw error
  }
}
```

### Why this shape?
- **Optimistic UI**: We immediately reflect the new role in `companyMembers` so the table updates without waiting for a refetch.
- **Immutable update**: `map(...)` returns a new array; React/Zustand see the change and re-render.
- **Correct target**: Compare with `m.id === memberId` because the backend uses the member record `id` in `/company/:companyId/:memberId/role`.
- **Prefer server object**: Backend now returns the full updated member, so we replace the row with `updated`. If not, we fall back to `{ ...m, role }` (optimistic role update).
- **No nested user**: Since `CompanyMember` has no `user` relation, we update only `member.role` when falling back.

### Focus on the key line

```js
set((state) => ({
  companyMembers: (state.companyMembers || []).map(m => (
    m.id === memberId
      ? (updated && typeof updated === 'object' ? updated : { ...m, role })
      : m
  ))
}))
```

- We compute the next state from the previous state (functional `set`).
- We rebuild `companyMembers` immutably with `map`.
- We replace only the targeted member row by `id`.
- We replace with the server’s updated member if available; otherwise set `role` to the requested value on the existing row.

### Alternatives
- After success, call `getAllCompanyMembers(companyId)` to re-sync from server (source-of-truth, but extra request).


