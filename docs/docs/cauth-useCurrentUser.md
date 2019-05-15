---
id: cauth-current-user
title: useCurrentUser
---

**Format:** `(options, callback) => [{currentUser, fetchingUser}, setCurrentUser]`

This hook provides returns your current logged user, and a function to change it (locally).
It receives two arguments, the first is the `options` object, the second a callback function.
The function gets called when there is no access token saved (means, when there is no user logged).
