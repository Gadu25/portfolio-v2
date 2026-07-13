<template>
    <div class="regular-card">
        <div class="card">
            <template v-for="work in works">
                <div class="company-wrapper" data-aos="fade-up">
                    <div class="company-title">
                        <div v-if="work.logo" class="company-logo">
                            <img :src="work.logo" :alt="work.company + '-logo'" />
                        </div>
                        <div class="company-name">
                            <h4>{{ work.company }}</h4>
                        </div>
                    </div>
                    <div class="my-role">
                        <h4>{{ work.title }}</h4>
                        <small class="text-secondary">{{ formatDate(work.startDate) }} - {{ work.isPresent ? 'present' : formatDate(work.endDate) }} <i>({{ getStayDuration({ start: work.startDate, end: work.endDate }) }})</i></small>
                    </div>
                    <small><strong>Tech stacks</strong></small>
                    <div class="techs">
                        <template v-for="item in work.technologies">
                            <div class="tech">
                                <!-- <img :src="item.icon" :alt="'icon-for-' + item.name" /> -->
                                <span class="tech-name"><small>{{ item.name }}</small></span>
                            </div>
                        </template>
                    </div>
                    <div class="role-tasks">
                        <div v-html="work.description"></div>
                    </div>
                    <NuxtLink :to="'/experience/'+work.id+'?from=home'" class="view-details hover-pointer" @click.stop>
                        <small>View Details <i class="fa fa-chevron-right"></i></small>
                    </NuxtLink>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useStayDuration } from "~/composables/useStayDuration";

const props = defineProps({
    works: {
        type: Array,
        required: true
    }
});

const { getStayDuration } = useStayDuration();
const { formatDate } = useFormatDate();
</script>
