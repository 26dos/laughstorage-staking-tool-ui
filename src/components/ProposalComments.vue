<template>
  <div class="proposal-comments">
    <q-card class="main-card">
      <q-card-section class=" text-primary">
        <div class="flex items-center space-x-5">
          <q-icon name="fa-solid fa-comments" size="2em" />
          <h1 class="text-2xl font-bold">Comments</h1>
        </div>
      </q-card-section>
      <q-card-section class="space-y-3" id="comment-input">
        <q-input outlined type="textarea" v-model="comment" placeholder="Please enter your comment">
          <template v-slot:prepend v-if="selectedComment">
            <div class="flex items-center space-x-2 text-meta text-sm">
              <q-icon name="fa-solid fa-at" />
              <span>Reply to</span>
              <span class="text-primary font-bold">
                {{ emptyString(selectedComment.user.display_name) ? handleAddress(selectedComment.wallet_address) :
                  selectedComment.user.display_name }}
              </span>
              <q-btn round flat icon="fa-solid fa-xmark" size="xs" color="negative" @click="selectedComment = null" />
            </div>
          </template>
        </q-input>
        <div class="text-right">
          <q-btn :disable="emptyString(comment)" padding="10px 25px" :loading="publishLoading" unelevated
            icon-right="fa-regular fa-paper-plane" color="primary" rounded label="Publish" @click="publishComment" />
        </div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item class="items-start" v-for="(comment, index) in comments" :key="comment.id">
            <q-item-section avatar>
              <address-img class="rounded-full" height="40px" width="40px" :address="comment.wallet_address">
              </address-img>
            </q-item-section>
            <q-item-section>
              <q-item-label-label class="flex items-center space-x-2">
                <span class="text-lg font-bold">
                  {{
                    emptyString(comment.user.display_name) ? handleAddress(comment.wallet_address) :
                      comment.user.display_name }}
                </span>
                <q-chip size="sm" v-if="proposal.wallet.wallet === comment.wallet_address" color="primary"
                  text-color="white" label="Creator" />
                <q-chip size="sm" v-if="dAppStore.userAddress.toLowerCase() === comment.wallet_address.toLowerCase()"
                  color="primary" text-color="white" label="Me" />
              </q-item-label-label>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-meta">{{ dateFromNow(comment.created_at) }}</span>
                <q-btn round flat icon="fa-solid fa-reply" size="xs" color="primary" @click="selectComment(comment)" />
                <q-btn v-if="dAppStore.userAddress.toLowerCase() === comment.wallet_address.toLowerCase()" round flat
                  icon="fa-solid fa-trash" :loading="comment.deleting" size="xs" color="negative"
                  @click="deleteComment(comment.id, index)" />
              </div>
              <template v-if="comment.parent">
                <div class="bg-page-color rounded-lg overflow-hidden p-2 mt-2">
                  <div class="flex items-start space-x-3 text-meta text-xs no-wrap">
                    <div class="flex items-center space-x-2">
                      <q-icon name="fa-solid fa-at" />
                      <span>In reply to</span>
                      <span class="text-primary font-bold">
                        {{ emptyString(comment.parent.user.display_name) ?
                          handleAddress(comment.parent.wallet_address) :
                          comment.parent.user.display_name }} :
                      </span>
                    </div>
                    <p class="reply-content" v-html="comment.parent.comment_content"></p>
                  </div>
                </div>
              </template>
              <div class="mt-2 text-base leading-snug" v-html="comment.comment_content"></div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="flex justify-end mt-5" v-if="maxPage > 1">
          <q-pagination v-model="page" :max="maxPage" direction-links color="primary" />
        </div>
        <q-inner-loading color="primary" :showing="commentsLoading">
          <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { commentApi } from 'src/dist/api';
import { customAlert, customToast, dateFromNow, emptyString, handleAddress, confirmAlert } from 'src/dist/tools';
import AddressImg from 'src/components/AddressImg.vue';
import { useDAppStore } from 'src/stores/d-app';
export default defineComponent({
  name: 'ProposalComments',
  components: {
    AddressImg
  },
  setup() {
    const dAppStore = useDAppStore();
    return {
      dAppStore
    }
  },
  data() {
    return {
      comment: '',
      publishLoading: false,
      comments: [],
      page: 1,
      selectedComment: null,
      commentsLoading: false,
      maxPage: 0,
    };
  },
  props: {
    p_id: {
      type: String,
      required: true,
    },
    proposal: {
      type: Object,
      required: true,
    },
  },
  watch: {
    p_id: {
      handler(val) {
        if (emptyString(val)) return;
        this.comments = [];
        this.page = 1;
        this.getComments();
      },
      immediate: true,
    },
  },
  methods: {
    dateFromNow,
    emptyString,
    handleAddress,
    selectComment(comment) {
      this.selectedComment = comment;
      document.getElementById('comment-input').scrollIntoView({ behavior: 'smooth' });
    },
    async deleteComment(c_id, index) {
      confirmAlert('Are you sure you want to delete this comment? Deleting this comment will also delete its child comments (if any)!', async () => {
        try {
          this.comments[index].deleting = true;
          await commentApi.delete(c_id);
          customToast('success', 'Comment deleted successfully');
          this.comments.splice(index, 1);
          // delete child comments
          this.comments.forEach((comment, c_index) => {
            if (comment.parent && comment.parent.id === c_id) {
              this.comments.splice(c_index, 1);
            }
          });
        } catch (err) {
          customAlert.error(err.message);
        } finally {
          this.comments[index].deleting = false;
        }
      })
    },
    async publishComment() {
      this.publishLoading = true;
      try {
        let data = {
          content: this.comment,
        }
        if (this.selectedComment) {
          data.parent_id = this.selectedComment.id;
        }
        await commentApi.publish(this.p_id, data);
        customToast('success', 'Comment published successfully');
        this.comment = '';
        this.getComments();
        this.selectedComment = null;
      } catch (err) {
        customAlert.error(err.message);
      } finally {
        this.publishLoading = false;
      }
    },
    async getComments() {
      this.commentsLoading = true;
      try {
        const res = await commentApi.comments(this.p_id, {
          page: this.page,
        });
        this.comments = res.data.data;
        this.maxPage = res.data.paged.total_page;
      } catch (err) {
        customAlert.error(err.message);
      } finally {
        this.commentsLoading = false;
      }
    },
  },
});
</script>