<template>
    <div class="detail-page cert-detail">
        <div class="content">
            <div class="back-link hover-pointer" @click="navigateTo('/work')">
                <i class="fa fa-chevron-left"></i>
                <span>Back to Work</span>
            </div>

            <template v-if="certificate">
                <div class="detail-header" data-aos="fade-up">
                    <div class="cert-cover" v-if="certificate.certificateImage">
                        <img :src="certificate.certificateImage" :alt="certificate.title+'-certificate'"/>
                    </div>
                    <div class="cert-cover cert-placeholder" v-else>
                        <i class="fa fa-award"></i>
                    </div>
                    <div class="header-info">
                        <h3>{{ certificate.title }}</h3>
                        <p class="issuer">{{ certificate.issuer }}</p>
                        <div class="meta">
                            <span class="date">
                                <i class="fa fa-calendar-alt"></i>
                                Issued {{ formatDate(certificate.issueDate) }}
                            </span>
                            <span v-if="certificate.expirationDate" class="expiration" :class="{ expired: isExpired(certificate.expirationDate) }">
                                <i class="fa fa-hourglass-half"></i>
                                {{ isExpired(certificate.expirationDate) ? 'Expired' : 'Expires' }} {{ formatDate(certificate.expirationDate) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="detail-body">
                    <div v-if="certificate.credentialId" class="section" data-aos="fade-up" data-aos-delay="100">
                        <h4>
                            <i class="fa fa-fingerprint"></i>
                            Credential ID
                        </h4>
                        <p class="credential-id">{{ certificate.credentialId }}</p>
                    </div>

                    <div v-if="certificate.credentialUrl" class="section" data-aos="fade-up" data-aos-delay="200">
                        <h4>
                            <i class="fa fa-link"></i>
                            Credential URL
                        </h4>
                        <a :href="certificate.credentialUrl" target="_blank" class="credential-link">
                            {{ certificate.credentialUrl }}
                            <i class="fa fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </template>

            <template v-else-if="status === 'pending'">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading certificate...</p>
                </div>
            </template>

            <template v-else>
                <div class="not-found" data-aos="fade-up">
                    <i class="fa fa-exclamation-triangle"></i>
                    <p>Certificate not found.</p>
                    <div class="link-btn primary-btn" @click="navigateTo('/work')">
                        <i class="fa fa-chevron-left"></i>
                        <span>Back to Work</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import ogImage from '~/assets/images/memoji/hired.webp'

    const route = useRoute()
    const { getCertificateById } = useMegome()
    const { formatDate } = useFormatDate()

    const { data: certificate, status } = await useCachedAsyncData(`certificate-${route.params.id}`, () => {
        const id = Number(route.params.id)
        return getCertificateById(id)
    })

    const isExpired = (date) => {
        return new Date(date) < new Date()
    }

    useSeoMeta({
        description: () => certificate.value ? `${certificate.value.title} - ${certificate.value.issuer}` : 'Certificate details.',
        ogTitle: () => certificate.value ? `${certificate.value.title} – Alexander Udag` : 'Certificate – Alexander Udag',
        ogDescription: () => certificate.value ? `${certificate.value.title} - ${certificate.value.issuer}` : 'Certificate details.',
        ogImage: () => certificate.value?.certificateImage || ogImage,
        ogUrl: () => `https://alexander-udag.vercel.app/certifications/${route.params.id}`,
        twitterTitle: () => certificate.value ? `${certificate.value.title} – Alexander Udag` : 'Certificate – Alexander Udag',
        twitterDescription: () => certificate.value ? `${certificate.value.title} - ${certificate.value.issuer}` : 'Certificate details.',
        twitterImage: () => certificate.value?.certificateImage || ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    })
</script>
