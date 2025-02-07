<template>
    <div class="certifications">
        <div class="content">
            <h4>Certificates <span class="item-count">({{ certs.length }})</span></h4>

            <template v-for="cert of (showAll ? certs : certs.slice(0, 3))">
                <div class="cert-card hover-pointer" data-aos="fade-up" @click="downloadPDF(cert.file, cert.name)">
                    <div class="cert-content">
                        <div class="col">
                            <div class="image-container">
                                <img :src="cert.image" :alt="'image-for-'+cert.name"/>
                            </div>
                        </div>
                        <div class="col">
                            <h4>{{ cert.name }}</h4>
                            <p>{{ cert.provider }}</p>
                            <small>Issued {{ cert.issued }}</small>
                        </div>
                    </div>
                </div>
            </template>

            <div class="show-more hover-pointer text-secondary" @click="showAll = !showAll">
                <small><i class="fa" :class="showAll ? 'fa-chevron-up':'fa-chevron-down'"></i> show {{ showAll ? 'less':'all' }}..</small>
            </div>
        </div>
    </div>
</template>

<script setup>
    import certifications from '~/data/certifications';
    import { downloadPDF } from '~/utls/download';
    
    const certs = ref(certifications)
    const showAll = ref(false)
</script>