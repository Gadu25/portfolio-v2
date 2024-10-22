<template>
    <div class="nav-container" :class="isScrolled ? 'scrolled':''">
        <div class="content">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Work</a></li>
                <li><a href="#">Projects</a></li>
            </ul>
            <ThemeToggle/>
        </div>
    </div>
</template>

<script>
    import ThemeToggle from '../components/common/themeToggle'
    export default {
        name: 'Navigation',
        components: {
            ThemeToggle
        },
        props:{
            isScrolled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>