const currentTask = process.env.npm_lifecycle_event;
console.log("Run mode: " + currentTask);

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");

const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

//------------------------ COPY ASSETS HANDLER ------------------
class MyRunAfterCompile {
  constructor(copyAssetsTo) {
    this.copyAssetsTo = copyAssetsTo;
    console.log("Assets are coping to folder --> " + copyAssetsTo);
  }
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", () => {
      fse.copySync("src/assets/images", `${this.copyAssetsTo}/assets/images`);
    });
  }
}

//------------------------ PAGES TEMPLATES HANDLER --------------
let pages = fse
  .readdirSync("src")
  .filter(function (file) {
    return file.endsWith(".html");
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `src/${page}`,
    });
  });

//------------------------ MODULE.RULES[] -------------------------
let cssConfig = {
  test: /\.css$/i,
  use: [
    "css-loader",
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: postCSSPlugins } },
    },
  ],
};

let scssConfig = {
  test: /\.(scss)$/,
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: () => [require("autoprefixer")],
        },
      },
    },
    {
      loader: "sass-loader",
    },
  ],
};

let imagesConfig = {
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: "asset/resource",
};

//------------------------ MAIN MODULE.EXPORTS{} ----------------
let config = {
  entry: path.resolve(__dirname, "src/assets/scripts/App.js"),

  devtool: false,
  module: {
    rules: [cssConfig, scssConfig, imagesConfig],
  },

  plugins: pages,
};

//------------------------- DEVELOPMENT -------------------------

if (currentTask == "dev") {
  config.mode = "development";
  config.devtool = "inline-source-map";

  cssConfig.use.unshift("style-loader");

  config.output = {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  };

  config.plugins.push(new MyRunAfterCompile("dist"));

  config.devServer = {
    static: path.resolve(__dirname, "dist"),
    watchFiles: path.join(__dirname, "src/**/*.html"),
    port: 3010,
  };
}

//------------------------- PRODUCTION -------------------------

if (currentTask == "build") {
  config.mode = "production";

  // babel rules for all .js files
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  });

  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  scssConfig.use[0].loader = MiniCssExtractPlugin.loader;

  config.output = {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    clean: true,
  };

  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  };

  config.plugins.push(
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
    new MyRunAfterCompile("docs")
  );
}

module.exports = config;
