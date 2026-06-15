On-screen QWERTY that reskins per theme and colours keys by best-known letter state.

```jsx
<Keyboard
  letterStates={{ a:'correct', t:'present', e:'absent' }}
  onKey={(k) => handle(k)}
/>
```

`onKey` receives a lowercase letter, `'enter'`, or `'back'`.
