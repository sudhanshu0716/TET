import http from 'k6/http';
import { check, sleep, group } from 'k6';

// k6 options default values, can be overridden by CLI flags
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.05'], // Under 5% failure rate
    http_req_duration: ['p(95)<2000'], // 95% of requests should be under 2s (2000ms)
  },
};

// Custom handleSummary to export JSON for our visual report generator
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data, null, 2),
  };
}

export default function () {
  // Use target URL from environment or default to local/production
  const baseUrl = __ENV.TARGET_URL || 'https://tet-exam-lake.vercel.app';
  
  // Create a unique random email for registration to avoid collisions
  const uniqueId = `${__VU}_${__ITER}_${Math.floor(Math.random() * 1000000)}`;
  const email = `loadtest_${uniqueId}@tetload.com`;
  const password = 'LoadTestPassword123';
  let jwtToken = null;

  // --- STAGE 1: Public Healthcheck ---
  group('01_Public_Healthcheck', function () {
    const res = http.get(`${baseUrl}/api/status`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'body contains message': (r) => r.body.indexOf('Prep API') !== -1,
    });
  });

  sleep(1);

  // --- STAGE 2: User Sign Up & Authenticate ---
  group('02_Authentication', function () {
    const registerPayload = JSON.stringify({
      name: `Load Tester ${__VU}`,
      email: email,
      password: password,
      level: 'primary',
      language1: 'Hindi',
      language2: 'English',
      subject_preference: 'none'
    });

    const headers = { 'Content-Type': 'application/json' };

    const regRes = http.post(`${baseUrl}/api/auth/register`, registerPayload, { headers });
    const isRegOk = check(regRes, {
      'register status is 200': (r) => r.status === 200,
      'register returns token': (r) => r.json().token !== undefined,
    });

    if (isRegOk) {
      jwtToken = regRes.json().token;
    } else {
      // Fallback: Login if user already exists
      const loginPayload = JSON.stringify({ email, password });
      const loginRes = http.post(`${baseUrl}/api/auth/login`, loginPayload, { headers });
      const isLoginOk = check(loginRes, {
        'login status is 200': (r) => r.status === 200,
        'login returns token': (r) => r.json().token !== undefined,
      });
      if (isLoginOk) {
        jwtToken = loginRes.json().token;
      }
    }
  });

  // If authentication failed, we cannot proceed with authenticated steps
  if (!jwtToken) {
    sleep(1);
    return;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'x-auth-token': jwtToken,
  };

  sleep(1.5);

  // --- STAGE 3: Access Dashboard & Stats ---
  group('03_User_Dashboard', function () {
    const profileRes = http.get(`${baseUrl}/api/auth/profile`, { headers: authHeaders });
    check(profileRes, {
      'profile fetch is 200': (r) => r.status === 200,
      'profile name matches': (r) => r.json().name !== undefined,
    });

    const statsRes = http.get(`${baseUrl}/api/auth/stats`, { headers: authHeaders });
    check(statsRes, {
      'stats fetch is 200': (r) => r.status === 200,
      'stats contains examsTaken': (r) => r.json().examsTaken !== undefined,
    });
  });

  sleep(2);

  // --- STAGE 4: Start & Submit a Daily Exam (High DB Load!) ---
  let examId = null;
  let questions = [];

  group('04_Practice_Exam_Flow', function () {
    // Generate a daily practice test (triggers 4 database aggregates)
    const examRes = http.get(`${baseUrl}/api/exams/today?count=10&duration=10`, { headers: authHeaders });
    const isExamCreated = check(examRes, {
      'exam creation is 200 or 403 (trial)': (r) => r.status === 200 || r.status === 403,
    });

    if (isExamCreated && examRes.status === 200) {
      const examData = examRes.json();
      if (examData.exam && examData.exam.exam_id) {
        examId = examData.exam.exam_id;
        questions = examData.questions || [];
      }
    }

    // Simulate answering questions if exam was successfully generated
    if (examId && questions.length > 0) {
      sleep(3); // Simulate 3 seconds of "thinking time" to read questions

      // Prepare answers for the questions
      const answersPayload = JSON.stringify({
        exam_id: examId,
        answers: questions.slice(0, 3).map((q) => ({
          question_id: q.question_id,
          selected_option: 'A' // Mock answer
        })),
        score: 2
      });

      const submitRes = http.post(`${baseUrl}/api/exams/submit/${examId}`, answersPayload, { headers: authHeaders });
      check(submitRes, {
        'exam submission is 200': (r) => r.status === 200,
        'submission completes exam': (r) => r.json().exam && r.json().exam.completed === true,
      });
    }
  });

  sleep(2);

  // --- STAGE 5: Fetch Study Materials & Analytics (Complex Aggregates!) ---
  group('05_Analytics_And_Study', function () {
    // Browse study resources
    const sheetsRes = http.get(`${baseUrl}/api/cheatsheets`, { headers: authHeaders });
    check(sheetsRes, {
      'cheatsheets fetch is 200 or 403': (r) => r.status === 200 || r.status === 403,
    });

    const tricksRes = http.get(`${baseUrl}/api/super-tricks`, { headers: authHeaders });
    check(tricksRes, {
      'tricks fetch is 200 or 403': (r) => r.status === 200 || r.status === 403,
    });

    // Check analytical performance insights (triggers multi-collection $lookup and $group in DB!)
    const insightsRes = http.get(`${baseUrl}/api/exams/insights`, { headers: authHeaders });
    check(insightsRes, {
      'insights fetch is 200': (r) => r.status === 200,
    });

    const subtopicRes = http.get(`${baseUrl}/api/exams/subtopic-insights`, { headers: authHeaders });
    check(subtopicRes, {
      'subtopic insights fetch is 200': (r) => r.status === 200,
    });
  });

  sleep(2); // Final pause before next iteration
}
