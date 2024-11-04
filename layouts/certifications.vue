<template>
    <div class="certifications">
        <div class="content">
            <h3>Certificates</h3>

            <template v-for="cert of (showAll ? certs : certs.slice(0, 3))">
                 <div class="cert-card hover-pointer" @click="downloadPDF(cert.file, cert.name)">
                    <div class="cert-content">
                        <div class="col">
                            <div class="image-container">
                                <img :src="cert.image" :alt="'image-for-'+cert.name"/>
                            </div>
                        </div>
                        <div clas="col">
                            <h4>{{ cert.name }}</h4>
                            <p>{{ cert.provider }}</p>
                            <small>Issued {{ cert.issued }}</small>
                        </div>
                    </div>
                 </div>
            </template>

            <div class="show-more hover-pointer" @click="showAll = !showAll">
                <small><i class="fa" :class="showAll ? 'fa-chevron-up':'fa-chevron-down'"></i> show {{ showAll ? 'less':'all' }}..</small>
            </div>
        </div>
    </div>
</template>

<script>
    import certifications from '~/data/certifications';
    export default {
        name: 'Certifications',
        data() {
            return {
              certs: certifications ,
              showAll: false
            }
        },
        methods: {
            downloadPDF(file, filename){
                const fileUrl = file;
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = filename+'.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
</script>