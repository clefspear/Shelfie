#!/bin/bash

# Deploy the payments webhook without JWT verification
echo "Deploying payments-webhook function with JWT verification disabled..."
supabase functions deploy payments-webhook --no-verify-jwt

# You can add other webhook deployments here
# echo "Deploying other-webhook function with JWT verification disabled..."
# supabase functions deploy other-webhook --no-verify-jwt

echo "All webhook functions deployed successfully!"
