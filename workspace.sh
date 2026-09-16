#!/bin/sh

# Set Session Name
SESSION="max-core"

# Start New Session with our name
tmux new-session -d -s $SESSION

# Portrait: 4 panes stacked vertically
tmux split-window -v -t $SESSION:0
tmux split-window -v -t $SESSION:0
tmux select-pane -t 0
tmux split-window -v -t $SESSION:0

# Pane 0: Claude Code
tmux select-pane -t 0
tmux send-keys -t $SESSION:0 'clear' C-m 'claude --model claude-opus-4-8' C-m

# Pane 1: nvim
tmux select-pane -t 1
tmux send-keys -t $SESSION:0 'clear' C-m 'nvim' C-m

# Pane 2: misc actions
tmux select-pane -t 2
tmux send-keys -t $SESSION:0 'clear' C-m

# Pane 3: Storybook
tmux select-pane -t 3
tmux send-keys -t $SESSION:0 'clear' C-m 'pnpm storybook' C-m

tmux select-pane -t 2

# Attach Session, on the Main window
tmux attach-session -t $SESSION:0
