import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: true, // Open to local network and display URL
        open: true // Open the browser
    },
    build: {
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
    resolve: {
        alias: {
            src: '/src',
        },
    },
    assetsInclude: [
        '**/*.hdr'
    ],
    publicDir: 'public'
})