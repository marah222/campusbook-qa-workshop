// Local/staging-only teaching experiment. NEVER run against public or production systems.
import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:3000';
export const options = {
  vus: Number(__ENV.VUS || 1), duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99']
  }
};
export default function () {
  const response = http.get(`${baseUrl}/api/rooms?minCapacity=3`, {
    headers: { 'x-demo-user': 'alice', 'x-test-scope': 'performance' }
  });
  check(response, {
    'status 200': r => r.status === 200,
    'JSON array returned': r => {
      try { return Array.isArray(r.json()); } catch { return false; }
    }
  });
  sleep(1);
}
