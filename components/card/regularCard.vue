<template>
    <div class="regular-card">
        <div class="card">
            <template v-for="work in works">
                <div class="company-wrapper">
                    <div class="company-title">
                        <div class="company-logo">
                            <img :src="work.logo" />
                        </div>
                        <div class="company-name">
                            <h4>{{ work.name }}</h4>
                        </div>
                    </div>
                    <div class="my-role">
                        <h4>{{ work.jobTitle }}</h4>
                        <small>{{ work.date }} <i v-if="work.duration.length > 0">. {{ work.duration
                                }}</i></small>
                    </div>
                    <!-- <div class="role-tasks">
                        <ul>
                            <template v-for="item in work.roles">
                                <li>{{ item }}</li>
                            </template>
                        </ul>
                    </div> -->
                    <small>Tech stacks</small>
                    <div class="techs">
                        <template v-for="item in work.techUsed">
                            <div class="tech">
                                <img :src="item.icon" :alt="'icon-for-'+item.tech"/>
                                <span class="tech-name"><small>{{ item.name }}</small></span>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import workexp from '~/data/workexp';
    export default {
        name: 'RegularCards',
        data(){
            return {
                works: workexp
            }
        }
    }
</script>