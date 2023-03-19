import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

import autoprefixer from 'autoprefixer';
import postCssPxToRem from 'postcss-pxtorem';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        // 别名
        alias: {
            "@": resolve(__dirname, "src"),
        },
        // 导入时想要省略的扩展名列表
        extensions: [".js", ".ts", ".jsx", ".tsx", ".vue", ".json", ".mjs"],
    },
    css: {
        // 指定传递给 CSS 预处理器的选项
        preprocessorOptions: {
            scss: {
                // https://sass-lang.cn/documentation/at-rules/use
                // 该@use规则从其他Sass样式表加载mixins，函数和变量，并将多个样式表css组合在一起。加载的样式表@use称为“模块”。Sass还提供了内置模块，其中包含有用的功能。
                // @use编写了最简单的规则@use "<url>"，该规则将模块加载到给定的URL。不管加载了多少次，以这种方式加载的任何样式都将仅在编译的CSS输出中包含一次。
                // 默认情况下，模块的名称空间只是其URL的最后一个组成部分，而没有文件扩展名。但是，有时可能想选择一个不同的命名空间-可能想为经常引用的模块使用一个较短的名称，或者可能正在加载具有相同文件名的多个模块。可以通过编写来实现  @use "<url>" as <namespace>。
                // 可以通过编写加载没有名称空间的模块@use "<url>" as *。
                additionalData: `@use "@/assets/styles/global-scss-var.scss" as *;`,
            },
        },
        // https://vitejs.cn/config/#css-postcss
        postcss: {
            plugins: [
                // 样式前缀补全
                autoprefixer({
                    overrideBrowserslist: [
                        "Android 4.1",
                        "iOS 7.1",
                        "Chrome > 31",
                        "ff > 31",
                        "ie >= 8",
                        "> 1%",
                    ],
                    grid: true,
                }),
                {
                    // 去除警告: [WARNING] "@charset" must be the first rule in the file
                    postcssPlugin: "internal:charset-removal",
                    AtRule: {
                        charset: (atRule) => {
                            if (atRule.name === "charset") {
                                atRule.remove();
                            }
                        },
                    },
                },
                // 尺寸适配
                postCssPxToRem({
                    rootValue: 100, // (设计稿/10）1rem的大小 (详见: global.scss中 html{font-size: 26.6666666vw;})
                    propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
                    selectorBlackList: [".norem"], // 过滤掉.norem-开头的class，不进行rem转换
                    exclude: /node_modules/i,
                }),
            ],
        },
    },
    server: {
        port: 8888
    }
});
