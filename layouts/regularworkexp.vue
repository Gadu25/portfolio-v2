<template>
    <div class="regular-work-exp">
        <div class="content">
            <h4>Experience <span class="item-count">({{ works.length }})</span></h4>
            <RegularCard :works="works"/>
        </div>
    </div>
</template>

<script setup>
    import workexp from '~/data/workexp';
    import RegularCard from '~/components/card/regularCard.vue';

    const { getExperiences } = useMegome();
    const works = ref(workexp);

    onMounted(async () => {
        try {
            const apiWorks = await getExperiences()
            if (apiWorks && apiWorks.length > 0) {
                works.value = apiWorks
            }
        } catch (e) {
            console.error('Failed to fetch experiences:', e)
        }
    })
</script>