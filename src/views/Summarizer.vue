<template>
  <v-container>
    <div class="display-1">Text Summarizer</div>
    <div class="subtitle my-5">
      Automatic summarization is the process of shortening a set of data computationally, to create a subset (a summary) that represents the most important or relevant information within the original content.
      In addition to text, images and videos can also be summarized. Text summarization finds the most informative sentences in a document; image summarization finds the most representative images within an image collection; video summarization extracts the most important frames from the video content.
    </div>
    <v-expansion-panels class="mb-10">
      <v-expansion-panel>
        <v-expansion-panel-header>How To Use?</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ol>
            <li>Find Indonesian article online</li>
            <li>Copy the article (only text)</li>
            <li>Paste to text box below</li>
            <li>Click Run!</li>
          </ol>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-form class="mt-5" v-model="valid">
      <v-textarea
        label="Text"
        clearable
        outlined
        placeholder="Text from article, news, or any..."
        required
        :rules="textRules"
        v-model="text"
        no-resize
      ></v-textarea>
      <v-btn @click="run" :disabled="!valid" color="primary">Run</v-btn>
    </v-form>
    <v-divider class="my-5"></v-divider>
    <v-container fluid v-if="result || loading" class="pa-0">
      <div class="text-center" v-if="loading">
        <v-progress-circular indeterminate color="primary" size="78"></v-progress-circular>
      </div>
      <template v-else>
        <v-tabs v-model="tab">
          <v-tab class="font-weight-bold">Result</v-tab>
          <v-tab class="font-weight-bold">Step</v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="tab"
          :class="(this.$vuetify.breakpoint.smAndDown)?'py-5 pl-1':'pa-5'"
        >
          <!-- Result Tab -->
          <v-tab-item>
            <div class="title ml-1">Result</div>
            <ul class="body-1 mt-5">
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quo earum dolore corrupti nam ipsa eveniet eius voluptatem explicabo corporis?</li>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quo earum dolore corrupti nam ipsa eveniet eius voluptatem explicabo corporis?</li>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quo earum dolore corrupti nam ipsa eveniet eius voluptatem explicabo corporis?</li>
            </ul>
          </v-tab-item>
          <v-tab-item>
            <v-stepper v-model="step" vertical>
              <v-stepper-step :complete="step>1" step="1">Document to Sentences</v-stepper-step>
              <!-- Step 1 -->
              <v-stepper-content step="1">
                At this step, we convert the document that has been inputted into a few sentences.
                <v-data-table
                  :headers="headerSentences"
                  :items="result.originalSentence"
                  items-per-page="5"
                  class="my-5"
                ></v-data-table>
                <v-btn class="mx-5" color="primary" @click="step+=1">Next</v-btn>
              </v-stepper-content>
              <v-stepper-step :complete="step>2" step="2">Lexical Analysis of The Text</v-stepper-step>
              <!-- Step 2 -->
              <v-stepper-content step="2">
                In text summarizer we don't need any punctuation and number. So, in this step we remove punctuation,number, and lower case all sentences.
                <v-data-table
                  :headers="headerSentences"
                  :items="result.lexical"
                  items-per-page="5"
                  class="my-5"
                ></v-data-table>
                <v-btn color="error" text @click="step-=1">Back</v-btn>
                <v-btn class="mx-5" color="primary" @click="step+=1">Next</v-btn>
              </v-stepper-content>
              <v-stepper-step :complete="step>3" step="3">Stopword Removal</v-stepper-step>
              <!-- Step 3 -->
              <v-stepper-content step="3">
                Some words are not very important for summarizing. Why? because we will score that word and some word that not very important sometimes has a big score and make our accuracy decrease. So, in this step we remove useless word.
                <v-data-table
                  :headers="headerSentences"
                  :items="result.stopword"
                  items-per-page="5"
                  class="my-5"
                ></v-data-table>
                <v-btn color="error" text @click="step-=1">Back</v-btn>
                <v-btn class="mx-5" color="primary" @click="step+=1">Next</v-btn>
              </v-stepper-content>
              <!-- Step 4 -->
              <v-stepper-step :complete="step>4" step="4">Tokenizing</v-stepper-step>
              <v-stepper-content step="4">
                In this step we seperate word from sentence.
                <v-data-table
                  :headers="headerSentences"
                  :items="result.token"
                  items-per-page="5"
                  class="my-5"
                >
                  <template v-slot:item.sentence="{item}">
                    <v-chip v-for="i in item.sentence" :key="i" class="mx-1">{{i}}</v-chip>
                  </template>
                </v-data-table>
                <v-btn color="error" text @click="step-=1">Back</v-btn>
                <v-btn class="mx-5" color="primary" @click="step+=1">Next</v-btn>
              </v-stepper-content>
              <!-- Step 5 -->
              <v-stepper-step :complete="step>5" step="5">Stemming</v-stepper-step>
              <v-stepper-content step="5">
                Then, we remove affixes from token to get the root word.
                <v-data-table
                  :headers="headerStem"
                  :items="result.stem"
                  items-per-page="15"
                  class="my-5"
                ></v-data-table>
                <v-btn color="error" text @click="step-=1">Back</v-btn>
                <v-btn class="mx-5" color="primary" @click="step+=1">Next</v-btn>
              </v-stepper-content>
              <!-- End Of Stepper -->
            </v-stepper>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </v-container>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      step: 1,
      valid: true,
      tab: null,
      text: "",
      textRules: [v => !!v || "This field cannot be empty!"],
      isRun: false,
      result: null,
      headerSentences: [
        { text: "Index", value: "index" },
        { text: "Sentence", value: "sentence" }
      ],
      headerStem: [
        { text: "Original", value: "ori" },
        { text: "Result", value: "res" }
      ],
      stepList: [
        { step: 1, name: "Document to Sentences" },
        { step: 2, name: "Lexical" },
        { step: 3, name: "Stopword" },
        { step: 4, name: "Tokenizing" },
        { step: 5, name: "Stemming" }
      ]
    };
  },
  methods: {
    run() {
      this.loading = !this.loading;
      axios.post(`https://npl-server.herokuapp.com/`, { text: this.text }).then(res => {
        this.result = res.data.result;

        this.loading = !this.loading;
      });
    }
  }
};
</script>

<style>
</style>