<template>
  <q-page padding>
    <div class="container">
      <div class="space-y-5">
        <div class="home-page-header main-card">
          <h1 class="lg:text-3xl text-2xl font-bold text-white uppercase">FAQ</h1>
          <p class="text-white mt-3 mb-5 text-lg">
            The LaughStorage Automated Allocator is a smart contract-based DataCap distribution system designed for real
            data clients. It emphasizes security, efficiency, and transparency in Fil+ allocations.
          </p>
          <div>
            <q-btn unelevated rounded label="Github" icon="fa-brands fa-github" color="white" text-color="primary"
              href="https://github.com/26dos" target="_blank"></q-btn>
          </div>
        </div>
        <q-list class="space-y-3">
          <q-expansion-item header-class="faq-header" class="bg-white rounded-lg faq-item" v-for="(faq, index) in faqs"
            :key="index" :label="faq.question">
            <div class="answer-content" v-html="faq.answer"></div>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HelpPage',
  data() {
    return {
      faqs: [
        {
          question: `Who is eligible to apply through this channel?`,
          answer: `<span class="font-bold">Anyone</span> with a real data storage need—whether individuals, teams, or organizations—can apply. We especially welcome research institutions, media companies, and enterprise data units to onboard important data through this channel.`
        }, {
          question: `How can overseas users complete KYC?`,
          answer: `The current system uses Alibaba Cloud Identity API, which supports only Mainland China ID cards. Overseas users must contact the channel admin via email or Slack to arrange manual KYC verification.`
        }, {
          question: `Will my FIL be refunded automatically after the pledge expires?`,
          answer: `<span class="font-bold">No.</span> The pledge will be <span class="font-bold">unlocked automatically</span> by the smart contract at maturity, but you must log in and manually claim the FIL.`
        }, {
          question: `What happens if sealing fails or is canceled midway?`,
          answer: `In case of sealing failure, the admin will assess whether to partially or fully refund the pledged FIL. If the client cancels midway, the remaining FIL will be handled based on the sealing status.`
        }, {
          question: `Can I reapply if my proposal is rejected?`,
          answer: `Yes. Just make sure to revise the issues mentioned in the rejection and avoid submitting identical or incomplete proposals.`
        }, {
          question: `Does the data need to be publicly accessible?`,
          answer: `<span class="font-bold">Yes.</span> Public datasets must be accessible via links or repositories; private data can be non-public but must have a clear use case and verifiable origin, subject to additional checks.`
        }, {
          question: `How can I track my sealing status and eligibility for more DataCap?`,
          answer: `You can track your sealing history via <a class="text-blue-500 underline" href="https://datacapstats.io/clients" target="_blank">https://datacapstats.io/clients</a>. Future DataCap allocation will be based on this public record.`
        }
      ]
    }
  }
});
</script>