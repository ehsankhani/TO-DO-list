# 📝 To-Do List App

A beautiful, easy-to-use to-do list app that helps you stay organized. All your tasks are saved automatically in your browser.

---

## ✨ Quick Start
just visit here : https://ehsankhani.github.io/TO-DO-list/
**Get started in 3 steps:**

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev

# 3. Open your browser
# The app will open at http://localhost:5173
```

That's it! Start adding tasks right away.

---

## 🎯 What You Can Do

### The Basics
- ✅ **Add tasks** - Click "Add Task" or use the quick form
- ✏️ **Edit tasks** - Click "Edit" on any task or press Enter
- 🗑️ **Delete tasks** - Click "Delete" or use bulk actions
- ✅ **Mark complete** - Check the box or click the task

### Advanced Features (Hidden by default)
- 🔍 **Search** - Find tasks by keyword
- 🏷️ **Tags** - Organize tasks with tags (work, personal, etc.)
- 📅 **Due dates** - Set deadlines
- ⭐ **Priority** - Mark tasks as Low, Medium, or High
- 📊 **Filters** - View by status, priority, or tags
- 🎯 **Bulk actions** - Complete or delete multiple tasks at once

> 💡 **Tip**: Advanced features are hidden by default to keep things simple. Expand the sections when you need them!

---

## 🎨 Features

- **Dark/Light Theme** - Toggle in the header (your preference is saved)
- **Automatic Saving** - Your tasks are saved instantly
- **Keyboard Shortcuts** - Use Enter, Space, Arrow keys for quick navigation
- **Responsive Design** - Works great on desktop, tablet, and mobile

---

## 📖 How to Use

### Adding Your First Task

1. Click the **"Add Task"** button at the top
2. Type a title (required)
3. Optionally add:
   - Description
   - Due date
   - Priority
   - Tags (separate with commas)
4. Click **"Save"**

### Finding Tasks

Use the **search box** at the top to quickly find any task by title or description.

### Organizing Tasks

Click **"Show Filters"** to:
- Filter by status (To Do, In Progress, Done)
- Filter by priority (Low, Medium, High)
- Filter by tags
- Sort by due date or title

### Bulk Actions

Click **"Show Bulk Actions"** when you want to:
- Complete all tasks
- Clear completed tasks
- Delete multiple selected tasks

---

## 🏗️ Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

---

## 🧪 Testing

```bash
# Run tests
npm test
```

Tests cover core functionality: adding, editing, deleting tasks, and filtering.

---

## ⌨️ Keyboard Shortcuts

- **Enter** - Start editing a task (or save if already editing)
- **Space** - Toggle task completion
- **Arrow Keys** - Navigate between tasks
- **Escape** - Close modals or cancel editing

---

## 🛠️ For Developers

### Project Structure

```
src/
  app/              # App-wide setup (theme, providers, styles)
  features/
    todos/          # To-do feature (components, logic, tests)
  shared/           # Reusable utilities and UI components
```

### Tech Stack

- **React** (JavaScript) - UI framework
- **Vite** - Build tool
- **LocalStorage** - Data persistence
- **Jest + React Testing Library** - Testing

### Key Concepts

- **State Management**: Uses `useReducer` for predictable state updates
- **Persistence**: All data is saved to LocalStorage automatically
- **Performance**: Optimized with memoization and virtual scrolling for large lists

---

## 📝 Configuration

You can customize storage keys and animation timing via environment variables:

```bash
# Customize storage key
$env:LOCAL_STORAGE_KEY="my.todos"
npm run dev

# Adjust animation speed (milliseconds)
$env:ANIMATION_MS="200"
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please keep code changes focused and well-tested.

---

## 📄 License

MIT

---

## 💡 Tips

- **Start simple**: Add a few tasks first, then explore filters and tags
- **Use tags**: Tags like "work", "personal", "urgent" help organize tasks
- **Keyboard first**: Once you learn the shortcuts, you'll be much faster
- **Dark mode**: Try the theme toggle - it's easier on the eyes at night

**Enjoy organizing your tasks!** 🎉
