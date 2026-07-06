import json, urllib.request

PORTAINER_URL = "http://85.198.23.48:9000"
PASSWORD = "cloud.ir@1404"
ENDPOINT_ID = 1

# Login
req = urllib.request.Request(f"{PORTAINER_URL}/api/auth",
    data=json.dumps({"Username":"admin","Password":PASSWORD}).encode(),
    headers={"Content-Type":"application/json"})
resp = json.loads(urllib.request.urlopen(req).read())
JWT = resp["jwt"]
print(f"✅ Logged in to Portainer (endpoint {ENDPOINT_ID})")

# Create stack FROM GIT REPOSITORY
data = {
    "Name": "hamahang",
    "RepositoryURL": "https://github.com/coldhell7/Hamahang-dating.git",
    "RepositoryReferenceName": "refs/heads/main",
    "ComposeFilePathInRepository": "docker/docker-compose.prod.yml",
    "Env": [
        {"name": "DB_PASSWORD", "value": "hamahang_secret_1403"},
        {"name": "JWT_SECRET", "value": "hamahang-jwt-secret-85-198-23-48-prod"},
        {"name": "JWT_REFRESH_SECRET", "value": "hamahang-refresh-secret-85-198-23-48-prod"}
    ]
}

url = f"{PORTAINER_URL}/api/stacks/create/standalone/repository?endpointId={ENDPOINT_ID}"
req2 = urllib.request.Request(url,
    data=json.dumps(data).encode(),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JWT}"
    })

try:
    resp2 = json.loads(urllib.request.urlopen(req2).read())
    print(f"✅ Stack created: {resp2.get('Name', '?')} (ID: {resp2.get('Id', '?')})")
    print(f"Status: {resp2.get('Status', '?')}")
except urllib.error.HTTPError as e:
    error_body = e.read().decode()
    print(f"❌ Error {e.code}: {error_body[:500]}")
