import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.amber.darken1,
                secondary: colors.grey.lighten4
            },
            dark: {
                primary: colors.amber.darken4,
                secondary: colors.grey.darken3
            }
        },
    },
});
