# 🧹 Git Staging Cleanup Guide

## Problem
Foreign files from a portfolio project and VS Code extensions are staged in git. These don't affect BuildMart but should be removed from git tracking.

## Solution

### Option 1: Quick Cleanup (Recommended)
Run these commands from the BuildMart root directory:

```bash
# Remove all foreign files from staging
git reset HEAD ../.bash_history
git reset HEAD ../.gitconfig
git reset HEAD "../.vscode/My Portfolio"
git reset HEAD "../.vscode/extensions"
git reset HEAD "../.vscode/argv.json"

# Verify the reset
git status --short
```

### Option 2: Bulk Reset Everything Not in BuildMart
```bash
# Reset all files from parent directories
git reset HEAD ../

# Keep only BuildMart files staged (if any)
git status --short
```

### Option 3: Add to .gitignore (Prevent Future Staging)
```bash
# Add this to .gitignore
cat >> .gitignore << 'EOF'

# Parent directory files (VS Code, system files)
../.vscode/
../.bash_history
../.gitconfig
EOF

git add .gitignore
git commit -m "chore: add parent directory files to gitignore"
```

## Verify Success

After cleanup, these should show NO output:
```bash
git status --short
```

Or this should show ONLY BuildMart files (if any are still staged):
```bash
git status
```

## If You Made a Mistake

Undo the resets:
```bash
git reset --soft HEAD~1
```

Then try again.

---

**Note:** This cleanup only removes files from git staging. The actual files on disk remain untouched.
