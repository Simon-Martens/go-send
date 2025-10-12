import { FluentBundle, FluentResource } from "@fluent/bundle";

function makeBundle(locale, ftl) {
  const bundle = new FluentBundle(locale, { useIsolating: false });
  bundle.addResource(new FluentResource(ftl));
  return bundle;
}

// INFO: Explicit locale imports - to avoid the glob helper chunk
// which kinda needs an extra network request.
const localeLoaders = {
  an: () => import("../locales/an.ftl"),
  ar: () => import("../locales/ar.ftl"),
  ast: () => import("../locales/ast.ftl"),
  az: () => import("../locales/az.ftl"),
  azz: () => import("../locales/azz.ftl"),
  be: () => import("../locales/be.ftl"),
  bn: () => import("../locales/bn.ftl"),
  br: () => import("../locales/br.ftl"),
  bs: () => import("../locales/bs.ftl"),
  ca: () => import("../locales/ca.ftl"),
  cak: () => import("../locales/cak.ftl"),
  ckb: () => import("../locales/ckb.ftl"),
  cs: () => import("../locales/cs.ftl"),
  cy: () => import("../locales/cy.ftl"),
  da: () => import("../locales/da.ftl"),
  de: () => import("../locales/de.ftl"),
  dsb: () => import("../locales/dsb.ftl"),
  el: () => import("../locales/el.ftl"),
  "en-CA": () => import("../locales/en-CA.ftl"),
  "en-GB": () => import("../locales/en-GB.ftl"),
  "en-US": () => import("../locales/en-US.ftl"),
  "es-AR": () => import("../locales/es-AR.ftl"),
  "es-CL": () => import("../locales/es-CL.ftl"),
  "es-ES": () => import("../locales/es-ES.ftl"),
  "es-MX": () => import("../locales/es-MX.ftl"),
  et: () => import("../locales/et.ftl"),
  eu: () => import("../locales/eu.ftl"),
  fa: () => import("../locales/fa.ftl"),
  fi: () => import("../locales/fi.ftl"),
  fr: () => import("../locales/fr.ftl"),
  "fy-NL": () => import("../locales/fy-NL.ftl"),
  gn: () => import("../locales/gn.ftl"),
  gor: () => import("../locales/gor.ftl"),
  he: () => import("../locales/he.ftl"),
  hr: () => import("../locales/hr.ftl"),
  hsb: () => import("../locales/hsb.ftl"),
  hu: () => import("../locales/hu.ftl"),
  hus: () => import("../locales/hus.ftl"),
  "hy-AM": () => import("../locales/hy-AM.ftl"),
  ia: () => import("../locales/ia.ftl"),
  id: () => import("../locales/id.ftl"),
  ig: () => import("../locales/ig.ftl"),
  it: () => import("../locales/it.ftl"),
  ixl: () => import("../locales/ixl.ftl"),
  ja: () => import("../locales/ja.ftl"),
  ka: () => import("../locales/ka.ftl"),
  kab: () => import("../locales/kab.ftl"),
  ko: () => import("../locales/ko.ftl"),
  lt: () => import("../locales/lt.ftl"),
  lus: () => import("../locales/lus.ftl"),
  meh: () => import("../locales/meh.ftl"),
  mix: () => import("../locales/mix.ftl"),
  ml: () => import("../locales/ml.ftl"),
  ms: () => import("../locales/ms.ftl"),
  "nb-NO": () => import("../locales/nb-NO.ftl"),
  nl: () => import("../locales/nl.ftl"),
  "nn-NO": () => import("../locales/nn-NO.ftl"),
  oc: () => import("../locales/oc.ftl"),
  "pa-IN": () => import("../locales/pa-IN.ftl"),
  pai: () => import("../locales/pai.ftl"),
  pl: () => import("../locales/pl.ftl"),
  ppl: () => import("../locales/ppl.ftl"),
  "pt-BR": () => import("../locales/pt-BR.ftl"),
  "pt-PT": () => import("../locales/pt-PT.ftl"),
  quc: () => import("../locales/quc.ftl"),
  ro: () => import("../locales/ro.ftl"),
  ru: () => import("../locales/ru.ftl"),
  sk: () => import("../locales/sk.ftl"),
  sl: () => import("../locales/sl.ftl"),
  sn: () => import("../locales/sn.ftl"),
  sq: () => import("../locales/sq.ftl"),
  sr: () => import("../locales/sr.ftl"),
  su: () => import("../locales/su.ftl"),
  "sv-SE": () => import("../locales/sv-SE.ftl"),
  te: () => import("../locales/te.ftl"),
  th: () => import("../locales/th.ftl"),
  tl: () => import("../locales/tl.ftl"),
  tr: () => import("../locales/tr.ftl"),
  trs: () => import("../locales/trs.ftl"),
  uk: () => import("../locales/uk.ftl"),
  vi: () => import("../locales/vi.ftl"),
  yo: () => import("../locales/yo.ftl"),
  yua: () => import("../locales/yua.ftl"),
  zgh: () => import("../locales/zgh.ftl"),
  "zh-CN": () => import("../locales/zh-CN.ftl"),
  "zh-TW": () => import("../locales/zh-TW.ftl"),
};

export async function getTranslator(locale) {
  const bundles = [];
  const { default: en } = await import("../locales/en-US.ftl");

  if (locale !== "en-US" && localeLoaders[locale]) {
    const { default: ftl } = await localeLoaders[locale]();
    bundles.push(makeBundle(locale, ftl));
  }

  bundles.push(makeBundle("en-US", en));
  return function (id, data) {
    for (let bundle of bundles) {
      if (bundle.hasMessage(id)) {
        return bundle.formatPattern(bundle.getMessage(id).value, data);
      }
    }
  };
}
