(function () {
  function execute(command, args) {
    console.log(command);
    window.parent.postMessage({
      command: 'did-click-link',
      data: `command:${command}?${encodeURIComponent(JSON.stringify(args))}`
    }, 'file://');
  }
})();
