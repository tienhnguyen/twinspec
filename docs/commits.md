---
title: Commits
description: "Read this before you commit"
---
## Message

```
{area}: {summary}

{the problem}

{the change}

Signed-off-by: {name} <{email}>
```

- Follow the patch rules of the Linux kernel
- Start the subject with the area of the change
- Keep the summary at 75 characters or fewer
- Write the summary in the imperative mood
- Describe the problem before the change
- Write the change in the imperative mood
- Keep the body short
- Wrap the body at 75 columns
- Write each line of the message with the rules of [`writing.md`](writing.md)

## Sign-off

- Commit with `git commit -s`
- The flag `-s` adds the line `Signed-off-by` with your name
- This line certifies the Developer Certificate of Origin

## Signature

```sh
git config gpg.format ssh
git config user.signingkey {path of your SSH key}
git config commit.gpgsign true
```

- Sign each commit with an SSH key
- The setting `commit.gpgsign` signs each commit without the flag `-S`
- Add the public key to GitHub as a signing key
- GitHub needs this key to show the badge `Verified`
- An SSH signature needs Git 2.34 or later

## See also

- [Submitting patches](https://docs.kernel.org/process/submitting-patches.html) explains the commit format of the Linux kernel
- [Developer Certificate of Origin](https://developercertificate.org/) explains what `Signed-off-by` certifies
- [Commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) explains the badge `Verified` of GitHub
