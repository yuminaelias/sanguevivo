# SangueVivo — uma ligação que salva vidas

## Grounding
- Subject: voluntary blood donation and verified mobilisation in Mozambique.
- Audience: adult volunteer donors and authorised hospital staff.
- Core action: register willingness, respond to a validated appeal, and follow its clinical confirmation.
- Moment of use: a calm one-handed check of nearby needs, often while travelling or between daily tasks.

## Directions considered
1. Clinical ledger: white, cobalt, monospace blood types, tightly grouped institution rows.
2. Human solidarity: deep oxblood, pale rose and forest green, large editorial text and a close photograph of connected hands.
3. Civic network: charcoal and maize yellow, a district-first directory with diagrammatic connections.
Chosen: human solidarity. The ledger feels bureaucratic; the network implies precision of location we intentionally do not collect.

## Identity and tokens
- Blood / #A82039 → light accent; dark accent #FF8295.
- Paper / #FFF8F8 → light background.
- Ink / #291B22 → light foreground; dark background #1C1419.
- White coat / #FFFFFF → light surface; dark surface #302229.
- Quiet plum / #78656D → light muted; dark muted #C4AFB8.
- Trust green / #19735C → light success; dark success #79D5B1.
Dark text uses #FFF4F6. Accents carry white text in light mode and dark ink in dark mode.
System SF Pro / Roboto body; heavy large headlines with close leading, very large blood type glyphs. No display-font download. Editorial, reassuring, not gamified.
Imagery: bundled documentary-style photograph, warm natural daylight, Black African adult donor's hand gently supported by a health worker, no needles, no identifying labels. Photo is illustrative, never a real hospital endorsement.
Motion: standard, cubic-out timing tokens. Signature: “Ligação confirmada”: a check draws inside a quiet green circle after a saved donor profile or willingness response, paired with a success haptic. Beats: saved response arrives; circle is present immediately; stroke draws in 200 ms; thank-you stays readable. Reduced motion shows the final stroke immediately. No donation goals or pressure-inducing streaks.

## Shell
```
[ system status ]
[ SangueVivo        bell ]
[ scrollable content    ]
[ Mobilizar | Actividade | Perfil ]  native liquid glass
```
Pushed forms have a visible Voltar control. Tabs share paper, ink, red accent and safe-area rhythm. Content scrolls beneath the native bar, controls begin above it.

## Home alternatives
A rejected: title → number of donors → three statistic tiles → requests. Generic dashboard; counts would imply an active network before there is one.
B kept:
```
SangueVivo                     bell
Uma ligação que salva vidas.
[ documentary hands photograph ]
A próxima ligação
pode começar consigo.
[ Quero ser doador ]
Pedidos na sua região     Filtrar
[ validated requests OR honest empty invitation ]
[ Comunicar necessidade ]
Segurança: avaliação clínica sempre necessária
```
After registration the hero action becomes “Actualizar disponibilidade”. Never invent live emergencies or claim a unit is verified without institutional approval.

## Screens
Mobilizar: photo-led thesis, district/group filters, actual approved blood needs, report need entry. Empty request list explicitly says none published yet.
Actividade: private submitted appeals, willingness responses and hospital-confirmed donation history; sign-in invitation if signed out. Timeline statuses, not statistic tiles. Verified staff can open their restricted unit workspace.
Perfil: large blood-group donor passport, declared district and availability; edit, notification preferences, privacy, sign out and confirmed account deletion.
Request detail: group, verified institution, urgency, district, expiry, evaluation disclaimer; save a visit intention without promising eligibility.
Forms: email/password account, donor consent, structured appeal submission. Submitters cannot publish or verify themselves. Institutional console only appears for server-authorised membership; staff validates appeals and confirms donations.
Notifications: contextual permission action, persistent switches for urgent requests, campaigns, and appointment updates; no automatic permission prompt; explain delivery setup pending and no SMS/email integration yet.
Privacy: health data purpose, minimisation, withdrawal, access boundaries, account deletion. No exact geolocation is collected. Public requests never show donor details.

## Plan check
Replaced the default grouped-card dashboard with a documentary opening and typography. No fake donor counts, reward pressure, urgency based on timers, fabricated distances or fabricated emergency requests. Cards are only real request/passport objects. Removed decorative statistics; the user’s actual next action is the focal point.

## Unmistakable
An oxblood-and-paper donor network whose quiet documentary hands and blood-group passport connect Mozambican districts to verified care, without exposing a person’s location.
