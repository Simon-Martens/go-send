const TailwindExtractor = (content) => {
  return content.match(/[A-Za-z0-9-_:/]+/g) || [];
};

module.exports = ({ env }) => {
  const isDev = env === "development";

  const plugins = [
    require("tailwindcss")("./tailwind.config.js"),
    require("postcss-preset-env"),
  ];

  if (!isDev) {
    plugins.push(
      require("@fullhuman/postcss-purgecss")({
        content: ["./app/**/*.js", "./common/**/*.js"],
        extractors: [
          {
            extractor: TailwindExtractor,
            extensions: ["js"],
          },
        ],
      }),
    );
    plugins.push(
      require("cssnano")({
        preset: "default",
      }),
    );
  }

  return {
    plugins,
    map: isDev ? { inline: true } : false,
  };
};
