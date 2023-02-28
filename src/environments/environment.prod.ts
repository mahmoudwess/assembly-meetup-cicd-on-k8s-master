export const environment = {
  production: true,
  wssUrl: "/",
  defaultRoom: "home",
  maxMediaAttemps: 5,
  defaultMediaConstraints: {
    audio: true,
    video: { facingMode: "user" }
  },
  defaultRtcConfig: {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      }
    ]
  }
};
