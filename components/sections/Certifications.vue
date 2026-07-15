<template>
  <section class="certifications">
    <div class="certifications__container">
      <h4>Certificates <span v-if="status !== 'pending'" class="item-count">({{ certs.length }})</span></h4>

      <template v-if="status === 'pending'">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading certifications...</p>
        </div>
      </template>
      <template v-else>
        <template v-for="cert in showAll ? certs : certs.slice(0, 3)" :key="cert.id">
          <div class="certifications__card" data-aos="fade-up">
            <div class="certifications__card-content">
              <div
                class="certifications__image-col hover-pointer"
                @click="confirmDownload(cert)"
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
      </template>
    </div>
    <ConfirmDialog
      v-model="showConfirm"
      :message="confirmMessage"
      @confirm="downloadPDF(pendingDownload.file, pendingDownload.name)"
    />
  </section>
</template>

<script setup lang="ts">
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
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

const showAll = ref(false)
const showConfirm = ref(false)
const confirmMessage = ref('')
const pendingDownload = ref<{ file: string; name: string }>({ file: '', name: '' })

const confirmDownload = (cert: CertDisplay) => {
  if (!cert.file) return
  pendingDownload.value = { file: cert.file, name: cert.name }
  confirmMessage.value = `Would you like to download the certificate for "${cert.name}"?`
  showConfirm.value = true
}

const { data: certs, status } = await useCachedAsyncData('certifications', async () => {
  const apiCerts = await getCertificates()
  if (apiCerts && apiCerts.length > 0) {
    return apiCerts.map(cert => ({
      id: cert.id,
      name: cert.title,
      provider: cert.issuer,
      issued: cert.issueDate,
      image: cert.certificateImage,
      file: cert.credentialUrl,
    }))
  }
  return certifications
})
</script>
