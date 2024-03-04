/// <reference types="vite/client" />

interface KeyboardEvent {
    type: 'keydown'
}

interface MouseEvent {
    type: 'dblclick'
}

declare module '*.hdr' {
    const src: string
    export default src
}
