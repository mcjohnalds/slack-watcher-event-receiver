source .env
gcloud beta functions deploy event --stage-bucket $STAGING_BUCKET --trigger-http
