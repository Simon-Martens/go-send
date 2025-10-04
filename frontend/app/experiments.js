const experiments = {};

function checkExperiments(state, emitter) {
  const all = Object.keys(experiments);
  const id = all.find((id) => experiments[id].eligible(state));
  if (id) {
    const variant = experiments[id].variant(state);
    state.storage.enroll(id, variant);
    experiments[id].run(variant, state, emitter);
  }
}

export default function initialize(state, emitter) {
  emitter.on("DOMContentLoaded", () => {
    const xp = experiments[state.query.x];
    if (xp) {
      xp.run(+state.query.v, state, emitter);
    }
  });
  const enrolled = state.storage.enrolled;
  // single experiment per session for now
  const id = Object.keys(enrolled)[0];
  if (Object.keys(experiments).includes(id)) {
    experiments[id].run(enrolled[id], state, emitter);
  } else {
    checkExperiments(state, emitter);
  }
}
