const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    extend: {
      colors: {
        'base': {
          '50': '#fefefe', 
          '100': '#fefefd', 
          '200': '#fcfbfa', 
          '300': '#fbf9f7', 
          '400': '#f7f5f2', 
          '500': '#F4F0EC', 
          '600': '#dcd8d4'
        },
        'primary': {
          '50': '#f3fbf9', 
          '100': '#e6f6f4', 
          '200': '#c1e9e3', 
          '300': '#9bdbd2', 
          '400': '#50c1b1', 
          '500': '#05A68F', 
          '600': '#059581', 
          '700': '#047d6b', 
          '800': '#036456', 
          '900': '#025146'
        },
        't-base': {
          '50': '#fefeff', 
          '100': '#fefefe', 
          '200': '#fcfcfe', 
          '300': '#faf9fd', 
          '400': '#f6f5fb', 
          '500': '#F2F1F9',
          '600': '#efeef8'
        },
        't-primary': {
          '50': '#fff6f8', 
          '100': '#feeef2', 
          '200': '#fed4de', 
          '300': '#fdbaca', 
          '400': '#fb87a2',
          '500': '#f9537a', 
          '600': '#e04b6e', 
          '700': '#bb3e5c', 
          '800': '#953249', 
          '900': '#7a293c'
        },
        't-secondary': {
          '50': '#f9f9fc', 
          '100': '#f3f2fa', 
          '200': '#e1dff1', 
          '300': '#cfcbe9', 
          '400': '#aca5d9', 
          '500': '#887EC8', 
          '600': '#7a71b4', 
          '700': '#665f96', 
          '800': '#524c78', 
          '900': '#433e62'
        },
        't-gray': {
          '50': '#f6f7f8', 
          '100': '#edeef1', 
          '200': '#d1d5dd', 
          '300': '#b5bcc8', 
          '400': '#7e899e', 
          '500': '#465775', 
          '600': '#3f4e69', 
          '700': '#354158', 
          '800': '#2a3446', 
          '900': '#222b39'
        }
      },
      transitionProperty: {
        'width': 'width'
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled', 'active'],
    borderColor: ['responsive', 'hover', 'focus', 'disabled'],
    cursor: ['responsive', 'disabled'],
    outline: ['focus'],
    textColor: ['responsive', 'hover', 'focus', 'disabled', 'active'],
  },
  plugins: [],
  corePlugins: {
    outline: false
  }
};
