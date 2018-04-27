(function () {

  function execute(command, args) {
    window.parent.postMessage({
      command: 'did-click-link',
      data: `command:npm-gui.${command}?${encodeURIComponent(JSON.stringify(args))}`
    }, 'file://');
  }

  const selection = [];
  let table;
  let rows;

  function main() {
    table = document.querySelector('.dependencies');
    rows = table.querySelectorAll('.dependency');
    bindEvents();
  }

  function bindEvents() {
    /* Row */
    table.addEventListener('click', eventDelegate.bind(this));
    table.addEventListener('keydown', eventDelegate.bind(this));
  }

  /**
   * Parent event delegator
   * @param {Element} table the parent of all dependency rows
   * @param {MouseEvent | KeyboardEvent} ev the activating event
   */
  function eventDelegate(ev) {
    if (ev instanceof KeyboardEvent && ev.key !== 'Enter') return false;

    const row = ev.target.closest('tr');
    if (!row) return false;
    collapse.apply(this, rows);
    toggleExpand(row, row.dataset.dependency);
  }

  /* === ACTIONS === */

  /**
   * Collapse all row extras
   * @param {Element[]} rows 
   */
  function collapse(...rows) {
    rows.forEach(row => {
      const extra = row.nextElementSibling;
      row.setAttribute('aria-expanded', false);
      extra.style.display = 'none';
    });
  }

  /**
   * Expands the row revealing dependency types
   * @param {Element} row the dependency row which to operate on
   */
  function toggleExpand(row, dependency) {
    const extra = row.nextElementSibling;
    const expanded = !(row.getAttribute('aria-expanded') === 'true');
    row.setAttribute('aria-expanded', expanded);
    extra.style.display = expanded ? 'table-row' : 'none';
  }

  /**
   * Update selected dependency
   * @param {object} dependency the dependency data {@link IDependency}
   */
  function updateDependency(dependency) {

  }

  /*

  const versionTags = document.querySelectorAll('.version');
  Array.from(versionTags).forEach(tag => {
    tag.addEventListener('click', execute.bind(this, 'updateDependency'));
  });

*/
  main();
})();
