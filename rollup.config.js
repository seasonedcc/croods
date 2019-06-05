import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import json from 'rollup-plugin-json'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    external(),
    url(),
    babel({ runtimeHelpers: true, exclude: 'node_modules/**' }),
    resolve({ preferBuiltins: true, browser: true }),
    json(),
    commonjs({ include: 'node_modules/**' }),
  ],
}
