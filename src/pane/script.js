function execute(command, args) {
  window.parent.postMessage({
    command: 'did-click-link',
    data: `command:${command}?${encodeURIComponent(JSON.stringify(args))}`
  }, 'file://');
}
