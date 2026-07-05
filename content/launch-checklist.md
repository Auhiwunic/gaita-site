# Gaita v1.0 — Pre-Launch Checklist

Built from a 3-agent research pass (App Store review + iOS hardening + QA, with cited sources) and a code audit of the current app. `✅` = verified done in code. `⬜` = still to do (many are App Store Connect / process, not code).

---

## (A) BLOCKERS — green before you submit

**Paywall / StoreKit**
- ⬜ **#1 RISK — give App Review a working path to the paywalled coach + scan.** The `#if DEBUG` demo-unlock is compiled OUT of the Release build the reviewer runs, so they'll be blocked. Fix: add a **sandbox tester account** in App Store Connect → App Review Information AND confirm a real StoreKit sandbox purchase completes on the paywall. (Optionally a review-only server entitlement.)
- ✅ Auto-renew disclosure + Terms + Privacy links on the in-app paywall (PaywallView).
- ✅ `Transaction.updates` listener (Subscriptions.swift). — verify it starts at launch before UI and handles Ask-to-Buy/renewal.
- ⬜ Confirm DEBUG unlock cannot leak into a Release entitlement check (grep archived binary).

**Privacy / account**
- ✅ In-app account deletion exists (ProfileView / FirebaseAuthManager) — verify it purges Firebase Auth + Firestore run/route + stored videos server-side.
- ✅ PrivacyInfo.xcprivacy shipped (app + Firebase pods).
- ✅ Info.plist usage strings are specific per feature (camera/photos/mic/location/health/motion).
- ⬜ Complete the **App Privacy "nutrition" labels** in App Store Connect to match Firebase reality (Health, Precise Location, Camera/Photos, Identifiers/Diagnostics, Purchases).
- ⬜ Privacy Policy URL live in App Store Connect AND linked in-app; Support + Marketing URLs resolve.

**Crash resilience + observability**
- ✅ Crashlytics integrated (pod + `CrashReporter` wrapper + dSYM-upload build phase); auto-inits via `FirebaseApp.configure()`, non-fatal recording wired on the coach path. TODO: force a test crash on a real TestFlight build to confirm symbolication end-to-end.
- ✅ Force-unwraps already safe: 0 `try!`, the 1 `as!` is the `layerClass` pattern, `.last!` all `.isEmpty`-guarded, BlazePose `landmarks[index]` is bounds-guarded, joints read via optional `point()`/`point3D()`. (SwiftLint gate still worth adding as a CI backstop.)
- ⬜ Test camera + BlazePose on a physical device: live + library import, short + long (>2 min 1080p) clip, and a clip with no person — no crash/OOM.
- ⬜ Test every permission DENIED (camera, health, location, mic, notifications) — degrade, never dead-end.

**Device / backend**
- ⬜ Validate on an iPhone SE-class device under thermal + memory pressure during pose inference.
- ⬜ Cold-launch < 1s, no main-thread work in launch; upgrade-migration test (runs/routes survive build-over-build).
- ✅ Firebase Remote Config kill-switches wired (`coach_enabled`, `scan_enabled`, `min_supported_build`, `maintenance_message`) with bundled offline defaults; coach answers locally + scan shows "unavailable" when flipped off. TODO: create the params in the Firebase console.

## (B) SHOULD-FIX — before launch

- ✅ Restore Purchases button (PaywallView). ✅ Sign in with Apple present (onboarding). ✅ Background modes + `ITSAppUsesNonExemptEncryption` set.
- ⬜ StoreKit: handle `.pending` (Ask-to-Buy), always `transaction.finish()`, grant during grace/billing-retry, wire refund/`.revoked`.
- ⬜ HealthKit: ensure no health/derived data goes to iCloud backup or Firebase analytics/ads; request only what you use.
- ⬜ Frame power/impact/efficiency/grades as training metrics, not medical; add "not medical advice" disclaimer.
- ⬜ Background `location` only during an active run; `audio` is genuinely the TTS coach; justify both in Review notes.
- ⬜ Video-ML memory: inner `autoreleasepool` per frame, `defer`-release CVPixelBuffer on error paths, reuse model + AVAssetReader, decimate FPS; audit `[weak self]`; cooperative `Task.checkCancellation()` when leaving Analyze.
- ⬜ Network: explicit timeouts + bounded retry/backoff for the coach Cloud Function; Firestore offline persistence + `fromCache` surfaced.
- ⬜ Every async surface has loading/empty/error/success states (empty Past Runs, failed-analysis retry, coach-thinking).
- ⬜ Dynamic Type AX5 + VoiceOver sweep of onboarding / live-run / paywall; contrast ≥4.5:1; honor Reduce Motion.
- ⬜ External TestFlight beta across SE / 13-15 / 16 Pro Max, latest + N-1 iOS; ≥1 full live run per class.
- ⬜ Server quota/rate-limit + GCP budget alerts on the coach function; screenshots reflect v1.0 + note coach/scan need a sub; submit as the company entity (health data).

## (C) POST-LAUNCH / NICE-TO-HAVE
MetricKit; thermal-state FPS scaling; Low Power Mode; incremental run-state checkpointing; launch-funnel analytics (no PII); crash-free alerting (≥99.5%); phased 7-day release; localization/pseudolocalization + `Measurement` for km/mi.

## Top 10 most likely to bite THIS app
1. Reviewer can't reach paywalled coach/scan (DEBUG unlock absent in Release). 2. Subscription Terms/Privacy links must be on the in-app paywall (✅ present — keep). 3. In-app account deletion must fully purge server data (✅ exists — verify). 4. BlazePose+AVFoundation OOM on long clips on SE-class. 5. App Privacy labels vs Firebase reality. 6. Generic usage strings (✅ already specific). 7. `Transaction.updates` for the full lifetime (✅ present — verify timing). 8. Background location/audio justification. 9. HealthKit data not leaking to iCloud/analytics. 10. Privacy manifests complete (✅ present — verify Firebase pods signed).

## Resources
- App Review Guidelines — https://developer.apple.com/app-store/review/guidelines/
- Offering Account Deletion — https://developer.apple.com/support/offering-account-deletion-in-your-app/
- HealthKit privacy — https://developer.apple.com/documentation/healthkit/protecting-user-privacy
- Privacy manifest files — https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
- Background location — https://developer.apple.com/documentation/corelocation/handling-location-updates-in-the-background
- Reducing launch time — https://developer.apple.com/documentation/xcode/reducing-your-app-s-launch-time
