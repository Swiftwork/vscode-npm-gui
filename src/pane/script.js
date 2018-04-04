(function () {

  function execute(command, args) {
    window.parent.postMessage({
      command: 'did-click-link',
      data: `command:npm-gui.${command}?${encodeURIComponent(JSON.stringify(args))}`
    }, 'file://');
  }

  /* EVENTS */
  const versionTags = document.querySelectorAll('.version');
  Array.from(versionTags).forEach(tag => {
    tag.addEventListener('click', execute.bind(this, 'updateDependency'));
  });
})();
