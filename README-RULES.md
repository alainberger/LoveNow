# Firestore Security Rules

- **Users**: public read, users can update only their document.
- **Messages**: read/write allowed only to participants of the match.
- **Likes**: user can create if `fromUid` matches auth.uid.
- **Matches**: readable only by matched users.
- **Purchases**: readable by owner, write disabled by default.
- **Referrals**: readable and writable by inviter or invitee.
- **Reports**: any authenticated user may create, no reads.
- **Blocks**: user can create and read their own blocks.
