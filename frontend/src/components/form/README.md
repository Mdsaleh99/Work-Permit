# Form Builder - Modular Architecture

This document describes the new modular architecture of the Form Builder component, which has been refactored for better maintainability, readability, and reusability.

## 🏗️ Architecture Overview

The Form Builder has been broken down into smaller, focused components and custom hooks:

```
FormBuilderModular.jsx (Main Component)
├── Custom Hooks
│   ├── useFormBuilder.js (Main state management)
│   ├── useDraftOperations.js (Draft operations)
│   └── useFormOperations.js (Form operations)
├── UI Components
│   ├── FormBuilderHeader.jsx (Header with actions)
│   ├── FormBuilderSidebar.jsx (Sidebar with sections)
│   ├── FormSection.jsx (Main form area)
│   ├── DraftsModal.jsx (Drafts management)
│   └── DeclarationModal.jsx (Declaration checkboxes)
└── Existing Components
    ├── PrintView.jsx (Print functionality)
    ├── ComponentPalette.jsx (Component palette)
    └── ReorderableList.jsx (Drag & drop)
```

## 📁 File Structure

### Custom Hooks

#### `useFormBuilder.js`
- **Purpose**: Main state management for the form builder
- **Responsibilities**:
  - Form data state
  - UI state (modals, sidebar, etc.)
  - Store integration (Zustand stores)
  - Company data initialization
  - Mobile detection

#### `useDraftOperations.js`
- **Purpose**: Handles all draft-related operations
- **Responsibilities**:
  - Auto-save functionality
  - Create new drafts
  - Load existing drafts
  - Clear drafts
  - Duplicate drafts
  - Debug functions

#### `useFormOperations.js`
- **Purpose**: Handles form manipulation operations
- **Responsibilities**:
  - Add/update/delete components
  - Toggle section enabled state
  - Update section titles
  - Reorder sections and components
  - Declaration management
  - Form reset

### UI Components

#### `FormBuilderModular.jsx`
- **Purpose**: Main orchestrator component
- **Responsibilities**:
  - Coordinate between hooks and components
  - Handle form submission
  - Manage modal states
  - Route navigation

#### `FormBuilderHeader.jsx`
- **Purpose**: Top header with actions and controls
- **Features**:
  - Form title editing
  - Action buttons (Save, Submit, Print, etc.)
  - Auto-save indicators
  - Mobile-responsive design

#### `FormBuilderSidebar.jsx`
- **Purpose**: Left sidebar with sections and components
- **Features**:
  - Collapsible sidebar
  - Section management
  - Component palette
  - Draft management
  - Drag & drop zones

#### `FormSection.jsx`
- **Purpose**: Main form editing area
- **Features**:
  - Component rendering
  - Component editing
  - Drag & drop reordering
  - Component configuration

#### `DraftsModal.jsx`
- **Purpose**: Modal for managing drafts
- **Features**:
  - List all drafts
  - Open, duplicate, delete drafts
  - Draft information display
  - Auto-save indicators

#### `DeclarationModal.jsx`
- **Purpose**: Modal for declaration checkboxes
- **Features**:
  - Declaration management
  - Form submission validation
  - User agreement flow

## 🔧 Benefits of Modular Architecture

### 1. **Separation of Concerns**
- Each component has a single responsibility
- Logic is separated from UI
- State management is centralized in hooks

### 2. **Reusability**
- Components can be reused in other parts of the application
- Hooks can be shared across components
- Clear interfaces between components

### 3. **Maintainability**
- Easier to debug and fix issues
- Changes are isolated to specific components
- Clear code organization

### 4. **Testability**
- Each component can be tested independently
- Hooks can be tested in isolation
- Mock dependencies easily

### 5. **Readability**
- Smaller, focused files
- Clear naming conventions
- Well-documented interfaces

## 🚀 Usage

### Basic Usage
```jsx
import FormBuilderModular from './FormBuilderModular';

<FormBuilderModular
  title="My Form"
  sectionsTemplate={sections}
  startWithTemplate={true}
  workPermitId={null}
/>
```

### Using Individual Components
```jsx
import FormBuilderHeader from './FormBuilderHeader';
import FormBuilderSidebar from './FormBuilderSidebar';

// Use components independently
<FormBuilderHeader {...headerProps} />
<FormBuilderSidebar {...sidebarProps} />
```

### Using Custom Hooks
```jsx
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { useDraftOperations } from '../../hooks/useDraftOperations';

// Use hooks independently
const formState = useFormBuilder(props);
const draftOps = useDraftOperations(formState);
```

## 📝 Migration Guide

### From Old FormBuilder to New Modular Version

1. **Replace the import**:
   ```jsx
   // Old
   import FormBuilder from './FormBuilder';
   
   // New
   import FormBuilderModular from './FormBuilderModular';
   ```

2. **Update component usage**:
   ```jsx
   // Old
   <FormBuilder {...props} />
   
   // New
   <FormBuilderModular {...props} />
   ```

3. **Props remain the same**:
   - `title`
   - `sectionsTemplate`
   - `startWithTemplate`
   - `workPermitId`

## 🧪 Testing

Each component and hook can be tested independently:

```jsx
// Test individual components
import { render } from '@testing-library/react';
import FormBuilderHeader from './FormBuilderHeader';

test('renders header with title', () => {
  render(<FormBuilderHeader formData={{ title: 'Test' }} />);
  // Test assertions
});

// Test custom hooks
import { renderHook } from '@testing-library/react';
import { useFormBuilder } from '../../hooks/useFormBuilder';

test('initializes form data correctly', () => {
  const { result } = renderHook(() => useFormBuilder({ title: 'Test' }));
  expect(result.current.formData.title).toBe('Test');
});
```

## 🔮 Future Enhancements

1. **Add TypeScript**: Convert to TypeScript for better type safety
2. **Add Storybook**: Create stories for each component
3. **Add Unit Tests**: Comprehensive test coverage
4. **Add Performance Optimization**: Memoization and lazy loading
5. **Add Accessibility**: ARIA labels and keyboard navigation

## 📚 Related Files

- `FormBuilder.jsx` - Original monolithic component (can be removed after migration)
- `PrintView.jsx` - Print functionality (unchanged)
- `ComponentPalette.jsx` - Component palette (unchanged)
- `ReorderableList.jsx` - Drag & drop (unchanged)

## 🤝 Contributing

When adding new features:

1. **Identify the right component** to modify
2. **Extract logic to hooks** if it's reusable
3. **Keep components focused** on a single responsibility
4. **Update this documentation** if architecture changes
5. **Add tests** for new functionality

---

This modular architecture makes the Form Builder more maintainable, testable, and easier to understand while preserving all existing functionality.
