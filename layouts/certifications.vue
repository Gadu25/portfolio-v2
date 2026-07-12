<template>
    <div class="certifications">
        <div class="content">
            <h4>Certificates <span class="item-count">({{ certs.length }})</span></h4>

            <template v-for="cert of (showAll ? certs : certs.slice(0, 3))">
                <div class="cert-card" data-aos="fade-up">
                    <div class="cert-content">
                        <div class="col image-col hover-pointer" @click="downloadPDF(cert.file, cert.name)">
                            <div class="image-container">
                                <img :src="cert.image" :alt="'image-for-'+cert.name"/>
                            </div>
                        </div>
                        <div class="col">
                            <h4>{{ cert.name }}</h4>
                            <p>{{ cert.provider }}</p>
                            <small>Issued {{ formatDate(cert.issued) }}</small>
                            <div class="cert-actions">
                                <NuxtLink v-if="cert.id" :to="'/certifications/'+cert.id" class="view-details hover-pointer">
                                    <small>View Details <i class="fa fa-chevron-right"></i></small>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <div v-if="certs.length > 3" class="show-more hover-pointer text-secondary" @click="showAll = !showAll">
                <small><i class="fa" :class="showAll ? 'fa-chevron-up':'fa-chevron-down'"></i> show {{ showAll ? 'less':'all' }}..</small>
            </div>
        </div>
    </div>
</template>

<script setup>
    import certifications from '~/data/certifications';
    import { downloadPDF } from '~/utls/download';

    const { getCertificates } = useMegome()
    const { formatDate } = useFormatDate()

    const certs = ref(certifications)
    const showAll = ref(false)

    onMounted(async () => {
        try {
            const apiCerts = await getCertificates()
            if (apiCerts && apiCerts.length > 0) {
                certs.value = apiCerts.map(cert => ({
                    id: cert.id,
                    name: cert.title,
                    provider: cert.issuer,
                    issued: cert.issueDate,
                    image: cert.certificateImage,
                    file: cert.credentialUrl,
                }))
            }
        } catch (e) {
            console.error('Failed to fetch certifications:', e)
        }
    })
</script>
