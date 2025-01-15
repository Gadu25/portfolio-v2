<template>
    <div class="regular-card">
        <div class="card">
            <template v-for="work in works">
                <div class="company-wrapper" data-aos="fade-up">
                    <div class="company-title">
                        <div class="company-logo">
                            <img :src="work.logo" :alt="work.name + '-logo'" />
                        </div>
                        <div class="company-name">
                            <h4>{{ work.name }}</h4>
                        </div>
                    </div>
                    <div class="my-role">
                        <h4>{{ work.jobTitle }}</h4>
                        <small>{{ work.start }} - {{ work.end || 'present' }} <i>({{ getStayDuration(work) }})</i></small>
                    </div>
                    <small><strong>Tech stacks</strong></small>
                    <div class="techs">
                        <template v-for="item in work.techUsed">
                            <div class="tech">
                                <img :src="item.icon" :alt="'icon-for-' + item.tech" />
                                <span class="tech-name"><small>{{ item.name }}</small></span>
                            </div>
                        </template>
                    </div>
                    <div class="show-more hover-pointer" @click="work.isRolesShown = !work.isRolesShown">
                        <small><i class="fa" :class="work.isRolesShown ? 'fa-chevron-up' : 'fa-chevron-down'"></i> show {{
                            work.isRolesShown ?
                            'less':'more' }}..</small>
                    </div>
                    <div class="role-tasks" :class="work.isRolesShown ? 'active' : ''">
                        <ul>
                            <template v-for="item in work.roles">
                                <li><small>{{ item }}</small></li>
                            </template>
                        </ul>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import workexp from '~/data/workexp';
import { useStayDuration } from "~/composables/useStayDuration";

const { getStayDuration } = useStayDuration();
const works = ref(workexp)

</script>