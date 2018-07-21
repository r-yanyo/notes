<template>
  <div class="home">
    <div class='header'>
      <div class='buttons'>
        <span class="icon is-midium">
          <button @click="addMemo"><i class="fas fa-2x fa-edit"></i></button>
        </span>
        <span class="icon is-midium">
          <button @click="deleteMemo"><i class="far fa-2x fa-trash-alt"></i></button>
        </span>
        <span class="icon is-midium">
          <button @click="saveMemos"><i class="far fa-2x fa-save"></i></button>
        </span>
      </div>
      <div>
        <p v-if="user" style="display: inline-block">{{user.displayName}}</p>
        <button @click="logout">ログアウト</button>
      </div>
    </div>

    <div class="level mainContent">
      <div class="memosWrapper">
        <div class="memoList" v-for="(memo, index) in memos" @click="selectMemo(index)" :data-selected="index==selectedIndex" v-bind:key="index">
          <p class="memo-title">{{memo.markdown | title}}</p>
          <p class="memo-digest">{{memo.markdown | digest}}</p>
        </div>
      </div>
      <div class="editorWrapper">
        <textarea class="editor" placeholder="todo" v-model="memos[selectedIndex].markdown" />
      </div>
    </div>
  </div>
</template>

<script>
import auth from "../utils/auth";

/* global firebase */

export default {
  data() {
    return {
      user: null,
      memos: [
        {
          markdown: "load中"
        }
      ],
      selectedIndex: 0
    };
  },
  created() {
    auth.getUser().then(user => {
      this.user = user;
      firebase
        .database()
        .ref("memos/" + this.user.uid)
        .once("value")
        .then(result => {
          if (result.val()) {
            this.memos = result.val();
          }
        });
    });
  },
  filters: {
    title(markdown) {
      return markdown !== "" ? markdown.split("\n")[0] : "New memo";
    },
    digest(markdown) {
      const digest = markdown.split("\n")[1];
      return digest !== undefined && digest !== ""
        ? digest
        : "No additional text";
    }
  },
  methods: {
    logout() {
      auth.logout();
    },
    addMemo() {
      this.memos.push({
        markdown: ""
      });
      this.selectedIndex = this.memos.length - 1;
    },
    deleteMemo() {
      this.memos.splice(this.selectedIndex, 1);
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    selectMemo(index) {
      this.selectedIndex = index;
    },
    saveMemos() {
      firebase
        .database()
        .ref("memos/" + this.user.uid)
        .set(this.memos);
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
.header {
  display: flex;
  padding: 10px;
  justify-content: space-around;
  border-bottom: solid 1px gray;
  background-color: #dad9da;
}
.mainContent {
  height: 100%;
  align-items: start;
}
.memosWrapper {
  width: 30%;
}
.memoList {
  &[data-selected="true"] {
    background-color: #fde36d;
  }
}
.buttons {
  flex-grow: 1;
  .icon {
    margin: 0 5%;
  }
}
.editorWrapper {
  width: 100%;
  height: 100%;
}
.editor {
  width: 100%;
  height: 100%;
  border: solid 1px silver;
}
.icon {
  button {
    box-sizing: content-box;
    border-radius: 10%;
    border-color: white;
  }
}
</style>
