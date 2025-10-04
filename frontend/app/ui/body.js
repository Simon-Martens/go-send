const html = require('choo/html');

module.exports = function body(main) {
  return function(state, emit) {
    const b = html`
      <main
        class="flex flex-col items-center font-sans md:h-screen md:bg-grey-10 dark:bg-black"
      >
        ${main(state, emit)}
      </main>
    `;
    if (state.layout) {
      // server side only
      return state.layout(state, b);
    }
    return b;
  };
};
