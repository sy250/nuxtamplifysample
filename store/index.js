export const state = () => ({
  posts: [],
  loginUser: '',
  loginState: '',
  note: {
    id: String,
    name: String,
    description: String
  },
});

export const mutations = {
  setPosts(state, posts) {
    state.posts = posts;
  },
  setUser(state, user) {
    state.loginUser = user;
  },
  setState(state, status) {
    state.loginState = status;
  },
  setNote(state, note) {
    console.log(note);
    state.note.id = note.id;
    state.note.name = note.name;
    state.note.description = note.description;
  },
}

export const actions = {
  setPosts({ commit }, posts) {
    commit('setPosts', posts)
  },
  setUser({ commit }, user) {
    commit('setUser', user)
  },
  setState({ commit }, status) {
    commit('setState', status)
  },
  setNote({ commit }, note) {
    commit('setNote', note)
  },
}