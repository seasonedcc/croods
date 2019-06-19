import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: './src/index.ts',
  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  external: ['react', 'react-dom', 'axios'],
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),
    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),
    json(),
    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'] }),
    external(),
  ],

  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
    },
  ],
}
