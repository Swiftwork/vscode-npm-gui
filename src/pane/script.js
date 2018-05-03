(function (uri) {

  function execute(command, args) {
    args = Object.assign({}, args, { uri });
    window.parent.postMessage({
      command: 'did-click-link',
      data: `command:npm-gui.${command}?${encodeURIComponent(JSON.stringify(args))}`
    }, 'file://');
  }

  const selection = [];
  let $table;
  let $rows;
  let $install;

  function main() {
    $install = document.querySelector('#install');
    $table = document.querySelector('.dependencies');
    $rows = $table.querySelectorAll('.dependency');
    bindEvents();
  }

  function bindEvents() {
    /* TODO: add install to event delegator because caption is inside table */
    $install.addEventListener('click', install.bind(this));
    $install.addEventListener('keydown', enterKey.bind(this, install));
    /* Row */
    $table.addEventListener('click', eventDelegate.bind(this));
    $table.addEventListener('keydown', enterKey.bind(this, eventDelegate));
  }

  /**
   * Parent event delegator
   * @param {MouseEvent | KeyboardEvent} ev the activating event
   */
  function eventDelegate(ev) {
    const $target = ev.target;
    const $row = $target.closest('tr');
    if (!$row) return false;

    // Update dependency
    if ($target.classList.contains('version') && $target.classList.contains('latest')) {
      updateDependency($row.dataset.dependency);
      return true;
    }

    // Fall back to expand
    const state = !($row.getAttribute('aria-expanded') === 'true');
    collapse.apply(this, $rows);
    if (state) expand($row);
  }

  /* === ACTIONS === */

  /**
   * Collapse all row extras
   * @param {...Element} $rows the dependency rows which to collapse
   */
  function collapse(...$rows) {
    $rows.forEach($row => {
      const $extra = row.nextElementSibling;
      $row.setAttribute('aria-expanded', false);
      $extra.style.display = 'none';
    });
  }

  /**
   * Expands the row revealing dependency types
   * @param {...Element} $rows the dependency rows which to expand
   */
  function expand(...$rows) {
    $rows.forEach($row => {
      const $extra = $row.nextElementSibling;
      $row.setAttribute('aria-expanded', true);
      $extra.style.display = 'table-row';
    });
  }

  /**
   * Install all updated dependencies
   */
  function install() {
    execute('install');
  }

  /**
   * Update selected dependency
   * @param {object} dependency the dependency data {@link IDependency}
   */
  function updateDependency(dependency) {
    execute('updateDependency', { dependency });
  }

  /**
   * Only triggers function if the key is enter
   * @param {Function} fn 
   * @param {KeyboardEvent} ev 
   */
  function enterKey(fn, ev) {
    if (ev instanceof KeyboardEvent && ev.key !== 'Enter') return false;
    else fn.call(this, ev);
  }

  main();
})(document.getElementsByTagName('base')[0].href);
