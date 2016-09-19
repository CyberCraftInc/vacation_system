# ~/.bashrc: executed by bash(1) for non-login shells.

# Note: PS1 and umask are already set in /etc/profile. You should not
# need this unless you want different defaults for root.
# PS1='${debian_chroot:+($debian_chroot)}\h:\w\$ '
# umask 022

# Aliases
alias ls='ls --color=auto'
alias ll='ls -ahlF --group-directories-first'
alias grep='grep --color=auto'

# Bindings
## Bash history autocompletion bindings.
bind '"\e[A": history-search-backward'
bind '"\e[B": history-search-forward'

# Functions
function get_container_ip {
  hostname -I | cut -d ' ' -f1
}

function get_container_service {
  echo $SERVICE_NAME
}

# Custom PS1 from container ENV variable
export PS1=$CONTAINER_PS1
