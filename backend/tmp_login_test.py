import sys
from fastapi.testclient import TestClient
sys.path.insert(0, r'd:\sandesh_repos\fastapiapp\backend')
import app.main as main

client = TestClient(main.app, raise_server_exceptions=True)

try:
    resp = client.post(
        '/auth/login',
        data={'username': 'test0@example.com', 'password': 'Password123'},
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    print('status', resp.status_code)
    print(resp.text)
    if resp.headers.get('content-type', '').startswith('application/json'):
        print('json', resp.json())
except Exception:
    import traceback
    traceback.print_exc()
