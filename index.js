require("dotenv").config();
const pubsub = require("@google-cloud/pubsub")({
  projectId: process.env.GOOGLE_PROJECT,
  keyFilename: process.env.KEY_FILE
});
const topic = pubsub.topic(process.env.PUBSUB_TOPIC);
const publisher = topic.publisher();

exports.event = (req, res) => {
  if (!isRequestValid(req)) {
    res.end();
    return;
  }
  if (req.body.type === "url_verification") {
    res.send(req.body.challenge);
    return;
  }
  // Slack docs recommends responding ASAP and processing later
  res.end();
  if (req.body.type === "event_callback") {
    const event = req.body.event;
    publishEvent(event);
  }
};

const isRequestValid = req =>
  req.method === "POST" &&
  req.body.token === process.env.SLACK_VERIFICATION_TOKEN;

const publishEvent = event =>
    publisher
      .publish(new Buffer(JSON.stringify(event)))
      .catch(err => console.error(err));
