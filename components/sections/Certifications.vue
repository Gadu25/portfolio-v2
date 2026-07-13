<template>
  <section class="certifications">
    <div class="certifications__container">
      <h4>Certificates <span class="item-count">({{ certs.length }})</span></h4>

      <template v-for="cert in showAll ? certs : certs.slice(0, 3)" :key="cert.id">
        <div class="certifications__card" data-aos="fade-up">
          <div class="certifications__card-content">
            <div
              class="certifications__image-col hover-pointer"
              @click="downloadPDF(cert.file, cert.name)"
            >
              <div class="certifications__image-wrapper">
                <img :src="cert.image" :alt="`image-for-${cert.name}`" />
              </div>
            </div>
            <div class="certifications__info">
              <h4>{{ cert.name }}</h4>
              <p>{{ cert.provider }}</p>
              <small>Issued {{ formatDate(cert.issued) }}</small>
              <div class="certifications__actions">
                <NuxtLink
                  v-if="cert.id"
                  :to="`/certifications/${cert.id}`"
                  class="certifications__details hover-pointer"
                >
                  <small>View Details <i class="fa fa-chevron-right" /></small>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="certs.length > 3"
        class="certifications__toggle hover-pointer text-secondary"
        @click="showAll = !showAll"
      >
        <small>
          <i class="fa" :class="showAll ? 'fa-chevron-up' : 'fa-chevron-down'" />
          show {{ showAll ? 'less' : 'all' }}..
        </small>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import certifications from '~/data/certifications'
import { downloadPDF } from '~/utils/download'

interface CertDisplay {
  id: number | null
  name: string
  provider: string
  issued: string
  image: string | null
  file: string | null
}

const { getCertificates } = useMegome()
const { formatDate } = useFormatDate()

const certs = ref<CertDisplay[]>(certifications)
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
