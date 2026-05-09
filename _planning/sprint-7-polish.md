# Sprint 7 — Polish

**Goal:** Empty states, overdue highlighting, keyboard shortcuts, and overall UX smoothing.

## Tasks

### Empty States
- No projects: illustration + "Create your first project" CTA
- No tasks in column: dashed border placeholder
- No milestones: sidebar prompt

### Overdue Highlighting
- Task cards: red left border if `isOverdue`
- List view: red due date text
- Sidebar milestone: amber "at-risk" if any tasks are overdue

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `N` | New task (opens TaskModal in add mode) |
| `M` | New milestone (opens MilestoneModal in add mode) |
| `Esc` | Close any open modal |
| `1` / `2` / `3` | Switch view (Board / List / Timeline) |

### Other
- Smooth modal open/close transitions (CSS transition, not a library)
- Tag input in TaskModal: comma-separated or Enter to add
- Confirm dialog before delete
- `updated_at` shown on task in edit mode ("Last updated 2 days ago")

## Acceptance Criteria
- [ ] All empty states render correctly
- [ ] Overdue tasks highlighted in both board and list views
- [ ] Keyboard shortcuts work and don't fire in input fields
- [ ] Modals open/close with transition
- [ ] Delete shows confirmation before removing

## Estimated Complexity: Low–Medium
