<template>
    <div>
        <RegularWorkExp/>
        <Certifications/>
    </div>
</template>

<script>
    import RegularWorkExp from '~/layouts/regularworkexp.vue';
    import Certifications from '~/layouts/certifications.vue';

    export default {
        name: 'Work',
        components: { RegularWorkExp, Certifications }
    }
</script>