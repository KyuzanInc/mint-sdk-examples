import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
export default {
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
  },
}
