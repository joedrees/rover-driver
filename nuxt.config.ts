import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: [
        // Load a Node.js module directly (here it's a Sass file)
        'bulma',
    ]
})
