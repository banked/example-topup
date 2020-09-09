
push:
	gcloud config set project banked
	gcloud builds submit --tag gcr.io/banked/banked-example-topup

deploy:
	gcloud config set project banked
	gcloud run deploy example-topup --image gcr.io/banked/banked-example-topup --platform=managed  --region=europe-west4 --update-env-vars GCP_PROJECT_ID=banked --update-env-vars BANKED_API_SECRET=sk_test --update-env-vars BANKED_API_KEY=pk_test --port 3000
