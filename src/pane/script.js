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
    const target = ev.target;
    const row = target.closest('tr');
    if (!row) return false;

    // Update dependency
    if (target.classList.contains('version') && target.classList.contains('latest')) {
      updateDependency(row.dataset.dependency);
      return true;
    }

    // Fall back to expand
    const state = !(row.getAttribute('aria-expanded') === 'true');
    collapse.apply(this, rows);
    if (state) expand(row);
  }

  /* === ACTIONS === */

  /**
   * Collapse all row extras
   * @param {...Element} rows the dependency rows which to collapse
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
   * @param {...Element} rows the dependency rows which to expand
   */
  function expand(...rows) {
    rows.forEach(row => {
      const extra = row.nextElementSibling;
      row.setAttribute('aria-expanded', true);
      extra.style.display = 'table-row';
    });
  }

  /**
   * Update selected dependency
   * @param {object} dependency the dependency data {@link IDependency}
   */
  function updateDependency(dependency) {
    execute('updateDependency', dependency);
  }

  /*

  const versionTags = document.querySelectorAll('.version');
  Array.from(versionTags).forEach(tag => {
    tag.addEventListener('click', execute.bind(this, 'updateDependency'));
  });

*/
  main();
})();
