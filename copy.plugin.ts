import { Plugin } from 'vite';
import { writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

export const copyPackageJsonPlugin = (): Plugin => {
    return {
        name: 'copy-package-json',
        closeBundle() {
            try {
                const packageJson = require('./package.json');
                const distPackageJson = {
                    name: packageJson.name,
                    version: packageJson.version,
                    main: './lib/packages/index.js',
                    module: './es/packages/index.mjs',
                    types: './types/index.d.ts',
                    files: [
                        './',
                    ],
                    exports: {
                        ".": {
                            "types": "./types/index.d.ts",
                            "import": "./es/packages/index.mjs",
                            "require": "./lib/packages/index.js"
                        },
                        "./es": {
                            "types": "./types/index.d.ts",
                            "import": "./es/packages/index.mjs",
                        },
                        "./lib": {
                            "types": "./types/index.d.ts",
                            "require": "./lib/packages/index.js"
                        },
                        "./es/packages/*.mjs": {
                            "types": "./types/*.d.ts",
                            "import": "./es/packages/*.mjs"
                        },
                        "./lib/packages/*.js": {
                            "types": "./types/*.d.ts",
                            "require": "./lib/packages/*.js"
                        },
                        "./es/packages/*": {
                            "types": [
                                "./types/*.d.ts",
                                "./types/index.d.ts",
                            ],
                            "import": "./es/packages/*.mjs"
                        },
                        "./*": "./*"
                    },
                    peerDependencies: packageJson.peerDependencies,
                    description: packageJson.description,
                    keywords: packageJson.keywords,
                    author: packageJson.author,
                    license: packageJson.license,
                    repository: packageJson.repository,
                    bugs: packageJson.bugs,
                    homepage: packageJson.homepage
                };

                // 将 distPackageJson 写入 dist 目录
                writeFileSync(join(__dirname, 'dist', 'package.json'), JSON.stringify(distPackageJson, null, 2));
                console.log('package.json copied and modified successfully!');

                // 如果需要，可以复制 README.md 等其他文件到 dist 目录
                copyFileSync(join(__dirname, 'README.md'), join(__dirname, 'dist', 'README.md'));
            } catch (error) {
                console.error('Error while copying and modifying package.json:', error);
            }
        }
    };
};
