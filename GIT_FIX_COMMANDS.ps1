# ========================================
# BUILDMART GIT CLEANUP - CORRECT COMMANDS
# ========================================
# Run these commands in PowerShell one at a time
# (No commits in repo yet, so use 'git rm --cached' instead of 'git reset HEAD')

# Remove foreign files from staging
git rm --cached ../.bash_history
git rm --cached ../.gitconfig
git rm --cached -r "../.vscode"

# Verify cleanup
git status --short

# Result: Should show empty or only BuildMart files
