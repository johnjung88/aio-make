import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  verifySlack,
  ownerAllowed,
  replyAddress,
  matchReplyAddress,
} from "../../lib/marketing/security";
import { publicRedirect } from "../../lib/marketing/routes";
const now = Date.now(),
  timestamp = String(Math.floor(now / 1000)),
  raw = "payload=test",
  secret = "test-secret";
const sig =
  "v0=" +
  createHmac("sha256", secret).update(`v0:${timestamp}:${raw}`).digest("hex");
assert(verifySlack(raw, timestamp, sig, secret, now));
assert(!verifySlack(raw + "x", timestamp, sig, secret, now));
assert(!verifySlack(raw, timestamp, sig, secret, now + 301000));
assert(!verifySlack(raw, timestamp, sig, "", now));
process.env.MARKETING_SLACK_OWNER = "owner";
process.env.MARKETING_SLACK_TEAM = "team";
process.env.MARKETING_SLACK_CHANNEL = "private";
assert(
  ownerAllowed({
    user: { id: "owner" },
    team: { id: "team" },
    channel: { id: "private" },
  }),
);
assert(
  !ownerAllowed({
    user: { id: "bot" },
    team: { id: "team" },
    channel: { id: "private" },
  }),
);
assert(
  !ownerAllowed({
    user: { id: "owner" },
    team: { id: "other" },
    channel: { id: "private" },
  }),
);
process.env.MARKETING_REPLY_DOMAIN = "reply.example.com";
process.env.MARKETING_REPLY_SECRET = "test";
const id = crypto.randomUUID();
assert.equal(matchReplyAddress(replyAddress(id)), id);
assert.equal(
  matchReplyAddress(
    replyAddress(id).replace("reply.example.com", "evil.example.com"),
  ),
  null,
);
assert.deepEqual(publicRedirect("/en/services/marketing"), {
  path: "/ko/services/marketing",
  permanent: true,
});
assert.deepEqual(publicRedirect("/en/not-found"), {
  path: "/ko",
  permanent: true,
});
assert.deepEqual(publicRedirect("/ko/services/video"), {
  path: "/ko#business",
  permanent: false,
});
assert.equal(publicRedirect("/ko/quote"), null);
assert.equal(publicRedirect("/ko/services/marketing"), null);
console.log(
  "PASS: Slack signature/timestamp, owner/team/channel authorization, signed reply routing, English/retired route mapping",
);

assert.deepEqual(publicRedirect("/services/video"), {
  path: "/ko#business",
  permanent: false,
});
assert.deepEqual(publicRedirect("/quote"), {
  path: "/ko/quote",
  permanent: true,
});
