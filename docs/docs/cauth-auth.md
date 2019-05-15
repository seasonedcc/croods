---
id: cauth-auth-component
title: Auth Component
---

This is a helper component that makes it easier to protect a page from unauthorized access. It receives the following props, and passes to the component the `currentUser` and any other props you may pass it.

| Property                                    |    Type     | Required |                        Default                         |
| ------------------------------------------- | :---------: | :------: | :----------------------------------------------------: |
| [Component](#component)                     |    Func     |    ✔     |                           -                            |
| [unauthorized](#unauthorized)               |    Func     |    ✔      |                           -                            |
| [unauthorize](#unauthorize)                 |    Func     |          |                         currentUser  !== undefined                        |
| [loading](#loading)                         |    Func     |          |                         false                          |



## Component
This is the component being protected

## unauthorized
This is where you tell what to do when someone who shouldn't tries to access it.
## unauthorize
A function defining who should have access.

## loading
A loading function.
